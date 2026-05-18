const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=120',
      ...(init.headers || {}),
    },
  })

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || error || ''))
}

export async function onRequestGet({ env, request }) {
  try {
    const productId = Number(new URL(request.url).searchParams.get('product_id') || 0)
    if (!productId) return json({ success: true, subscriptions: [] })
    const rows = await env.DB.prepare(`
      SELECT id, product_id, frequency, subscription_price_cents, trial_days, active
      FROM subscription_products
      WHERE active = 1 AND product_id = ?
      ORDER BY id DESC
    `)
      .bind(productId)
      .all()
    return json({ success: true, subscriptions: rows.results || [] })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, subscriptions: [], setup_required: true })
    return json({ success: false, message: 'Subscriptions non disponibili.' }, { status: 500 })
  }
}
