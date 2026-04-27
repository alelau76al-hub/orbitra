function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function onRequestGet({ env }) {
  try {
    const result = await env.DB.prepare(
      `
      SELECT
        id,
        slug,
        title,
        created_at,
        updated_at
      FROM pages
      ORDER BY id ASC
      `,
    ).all()

    return json({
      success: true,
      pages: result.results || [],
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento pagine.',
        error: error.message,
      },
      500,
    )
  }
}