const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  })

const DEFAULTS = {
  search_suggestions_enabled: '1',
  searchable_fields: 'name,slug,description,category,sku,metafields',
  enabled_filters: 'collection,price,stock,tag,brand,market',
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

async function getSettings(env) {
  try {
    const rows = await env.DB.prepare(`
      SELECT key, value
      FROM site_settings
      WHERE group_name = 'search_filters'
    `).all()
    const values = { ...DEFAULTS }
    ;(rows.results || []).forEach((row) => {
      values[row.key] = row.value
    })
    return values
  } catch {
    return { ...DEFAULTS, setup_required: true }
  }
}

export async function onRequestGet({ env }) {
  return json({
    success: true,
    settings: await getSettings(env),
    endpoint: '/api/search?q=',
  })
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request)
    const payload = {
      search_suggestions_enabled: body.search_suggestions_enabled ? '1' : '0',
      searchable_fields: String(body.searchable_fields || DEFAULTS.searchable_fields).trim(),
      enabled_filters: String(body.enabled_filters || DEFAULTS.enabled_filters).trim(),
    }

    await Promise.all(
      Object.entries(payload).map(([key, value]) =>
        env.DB.prepare(`
          INSERT INTO site_settings (key, value, group_name, type, label)
          VALUES (?, ?, 'search_filters', 'text', ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
        `)
          .bind(key, value, key)
          .run(),
      ),
    )

    return json({ success: true, settings: payload, message: 'Search & Filters salvato.' })
  } catch {
    return json({ success: false, message: 'Impossibile salvare Search & Filters.' }, { status: 500 })
  }
}
