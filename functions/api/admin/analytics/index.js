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

export async function onRequestGet({ env }) {
  try {
    const countsResult = await env.DB.prepare(`
      SELECT event_type, COUNT(*) AS count
      FROM analytics_events
      GROUP BY event_type
      ORDER BY count DESC
    `).all()

    const recentResult = await env.DB.prepare(`
      SELECT id, event_type, path, entity_type, entity_id, metadata_json, created_at
      FROM analytics_events
      ORDER BY created_at DESC, id DESC
      LIMIT 50
    `).all()

    return json({
      success: true,
      counts: countsResult.results || [],
      recent: (recentResult.results || []).map((event) => ({
        ...event,
        metadata: safeJsonParse(event.metadata_json, {}),
        metadata_json: undefined,
      })),
    })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento analytics. Verifica la migration 0009.', error: error.message }, 500)
  }
}
