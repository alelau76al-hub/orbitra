function json(data, status = 200) {
  return Response.json(data, { status })
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function settingsToMap(settings = []) {
  return settings.reduce((map, setting) => {
    map[setting.key] = setting.value
    return map
  }, {})
}

export async function onRequestGet({ env }) {
  try {
    const settingsResult = await env.DB.prepare(`
      SELECT key, value, type, label, updated_at
      FROM performance_settings
      ORDER BY key ASC
    `).all()

    const domainsResult = await env.DB.prepare(`
      SELECT domain, type, status, is_primary
      FROM domains
      ORDER BY is_primary DESC, domain ASC
      LIMIT 20
    `).all()

    const tenantsResult = await env.DB.prepare(`
      SELECT handle, name, status, is_default
      FROM tenants
      ORDER BY is_default DESC, name ASC
      LIMIT 20
    `).all()

    return json({
      success: true,
      settings: settingsResult.results || [],
      map: settingsToMap(settingsResult.results || []),
      domains: domainsResult.results || [],
      tenants: tenantsResult.results || [],
      checklist: [
        'Cache headers API pubbliche read-only',
        'Lazy loading immagini pubbliche',
        'Fallback fetch pubbliche',
        'Build produzione verificata',
        'Nessun secret nel repository',
      ],
    })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento performance. Verifica la migration 0010.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const settings = body.settings && typeof body.settings === 'object' ? body.settings : {}

    for (const [key, value] of Object.entries(settings)) {
      await env.DB.prepare(`
        INSERT INTO performance_settings (key, value, type, label, updated_at)
        VALUES (?, ?, 'text', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key)
        DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `)
        .bind(key, String(value ?? ''), key)
        .run()
    }

    return json({ success: true, message: 'Impostazioni performance salvate.' })
  } catch (error) {
    return json({ success: false, message: 'Errore salvataggio performance.', error: error.message }, 500)
  }
}
