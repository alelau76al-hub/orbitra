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
        name,
        description,
        image_url,
        active,
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

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)

    const name = String(body.name || '').trim()
    const slug = slugify(body.slug || name)
    const description = String(body.description || '').trim()
    const image_url = String(body.image_url || '').trim()

    if (!name) {
      return json(
        {
          success: false,
          message: 'Il nome collezione è obbligatorio.',
        },
        400,
      )
    }

    if (!slug) {
      return json(
        {
          success: false,
          message: 'Lo slug collezione è obbligatorio.',
        },
        400,
      )
    }

    await env.DB.prepare(
      `
      INSERT INTO collections (
        slug,
        name,
        description,
        image_url,
        active
      )
      VALUES (?, ?, ?, ?, 1)
      `,
    )
      .bind(slug, name, description, image_url)
      .run()

    return json({
      success: true,
      message: 'Collezione creata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore creazione collezione.',
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
    const name = String(body.name || '').trim()
    const slug = slugify(body.slug || name)
    const description = String(body.description || '').trim()
    const image_url = String(body.image_url || '').trim()

    if (!id) {
      return json(
        {
          success: false,
          message: 'ID collezione mancante.',
        },
        400,
      )
    }

    if (!name) {
      return json(
        {
          success: false,
          message: 'Il nome collezione è obbligatorio.',
        },
        400,
      )
    }

    await env.DB.prepare(
      `
      UPDATE collections
      SET
        slug = ?,
        name = ?,
        description = ?,
        image_url = ?
      WHERE id = ?
      `,
    )
      .bind(slug, name, description, image_url, id)
      .run()

    return json({
      success: true,
      message: 'Collezione aggiornata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore aggiornamento collezione.',
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
          message: 'ID collezione mancante.',
        },
        400,
      )
    }

    await env.DB.prepare(
      `
      UPDATE collections
      SET active = 0
      WHERE id = ?
      `,
    )
      .bind(id)
      .run()

    return json({
      success: true,
      message: 'Collezione disattivata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore eliminazione collezione.',
        error: error.message,
      },
      500,
    )
  }
}