function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function onRequestGet({ env }) {
  try {
    const orders = await env.DB.prepare(`
      SELECT id, email, customer_name, order_status, payment_status, fulfillment_status,
             tracking_carrier, tracking_number, tracking_url, fulfilled_at, shipping_method, created_at
      FROM orders
      ORDER BY created_at DESC, id DESC
      LIMIT 150
    `).all()
    return json({ success: true, fulfillments: orders.results || [] })
  } catch {
    return json({ success: true, fulfillments: [], setup_required: true })
  }
}
