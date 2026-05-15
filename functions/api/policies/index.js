function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'public, max-age=120',
    },
  })
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const slug = String(url.searchParams.get('slug') || '').trim()

    if (slug) {
      const policy = await env.DB.prepare(`
        SELECT id, type, slug, title, content, status, updated_at
        FROM policies
        WHERE slug = ? AND status = 'published'
      `)
        .bind(slug)
        .first()

      if (!policy) return json({ success: false, message: 'Policy non trovata.' }, 404)
      return json({ success: true, policy })
    }

    const { results } = await env.DB.prepare(`
      SELECT id, type, slug, title, updated_at
      FROM policies
      WHERE status = 'published'
      ORDER BY type ASC, title ASC
    `).all()

    return json({ success: true, policies: results || [] })
  } catch {
    return json({ success: true, policies: [], fallback: true })
  }
}
