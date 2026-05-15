function json(data, status = 200) {
  return Response.json(data, { status })
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, action, entity_type, entity_id, description, created_at
      FROM activity_log
      ORDER BY created_at DESC, id DESC
      LIMIT 150
    `).all()

    return json({ success: true, logs: results || [] })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento activity log. Verifica la migration 0009.', error: error.message }, 500)
  }
}
