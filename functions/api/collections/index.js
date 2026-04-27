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
        name,
        description,
        image_url,
        created_at
      FROM collections
      WHERE active = 1
      ORDER BY created_at DESC, id DESC
      `,
    ).all()

    return json({
      success: true,
      collections: result.results || [],
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento collezioni.',
        error: error.message,
      },
      500,
    )
  }
}