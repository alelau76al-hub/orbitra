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
      WHERE entity_type = 'collection' AND entity_id IN (${placeholders})
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
      VALUES ('collection', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
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

    const collections = result.results || []
    const seoByCollectionId = await loadSeoByEntityId(
      env,
      collections.map((collection) => collection.id),
    )

    return json({
      success: true,
      collections: collections.map((collection) => ({
        ...collection,
        seo: seoByCollectionId[collection.id] || {},
      })),
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

    const inserted = await env.DB.prepare(
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

    await saveSeoMetadata(env, inserted.meta.last_row_id, body.seo || {})

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

    await saveSeoMetadata(env, id, body.seo || {})

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
