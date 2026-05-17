function json(data, status = 200) {
  return Response.json(data, { status })
}

const supportedLocales = new Set(['it', 'en', 'fr', 'es', 'de'])
const supportedEntityTypes = new Set([
  'product',
  'collection',
  'page',
  'section',
  'blog',
  'policy',
  'menu',
])
const supportedStatuses = new Set(['active', 'draft'])

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeText(value = '', limit = 20000) {
  return String(value || '').slice(0, limit)
}

function normalizeTranslation(body = {}) {
  const locale = String(body.locale || '').trim().toLowerCase()
  const entityType = String(body.entity_type || '').trim()
  const entityId = body.entity_id ? Number(body.entity_id) : 0
  const entityKey = normalizeText(body.entity_key || '', 255).trim()
  const fieldKey = normalizeText(body.field_key || '', 255).trim()
  const status = supportedStatuses.has(body.status) ? body.status : 'active'

  return {
    id: body.id ? Number(body.id) : null,
    locale,
    entity_type: entityType,
    entity_id: Number.isFinite(entityId) ? entityId : 0,
    entity_key: entityKey,
    field_key: fieldKey,
    source_value: normalizeText(body.source_value || ''),
    translated_value: normalizeText(body.translated_value || ''),
    status,
  }
}

function validateTranslation(translation) {
  if (!supportedLocales.has(translation.locale)) {
    return 'Lingua non supportata.'
  }

  if (!supportedEntityTypes.has(translation.entity_type)) {
    return 'Tipo contenuto non supportato.'
  }

  if (translation.entity_id <= 0 && !translation.entity_key) {
    return 'Elemento da tradurre mancante.'
  }

  if (!translation.field_key) {
    return 'Campo da tradurre mancante.'
  }

  return ''
}

async function logActivity(env, action, translation, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'translation', ?, ?)
    `)
      .bind(action, String(translation?.id || translation?.entity_id || ''), description)
      .run()
  } catch {}
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const locale = String(url.searchParams.get('locale') || '').trim().toLowerCase()
  const entityType = String(url.searchParams.get('entity_type') || '').trim()
  const entityId = Number(url.searchParams.get('entity_id') || 0)
  const bindings = []
  const filters = []

  if (locale) {
    filters.push('locale = ?')
    bindings.push(locale)
  }

  if (entityType) {
    filters.push('entity_type = ?')
    bindings.push(entityType)
  }

  if (entityId > 0) {
    filters.push('entity_id = ?')
    bindings.push(entityId)
  }

  try {
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        locale,
        entity_type,
        entity_id,
        entity_key,
        field_key,
        source_value,
        translated_value,
        status,
        created_at,
        updated_at
      FROM translations
      ${where}
      ORDER BY updated_at DESC, id DESC
      LIMIT 500
    `)
      .bind(...bindings)
      .all()

    return json({ success: true, translations: results || [] })
  } catch {
    return json({
      success: false,
      message: 'Errore caricamento traduzioni. Verifica la migration 0013.',
    }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  const translation = normalizeTranslation(await readBody(request))
  const validationMessage = validateTranslation(translation)

  if (validationMessage) {
    return json({ success: false, message: validationMessage }, 400)
  }

  try {
    const result = await env.DB.prepare(`
      INSERT INTO translations (
        locale,
        entity_type,
        entity_id,
        entity_key,
        field_key,
        source_value,
        translated_value,
        status,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(locale, entity_type, entity_id, entity_key, field_key)
      DO UPDATE SET
        source_value = excluded.source_value,
        translated_value = excluded.translated_value,
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(
        translation.locale,
        translation.entity_type,
        translation.entity_id,
        translation.entity_key,
        translation.field_key,
        translation.source_value,
        translation.translated_value,
        translation.status,
      )
      .run()

    await logActivity(
      env,
      'upsert',
      {
        ...translation,
        id: translation.id || result.meta?.last_row_id,
      },
      `Traduzione ${translation.locale}/${translation.entity_type}/${translation.field_key} salvata.`,
    )

    return json({ success: true, message: 'Traduzione salvata.' })
  } catch {
    return json({ success: false, message: 'Errore salvataggio traduzione.' }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  return onRequestPost({ request, env })
}

export async function onRequestDelete({ request, env }) {
  const body = await readBody(request)
  const id = Number(body.id || 0)

  if (!id) {
    return json({ success: false, message: 'ID traduzione mancante.' }, 400)
  }

  try {
    await env.DB.prepare(`
      UPDATE translations
      SET status = 'draft', translated_value = '', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    await logActivity(env, 'disable', { id }, 'Traduzione disattivata.')
    return json({ success: true, message: 'Traduzione disattivata.' })
  } catch {
    return json({ success: false, message: 'Errore disattivazione traduzione.' }, 500)
  }
}
