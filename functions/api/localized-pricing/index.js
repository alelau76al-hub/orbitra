function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
    },
  })
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const marketHandle = String(url.searchParams.get('market') || '').trim()
    const currencyCode = String(url.searchParams.get('currency') || '').trim().toUpperCase()
    const productId = Number(url.searchParams.get('product_id') || 0)
    const filters = ['active = 1']
    const bindings = []

    if (marketHandle) {
      filters.push('market_handle = ?')
      bindings.push(marketHandle)
    }

    if (/^[A-Z]{3}$/.test(currencyCode)) {
      filters.push('currency_code = ?')
      bindings.push(currencyCode)
    }

    if (productId) {
      filters.push('product_id = ?')
      bindings.push(productId)
    }

    const statement = env.DB.prepare(`
      SELECT product_id, variant_id, market_handle, currency_code, price_cents
      FROM localized_prices
      WHERE ${filters.join(' AND ')}
      ORDER BY product_id ASC, variant_id ASC, market_handle ASC
    `)
    const { results } = bindings.length
      ? await statement.bind(...bindings).all()
      : await statement.all()

    return json({
      success: true,
      prices: results || [],
    })
  } catch {
    return json({
      success: true,
      prices: [],
      fallback: true,
    })
  }
}
