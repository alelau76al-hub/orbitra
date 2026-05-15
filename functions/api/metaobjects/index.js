function json(data, status = 200) {
  return Response.json(data, { status })
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value || '')
  } catch {
    return fallback
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const typeKey = String(url.searchParams.get('type_key') || '').trim()
    const definitionFilter = typeKey ? 'AND metaobject_definitions.type_key = ?' : ''
    const query = `
      SELECT
        metaobject_definitions.type_key,
        metaobject_definitions.name,
        metaobject_definitions.fields_json,
        metaobject_entries.id,
        metaobject_entries.slug,
        metaobject_entries.title,
        metaobject_entries.data_json,
        metaobject_entries.created_at,
        metaobject_entries.updated_at
      FROM metaobject_entries
      INNER JOIN metaobject_definitions
        ON metaobject_definitions.id = metaobject_entries.definition_id
      WHERE
        metaobject_entries.active = 1
        AND metaobject_definitions.active = 1
        ${definitionFilter}
      ORDER BY metaobject_definitions.name ASC, metaobject_entries.title ASC
    `
    const statement = env.DB.prepare(query)
    const result = typeKey ? await statement.bind(typeKey).all() : await statement.all()

    return json({
      success: true,
      entries: (result.results || []).map((entry) => ({
        ...entry,
        fields: safeJsonParse(entry.fields_json, []),
        data: safeJsonParse(entry.data_json, {}),
        fields_json: undefined,
        data_json: undefined,
      })),
    })
  } catch {
    return json({
      success: true,
      entries: [],
      fallback: true,
    })
  }
}
