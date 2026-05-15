function json(data, status = 200) {
  return Response.json(data, { status })
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeMedia(body = {}) {
  const type = ['image', 'video', 'file'].includes(body.type) ? body.type : 'image'

  return {
    id: body.id ? Number(body.id) : null,
    name: String(body.name || '').trim(),
    url: String(body.url || '').trim(),
    type,
    alt_text: String(body.alt_text || '').trim(),
  }
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        name,
        url,
        type,
        alt_text,
        active,
        created_at,
        updated_at
      FROM media_items
      WHERE active = 1
      ORDER BY created_at DESC, id DESC
    `).all()

    return json({
      success: true,
      media: results || [],
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento media. Verifica che la migration 0008 sia applicata.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const media = normalizeMedia(await readBody(request))

    if (!media.name || !media.url) {
      return json({ success: false, message: 'Nome e URL media sono obbligatori.' }, 400)
    }

    await env.DB.prepare(`
      INSERT INTO media_items (
        name,
        url,
        type,
        alt_text,
        active
      )
      VALUES (?, ?, ?, ?, 1)
    `)
      .bind(media.name, media.url, media.type, media.alt_text)
      .run()

    return json({
      success: true,
      message: 'Media creato.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore creazione media.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const media = normalizeMedia(await readBody(request))

    if (!media.id || !media.name || !media.url) {
      return json({ success: false, message: 'Dati media non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE media_items
      SET
        name = ?,
        url = ?,
        type = ?,
        alt_text = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(media.name, media.url, media.type, media.alt_text, media.id)
      .run()

    return json({
      success: true,
      message: 'Media aggiornato.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore aggiornamento media.',
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
      return json({ success: false, message: 'ID media mancante.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE media_items
      SET active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    return json({
      success: true,
      message: 'Media eliminato.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore eliminazione media.',
        error: error.message,
      },
      500,
    )
  }
}
