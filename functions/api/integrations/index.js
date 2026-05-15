function json(data, status = 200) {
  return Response.json(data, { status })
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT name, type, active
      FROM integrations
      WHERE active = 1
      ORDER BY name ASC
    `).all()

    return json({
      success: true,
      integrations: results || [],
    })
  } catch {
    return json({
      success: true,
      integrations: [],
      fallback: true,
    })
  }
}
