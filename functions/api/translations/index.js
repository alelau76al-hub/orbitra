function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
      ...headers,
    },
  })
}

const supportedLocales = new Set(['it', 'en', 'fr', 'es', 'de'])

function normalizeLocale(value = '') {
  const locale = String(value || '').trim().toLowerCase()
  return supportedLocales.has(locale) ? locale : ''
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const locale = normalizeLocale(url.searchParams.get('locale'))

  if (!locale) {
    return json({ success: true, locale: locale || 'it', translations: [] })
  }

  try {
    const entityType = String(url.searchParams.get('entity_type') || '').trim()
    const entityId = Number(url.searchParams.get('entity_id') || 0)
    const bindings = [locale]
    const filters = ['locale = ?', "status = 'active'"]

    if (entityType) {
      filters.push('entity_type = ?')
      bindings.push(entityType)
    }

    if (entityId > 0) {
      filters.push('entity_id = ?')
      bindings.push(entityId)
    }

    const { results } = await env.DB.prepare(`
      SELECT
        id,
        locale,
        entity_type,
        entity_id,
        entity_key,
        field_key,
        translated_value,
        updated_at
      FROM translations
      WHERE ${filters.join(' AND ')}
      ORDER BY entity_type ASC, entity_id ASC, field_key ASC
    `)
      .bind(...bindings)
      .all()

    return json({
      success: true,
      locale,
      translations: results || [],
    })
  } catch {
    return json({
      success: true,
      locale,
      translations: [],
      fallback: true,
    })
  }
}
