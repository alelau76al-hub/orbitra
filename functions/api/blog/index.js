function json(data, status = 200) {
  return Response.json(data, { status })
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const slug = String(url.searchParams.get('slug') || '').trim()

    if (slug) {
      const post = await env.DB.prepare(`
        SELECT
          id,
          slug,
          title,
          excerpt,
          content,
          image_url,
          author,
          status,
          meta_title,
          meta_description,
          og_image,
          created_at,
          updated_at
        FROM blog_posts
        WHERE slug = ? AND status = 'published'
      `)
        .bind(slug)
        .first()

      if (!post) {
        return json({ success: false, message: 'Articolo non trovato.' }, 404)
      }

      return json({ success: true, post })
    }

    const { results } = await env.DB.prepare(`
      SELECT
        id,
        slug,
        title,
        excerpt,
        image_url,
        author,
        meta_title,
        meta_description,
        og_image,
        created_at,
        updated_at
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY created_at DESC, id DESC
    `).all()

    return json({
      success: true,
      posts: results || [],
    })
  } catch {
    return json({
      success: true,
      posts: [],
      fallback: true,
    })
  }
}
