function json(data, status = 200) {
  return Response.json(data, { status })
}

async function loadOrderItems(env, orderId) {
  const { results } = await env.DB.prepare(`
    SELECT
      id,
      order_id,
      product_id,
      product_slug,
      product_name,
      variant_id,
      variant_label,
      sku,
      quantity,
      price_cents
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
  `)
    .bind(orderId)
    .all()

  return results || []
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        email,
        total_cents,
        status,
        customer_id,
        customer_name,
        phone,
        subtotal_cents,
        shipping_cents,
        discount_code,
        discount_cents,
        tax_cents,
        tax_rate,
        prices_include_tax,
        payment_status,
        payment_method,
        order_status,
        shipping_method,
        shipping_address_line1,
        shipping_address_city,
        shipping_address_postal_code,
        shipping_address_country,
        created_at,
        updated_at
      FROM orders
      ORDER BY created_at DESC, id DESC
      LIMIT 100
    `).all()

    const orders = []

    for (const order of results || []) {
      orders.push({
        ...order,
        items: await loadOrderItems(env, order.id),
      })
    }

    return json({
      success: true,
      orders,
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento ordini. Verifica che la migration checkout sia applicata.',
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await request.json()
    const id = Number(body.id)
    const orderStatus = String(body.order_status || '').trim()
    const allowed = ['new', 'paid', 'processing', 'shipped', 'completed', 'cancelled']

    if (!id || Number.isNaN(id) || !allowed.includes(orderStatus)) {
      return json({ success: false, message: 'Stato ordine non valido.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE orders
      SET
        order_status = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(orderStatus, orderStatus, id)
      .run()

    return json({
      success: true,
      message: 'Stato ordine aggiornato.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore aggiornamento ordine.',
      },
      500,
    )
  }
}
