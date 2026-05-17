function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value || '')
  } catch {
    return fallback
  }
}

async function safeAll(env, sql, bindings = []) {
  try {
    if (!env?.DB) return []
    const statement = env.DB.prepare(sql)
    const result = bindings.length ? await statement.bind(...bindings).all() : await statement.all()
    return result.results || []
  } catch {
    return []
  }
}

async function safeFirst(env, sql, bindings = []) {
  try {
    if (!env?.DB) return null
    const statement = env.DB.prepare(sql)
    return bindings.length ? await statement.bind(...bindings).first() : await statement.first()
  } catch {
    return null
  }
}

function countValue(counts = [], eventType) {
  const row = counts.find((item) => item.event_type === eventType)
  return Number(row?.count || 0)
}

function buildSummary(counts = [], orderStats = null) {
  const pageViews = countValue(counts, 'page_view')
  const productViews = countValue(counts, 'product_view')
  const addToCart = countValue(counts, 'add_to_cart')
  const checkoutStarts = countValue(counts, 'checkout_start')
  const ordersCreated = Math.max(countValue(counts, 'order_created'), Number(orderStats?.orders_count || 0))
  const conversionRate = checkoutStarts > 0 ? Math.round((ordersCreated / checkoutStarts) * 1000) / 10 : 0

  return {
    page_views: pageViews,
    product_views: productViews,
    add_to_cart: addToCart,
    checkout_starts: checkoutStarts,
    orders_created: ordersCreated,
    conversion_rate: conversionRate,
    revenue_cents: Number(orderStats?.revenue_cents || 0),
  }
}

export async function onRequestGet({ env }) {
  const counts = await safeAll(
    env,
    `
    SELECT event_type, COUNT(*) AS count
    FROM analytics_events
    GROUP BY event_type
    ORDER BY count DESC
    `,
  )

  const recent = await safeAll(
    env,
    `
    SELECT id, event_type, path, entity_type, entity_id, metadata_json, created_at
    FROM analytics_events
    ORDER BY created_at DESC, id DESC
    LIMIT 75
    `,
  )

  const traffic = await safeAll(
    env,
    `
    SELECT path, COUNT(*) AS views
    FROM analytics_events
    WHERE event_type = 'page_view'
    GROUP BY path
    ORDER BY views DESC
    LIMIT 20
    `,
  )

  const topProducts = await safeAll(
    env,
    `
    SELECT
      COALESCE(NULLIF(entity_id, ''), json_extract(metadata_json, '$.product_id'), json_extract(metadata_json, '$.slug')) AS product_ref,
      MAX(COALESCE(json_extract(metadata_json, '$.product_name'), json_extract(metadata_json, '$.name'), 'Prodotto')) AS product_name,
      SUM(CASE WHEN event_type = 'product_view' THEN 1 ELSE 0 END) AS product_views,
      SUM(CASE WHEN event_type = 'add_to_cart' THEN 1 ELSE 0 END) AS add_to_cart
    FROM analytics_events
    WHERE event_type IN ('product_view', 'add_to_cart')
    GROUP BY product_ref
    ORDER BY product_views DESC, add_to_cart DESC
    LIMIT 20
    `,
  )

  const orderStats = await safeFirst(
    env,
    `
    SELECT COUNT(*) AS orders_count, COALESCE(SUM(total_cents), 0) AS revenue_cents
    FROM orders
    `,
  )

  const summary = buildSummary(counts, orderStats)

  return json({
    success: true,
    summary,
    counts,
    recent: recent.map((event) => ({
      ...event,
      metadata: safeJsonParse(event.metadata_json, {}),
      metadata_json: undefined,
    })),
    traffic,
    sales: {
      orders_count: summary.orders_created,
      revenue_cents: summary.revenue_cents,
      average_order_cents:
        summary.orders_created > 0 ? Math.round(summary.revenue_cents / summary.orders_created) : 0,
    },
    products: topProducts.filter((product) => product.product_ref),
    conversions: {
      add_to_cart_rate:
        summary.product_views > 0 ? Math.round((summary.add_to_cart / summary.product_views) * 1000) / 10 : 0,
      checkout_to_order_rate: summary.conversion_rate,
    },
    empty: counts.length === 0,
  })
}
