function fallbackShippingMethods() {
  return [
    {
      id: 0,
      handle: 'standard',
      name: 'Spedizione standard',
      description: 'Metodo standard disponibile come fallback.',
      price_cents: 990,
      free_over_cents: null,
      active: 1,
      sort_order: 1,
    },
    {
      id: 0,
      handle: 'free_over_100',
      name: 'Spedizione gratuita',
      description: 'Disponibile sopra 100 euro di prodotti.',
      price_cents: 0,
      free_over_cents: 10000,
      active: 1,
      sort_order: 2,
    },
  ]
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        handle,
        name,
        description,
        price_cents,
        free_over_cents,
        active,
        sort_order
      FROM shipping_methods
      WHERE active = 1
      ORDER BY sort_order ASC, id ASC
    `).all()

    return Response.json({
      success: true,
      methods: results || [],
    })
  } catch {
    return Response.json({
      success: true,
      methods: fallbackShippingMethods(),
      fallback: true,
    })
  }
}
