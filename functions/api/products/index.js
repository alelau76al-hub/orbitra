function parseMetafieldValue(value, type) {
  if (type === 'boolean') return String(value) === '1'
  if (type === 'number') {
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : value
  }
  return value
}

async function loadSeoByEntityId(env, entityType, ids) {
  if (!ids.length) return {}

  try {
    const placeholders = ids.map(() => '?').join(', ')
    const { results } = await env.DB.prepare(`
      SELECT
        entity_id,
        meta_title,
        meta_description,
        og_image,
        canonical_url
      FROM seo_metadata
      WHERE entity_type = ? AND entity_id IN (${placeholders})
    `)
      .bind(entityType, ...ids)
      .all()

    return (results || []).reduce((map, row) => {
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

async function loadMetafieldsByEntityId(env, entityType, ids) {
  if (!ids.length) return {}

  try {
    const placeholders = ids.map(() => '?').join(', ')
    const { results } = await env.DB.prepare(`
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
        AND metafield_values.entity_type = ?
        AND metafield_values.entity_id IN (${placeholders})
    `)
      .bind(entityType, ...ids)
      .all()

    return (results || []).reduce((map, row) => {
      if (!map[row.entity_id]) map[row.entity_id] = {}
      map[row.entity_id][row.key] = parseMetafieldValue(row.value, row.type)
      return map
    }, {})
  } catch {
    return {}
  }
}

async function loadLocalizedPricesByProductId(env, ids) {
  if (!ids.length) return {}

  try {
    const placeholders = ids.map(() => '?').join(', ')
    const { results } = await env.DB.prepare(`
      SELECT
        product_id,
        variant_id,
        market_handle,
        currency_code,
        price_cents,
        active
      FROM localized_prices
      WHERE active = 1
        AND product_id IN (${placeholders})
      ORDER BY product_id ASC, variant_id ASC, market_handle ASC
    `)
      .bind(...ids)
      .all()

    return (results || []).reduce((map, row) => {
      const productId = row.product_id
      const variantId = Number(row.variant_id || 0)
      if (!map[productId]) {
        map[productId] = {
          product: [],
          variants: {},
        }
      }

      const price = {
        market_handle: row.market_handle || '',
        currency_code: row.currency_code || 'EUR',
        price_cents: Number(row.price_cents || 0),
      }

      if (variantId > 0) {
        if (!map[productId].variants[variantId]) map[productId].variants[variantId] = []
        map[productId].variants[variantId].push(price)
      } else {
        map[productId].product.push(price)
      }

      return map
    }, {})
  } catch {
    return {}
  }
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        products.id,
        products.slug,
        products.name,
        products.description,
        products.price_cents,
        products.image_url,
        products.collection_slug,
        products.category,
        products.active,
        COALESCE(inventory.stock, 0) AS stock
      FROM products
      LEFT JOIN inventory ON inventory.product_id = products.id
      WHERE products.active = 1
      ORDER BY products.created_at DESC
    `).all()

    const products = results || []

    let variants = []

    try {
      const variantsResult = await env.DB.prepare(`
        SELECT
          id,
          product_id,
          option_name,
          option_value,
          sku,
          price_cents,
          stock,
          active,
          sort_order
        FROM product_variants
        WHERE active = 1
        ORDER BY product_id ASC, sort_order ASC, id ASC
      `).all()

      variants = variantsResult.results || []
    } catch {
      variants = []
    }

    const variantsByProductId = variants.reduce((groups, variant) => {
      if (!groups[variant.product_id]) {
        groups[variant.product_id] = []
      }

      groups[variant.product_id].push(variant)

      return groups
    }, {})
    const productIds = products.map((product) => product.id)
    const seoByProductId = await loadSeoByEntityId(env, 'product', productIds)
    const metafieldsByProductId = await loadMetafieldsByEntityId(env, 'product', productIds)
    const localizedPricesByProductId = await loadLocalizedPricesByProductId(env, productIds)

    return Response.json(
      {
        success: true,
        products: products.map((product) => ({
          ...product,
          localized_prices: localizedPricesByProductId[product.id]?.product || [],
          variants: (variantsByProductId[product.id] || []).map((variant) => ({
            ...variant,
            localized_prices: localizedPricesByProductId[product.id]?.variants?.[variant.id] || [],
          })),
          seo: seoByProductId[product.id] || {},
          metafields: metafieldsByProductId[product.id] || {},
        })),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
        },
      },
    )
  } catch {
    return Response.json(
      {
        success: false,
        message: 'Errore nel caricamento prodotti',
      },
      { status: 500 },
    )
  }
}
