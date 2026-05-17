function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

const GOOGLE_SETTINGS = [
  ['google_ga4_measurement_id', 'google', 'text', 'GA4 Measurement ID'],
  ['google_ga4_active', 'google', 'boolean', 'GA4 attivo'],
  ['google_ads_conversion_id', 'google', 'text', 'Google Ads Conversion ID'],
  ['google_ads_purchase_label', 'google', 'text', 'Google Ads purchase label'],
  ['google_ads_active', 'google', 'boolean', 'Google Ads attivo'],
  ['google_search_console_verification', 'google', 'text', 'Search Console verification'],
  ['google_gtm_container_id', 'google', 'text', 'GTM Container ID'],
  ['google_gtm_active', 'google', 'boolean', 'GTM attivo'],
  ['google_tag_id', 'google', 'text', 'Google Tag ID'],
  ['google_tag_active', 'google', 'boolean', 'Google Tag attivo'],
]

const GOOGLE_DEFAULTS = GOOGLE_SETTINGS.reduce((settings, [key]) => {
  settings[key] = ''
  return settings
}, {})

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function sanitizeBoolean(value) {
  return value === true || value === '1' || value === 1 || value === 'true'
    ? '1'
    : '0'
}

function sanitizeTagValue(value = '') {
  return String(value || '')
    .trim()
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/[<>"']/g, '')
    .slice(0, 180)
}

function normalizeVerification(value = '') {
  const raw = String(value || '').trim()
  const contentMatch = raw.match(/content=["']([^"']+)["']/i)
  return sanitizeTagValue(contentMatch ? contentMatch[1] : raw)
}

function normalizeSettings(input = {}) {
  const settings = {
    google_ga4_measurement_id: sanitizeTagValue(input.google_ga4_measurement_id).toUpperCase(),
    google_ga4_active: sanitizeBoolean(input.google_ga4_active),
    google_ads_conversion_id: sanitizeTagValue(input.google_ads_conversion_id).toUpperCase(),
    google_ads_purchase_label: sanitizeTagValue(input.google_ads_purchase_label),
    google_ads_active: sanitizeBoolean(input.google_ads_active),
    google_search_console_verification: normalizeVerification(input.google_search_console_verification),
    google_gtm_container_id: sanitizeTagValue(input.google_gtm_container_id).toUpperCase(),
    google_gtm_active: sanitizeBoolean(input.google_gtm_active),
    google_tag_id: sanitizeTagValue(input.google_tag_id).toUpperCase(),
    google_tag_active: sanitizeBoolean(input.google_tag_active),
  }

  if (settings.google_ga4_measurement_id && !/^G-[A-Z0-9-]+$/.test(settings.google_ga4_measurement_id)) {
    return { settings, error: 'GA4 Measurement ID non valido. Usa un valore tipo G-XXXXXXXXXX.' }
  }

  if (settings.google_gtm_container_id && !/^GTM-[A-Z0-9-]+$/.test(settings.google_gtm_container_id)) {
    return { settings, error: 'GTM Container ID non valido. Usa un valore tipo GTM-XXXXXXX.' }
  }

  if (settings.google_tag_id && !/^(G|AW)-[A-Z0-9-]+$/.test(settings.google_tag_id)) {
    return { settings, error: 'Google Tag ID non valido. Usa un valore tipo G-XXXXXXXXXX o AW-XXXXXXXX.' }
  }

  if (settings.google_ads_conversion_id && !/^AW-[A-Z0-9-]+$/.test(settings.google_ads_conversion_id)) {
    return { settings, error: 'Google Ads Conversion ID non valido. Usa un valore tipo AW-XXXXXXXX.' }
  }

  return { settings, error: '' }
}

async function loadGoogleSettings(env) {
  const keys = GOOGLE_SETTINGS.map(([key]) => key)
  const placeholders = keys.map(() => '?').join(',')
  const { results } = await env.DB.prepare(`
    SELECT key, value
    FROM site_settings
    WHERE key IN (${placeholders})
  `)
    .bind(...keys)
    .all()

  return (results || []).reduce(
    (settings, row) => ({
      ...settings,
      [row.key]: row.value || '',
    }),
    { ...GOOGLE_DEFAULTS },
  )
}

async function saveGoogleSettings(env, settings) {
  const metaByKey = Object.fromEntries(GOOGLE_SETTINGS.map(([key, group, type, label]) => [key, { group, type, label }]))

  for (const [key, value] of Object.entries(settings)) {
    const meta = metaByKey[key]
    if (!meta) continue

    await env.DB.prepare(`
      INSERT INTO site_settings (key, value, group_name, type, label, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        group_name = excluded.group_name,
        type = excluded.type,
        label = excluded.label,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(key, value, meta.group, meta.type, meta.label)
      .run()
  }
}

async function logGoogleActivity(env, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, description)
      VALUES ('update', 'google_suite', ?)
    `)
      .bind(description)
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    return json({
      success: true,
      settings: await loadGoogleSettings(env),
    })
  } catch {
    return json({ success: false, message: 'Google Suite non disponibile.' }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const { settings, error } = normalizeSettings(body.settings || body)

    if (error) {
      return json({ success: false, message: error }, 400)
    }

    await saveGoogleSettings(env, settings)
    await logGoogleActivity(env, 'Configurazione TakeOff Google Suite aggiornata.')

    return json({
      success: true,
      message: 'Configurazione Google Suite salvata.',
      settings,
    })
  } catch {
    return json({ success: false, message: 'Salvataggio Google Suite non riuscito.' }, 500)
  }
}
