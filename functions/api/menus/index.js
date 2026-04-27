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
    const handle = url.searchParams.get('handle')

    let menusResult

    if (handle) {
      menusResult = await env.DB.prepare(
        `
        SELECT
          id,
          handle,
          name
        FROM menus
        WHERE handle = ?
        ORDER BY id ASC
        `,
      )
        .bind(handle)
        .all()
    } else {
      menusResult = await env.DB.prepare(
        `
        SELECT
          id,
          handle,
          name
        FROM menus
        ORDER BY id ASC
        `,
      ).all()
    }

    const itemsResult = await env.DB.prepare(
      `
      SELECT
        id,
        menu_id,
        label,
        link_type,
        target_slug,
        url,
        sort_order,
        parent_id
      FROM menu_items
      WHERE active = 1
      ORDER BY menu_id ASC, sort_order ASC, id ASC
      `,
    ).all()

    const menus = (menusResult.results || []).map((menu) => ({
      ...menu,
      items: (itemsResult.results || []).filter((item) => item.menu_id === menu.id),
    }))

    return json({
      success: true,
      menus,
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento menu.',
        error: error.message,
      },
      500,
    )
  }
}