function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'public, max-age=300',
    },
  })
}

export async function onRequestGet({ env }) {
  try {
    const primary = await env.DB.prepare(`
      SELECT domain, type, status, is_primary
      FROM domains
      WHERE is_primary = 1 AND status = 'active'
      LIMIT 1
    `).first()

    return json({
      success: true,
      primary_domain: primary || null,
    })
  } catch {
    return json({
      success: true,
      primary_domain: null,
      fallback: true,
    })
  }
}
