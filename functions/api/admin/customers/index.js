function json(data, status = 200) {
  return Response.json(data, { status })
}

export async function onRequestGet({ env }) {
  try {
    const customersResult = await env.DB.prepare(`
      SELECT
        id,
        email,
        name,
        phone,
        shipping_address_line1,
        shipping_address_city,
        shipping_address_postal_code,
        shipping_address_country,
        created_at,
        updated_at
      FROM customers
      ORDER BY updated_at DESC, created_at DESC, id DESC
      LIMIT 100
    `).all()

    const ordersResult = await env.DB.prepare(`
      SELECT
        id,
        customer_id,
        email,
        total_cents,
        payment_status,
        order_status,
        created_at
      FROM orders
      ORDER BY created_at DESC, id DESC
      LIMIT 300
    `).all()

    const orders = ordersResult.results || []
    const customers = (customersResult.results || []).map((customer) => ({
      ...customer,
      orders: orders.filter(
        (order) => order.customer_id === customer.id || order.email === customer.email,
      ),
    }))

    return json({
      success: true,
      customers,
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento clienti. Verifica che la migration checkout sia applicata.',
        error: error.message,
      },
      500,
    )
  }
}
