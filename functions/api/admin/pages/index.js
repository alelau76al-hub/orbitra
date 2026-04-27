function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replaceAll("'", '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
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

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)

    const title = String(body.title || '').trim()
    const slug = slugify(body.slug || title)

    if (!title) {
      return json(
        {
          success: false,
          message: 'Il titolo pagina è obbligatorio.',
        },
        400,
      )
    }

    if (!slug) {
      return json(
        {
          success: false,
          message: 'Lo slug pagina è obbligatorio.',
        },
        400,
      )
    }

    await env.DB.prepare(
      `
      INSERT INTO pages (
        slug,
        title
      )
      VALUES (?, ?)
      `,
    )
      .bind(slug, title)
      .run()

    return json({
      success: true,
      message: 'Pagina creata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore creazione pagina.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)

    const id = Number(body.id)
    const title = String(body.title || '').trim()
    const slug = slugify(body.slug || title)

    if (!id) {
      return json(
        {
          success: false,
          message: 'ID pagina mancante.',
        },
        400,
      )
    }

    if (!title) {
      return json(
        {
          success: false,
          message: 'Il titolo pagina è obbligatorio.',
        },
        400,
      )
    }

    await env.DB.prepare(
      `
      UPDATE pages
      SET
        slug = ?,
        title = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
    )
      .bind(slug, title, id)
      .run()

    return json({
      success: true,
      message: 'Pagina aggiornata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore aggiornamento pagina.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) {
      return json(
        {
          success: false,
          message: 'ID pagina mancante.',
        },
        400,
      )
    }

    const page = await env.DB.prepare(
      `
      SELECT slug
      FROM pages
      WHERE id = ?
      `,
    )
      .bind(id)
      .first()

    if (!page) {
      return json(
        {
          success: false,
          message: 'Pagina non trovata.',
        },
        404,
      )
    }

    if (page.slug === 'home') {
      return json(
        {
          success: false,
          message: 'La homepage non può essere eliminata.',
        },
        400,
      )
    }

    await env.DB.prepare(
      `
      DELETE FROM pages
      WHERE id = ?
      `,
    )
      .bind(id)
      .run()

    return json({
      success: true,
      message: 'Pagina eliminata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore eliminazione pagina.',
        error: error.message,
      },
      500,
    )
  }
}