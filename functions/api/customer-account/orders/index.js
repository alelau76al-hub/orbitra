const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...(init.headers || {}) },
  })

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || error || ''))
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url)
    const email = String(url.searchParams.get('email') || '').trim().toLowerCase()
    const orderId = Number(url.searchParams.get('order_id') || 0)
    if (!email) return json({ success: false, message: 'Email obbligatoria.' }, { status: 400 })

    const params = [email]
    let orderFilter = ''
    if (orderId) {
      orderFilter = 'AND o.id = ?'
      params.push(orderId)
    }

    const orders = await env.DB.prepare(`
      SELECT o.id, o.email, o.total_cents, o.payment_status, o.order_status, o.shipping_method,
             o.shipping_address_city, o.shipping_address_country, o.created_at
      FROM orders o
      WHERE LOWER(o.email) = LOWER(?) ${orderFilter}
      ORDER BY o.created_at DESC, o.id DESC
      LIMIT 50
    `)
      .bind(...params)
      .all()

    const items = orderId
      ? await env.DB.prepare(`
          SELECT product_name, product_slug, variant_label, quantity, price_cents
          FROM order_items
          WHERE order_id = ?
          ORDER BY id ASC
        `)
          .bind(orderId)
          .all()
      : { results: [] }

    return json({ success: true, orders: orders.results || [], items: items.results || [] })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, orders: [], items: [], setup_required: true })
    return json({ success: false, message: 'Ordini cliente non disponibili.' }, { status: 500 })
  }
}
