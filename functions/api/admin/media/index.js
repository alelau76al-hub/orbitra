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
    size: Math.max(0, Number(body.size || 0)),
    mime_type: String(body.mime_type || '').trim(),
    storage_provider: String(body.storage_provider || 'url').trim() || 'url',
    storage_key: String(body.storage_key || '').trim(),
  }
}

async function hasExtendedMediaColumns(env) {
  try {
    await env.DB.prepare('SELECT size, mime_type, storage_provider, storage_key FROM media_items LIMIT 1').first()
    return true
  } catch {
    return false
  }
}

export async function onRequestGet({ env }) {
  try {
    const hasExtendedColumns = await hasExtendedMediaColumns(env)
    const query = hasExtendedColumns
      ? `
        SELECT
          id,
          name,
          url,
          type,
          alt_text,
          size,
          mime_type,
          storage_provider,
          storage_key,
          active,
          created_at,
          updated_at
        FROM media_items
        WHERE active = 1
        ORDER BY created_at DESC, id DESC
      `
      : `
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
      `
    const { results } = await env.DB.prepare(query).all()

    return json({
      success: true,
      media: (results || []).map((item) => ({
        size: 0,
        mime_type: '',
        storage_provider: 'url',
        storage_key: '',
        ...item,
      })),
    })
  } catch {
    return json(
      {
        success: false,
        message: 'Errore caricamento media. Verifica che la migration 0008 sia applicata.',
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

    if (await hasExtendedMediaColumns(env)) {
      await env.DB.prepare(`
        INSERT INTO media_items (
          name,
          url,
          type,
          alt_text,
          size,
          mime_type,
          storage_provider,
          storage_key,
          active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `)
        .bind(
          media.name,
          media.url,
          media.type,
          media.alt_text,
          media.size,
          media.mime_type,
          media.storage_provider,
          media.storage_key,
        )
        .run()
    } else {
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
    }

    return json({
      success: true,
      message: 'Media creato.',
    })
  } catch {
    return json(
      {
        success: false,
        message: 'Errore creazione media.',
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

    if (await hasExtendedMediaColumns(env)) {
      await env.DB.prepare(`
        UPDATE media_items
        SET
          name = ?,
          url = ?,
          type = ?,
          alt_text = ?,
          size = ?,
          mime_type = ?,
          storage_provider = ?,
          storage_key = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(
          media.name,
          media.url,
          media.type,
          media.alt_text,
          media.size,
          media.mime_type,
          media.storage_provider,
          media.storage_key,
          media.id,
        )
        .run()
    } else {
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
    }

    return json({
      success: true,
      message: 'Media aggiornato.',
    })
  } catch {
    return json(
      {
        success: false,
        message: 'Errore aggiornamento media.',
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
  } catch {
    return json(
      {
        success: false,
        message: 'Errore eliminazione media.',
      },
      500,
    )
  }
}
