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

function normalizeSeo(seo = {}) {
  return {
    meta_title: String(seo.meta_title || '').trim(),
    meta_description: String(seo.meta_description || '').trim(),
    og_image: String(seo.og_image || '').trim(),
    canonical_url: String(seo.canonical_url || '').trim(),
  }
}

async function loadSeoByEntityId(env, ids) {
  if (!ids.length) return {}

  try {
    const placeholders = ids.map(() => '?').join(', ')
    const result = await env.DB.prepare(
      `
      SELECT
        entity_id,
        meta_title,
        meta_description,
        og_image,
        canonical_url
      FROM seo_metadata
      WHERE entity_type = 'page' AND entity_id IN (${placeholders})
      `,
    )
      .bind(...ids)
      .all()

    return (result.results || []).reduce((map, row) => {
      map[row.entity_id] = {
        meta_title: row.meta_title || '',
        meta_description: row.meta_description || '',
        og_image: row.og_image || '',
        canonical_url: row.canonical_url || '',
      }
      return map
    }, {})
  } catch {
    return {}
  }
}

async function saveSeoMetadata(env, entityId, seo) {
  const normalizedSeo = normalizeSeo(seo)

  try {
    await env.DB.prepare(`
      INSERT INTO seo_metadata (
        entity_type,
        entity_id,
        meta_title,
        meta_description,
        og_image,
        canonical_url,
        updated_at
      )
      VALUES ('page', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(entity_type, entity_id)
      DO UPDATE SET
        meta_title = excluded.meta_title,
        meta_description = excluded.meta_description,
        og_image = excluded.og_image,
        canonical_url = excluded.canonical_url,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(
        entityId,
        normalizedSeo.meta_title,
        normalizedSeo.meta_description,
        normalizedSeo.og_image,
        normalizedSeo.canonical_url,
      )
      .run()
  } catch {
    // SEO resta opzionale finche la migration 0008 non viene applicata.
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

    const pages = result.results || []
    const seoByPageId = await loadSeoByEntityId(
      env,
      pages.map((page) => page.id),
    )

    return json({
      success: true,
      pages: pages.map((page) => ({
        ...page,
        seo: seoByPageId[page.id] || {},
      })),
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento pagine.',
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

    const inserted = await env.DB.prepare(
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

    await saveSeoMetadata(env, inserted.meta.last_row_id, body.seo || {})

    return json({
      success: true,
      message: 'Pagina creata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore creazione pagina.',
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

    await saveSeoMetadata(env, id, body.seo || {})

    return json({
      success: true,
      message: 'Pagina aggiornata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore aggiornamento pagina.',
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
      },
      500,
    )
  }
}
