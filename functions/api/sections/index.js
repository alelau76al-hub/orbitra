function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const pageSlug = url.searchParams.get('page_slug') || 'home'

    const result = await env.DB.prepare(
      `
      SELECT
        id,
        page_slug,
        type,
        sort_order,
        data
      FROM sections
      WHERE page_slug = ?
      ORDER BY sort_order ASC, id ASC
      `,
    )
      .bind(pageSlug)
      .all()

    return json({
      success: true,
      page_slug: pageSlug,
      sections: (result.results || []).map((section) => ({
        ...section,
        data: JSON.parse(section.data),
      })),
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento sezioni.',
        error: error.message,
      },
      500,
    )
  }
}