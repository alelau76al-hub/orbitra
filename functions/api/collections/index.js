function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

function parseMetafieldValue(value, type) {
  if (type === 'boolean') return String(value) === '1'
  if (type === 'number') {
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : value
  }
  return value
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

async function loadMetafieldsByEntityId(env, ids) {
  if (!ids.length) return {}

  try {
    const placeholders = ids.map(() => '?').join(', ')
    const result = await env.DB.prepare(
      `
      SELECT
        metafield_values.entity_id,
        metafield_definitions.key,
        metafield_definitions.type,
        metafield_values.value
      FROM metafield_values
      INNER JOIN metafield_definitions
        ON metafield_definitions.id = metafield_values.definition_id
      WHERE
        metafield_definitions.active = 1
        AND metafield_values.entity_type = 'collection'
        AND metafield_values.entity_id IN (${placeholders})
      `,
    )
      .bind(...ids)
      .all()

    return (result.results || []).reduce((map, row) => {
      if (!map[row.entity_id]) map[row.entity_id] = {}
      map[row.entity_id][row.key] = parseMetafieldValue(row.value, row.type)
      return map
    }, {})
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
        created_at
      FROM collections
      WHERE active = 1
      ORDER BY created_at DESC, id DESC
      `,
    ).all()

    const collections = result.results || []
    const collectionIds = collections.map((collection) => collection.id)
    const seoByCollectionId = await loadSeoByEntityId(env, collectionIds)
    const metafieldsByCollectionId = await loadMetafieldsByEntityId(env, collectionIds)

    return json({
      success: true,
      collections: collections.map((collection) => ({
        ...collection,
        seo: seoByCollectionId[collection.id] || {},
        metafields: metafieldsByCollectionId[collection.id] || {},
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
