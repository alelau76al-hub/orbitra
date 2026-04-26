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

    return Response.json({
      success: true,
      products: results,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Errore nel caricamento prodotti',
        error: error.message,
      },
      { status: 500 },
    )
  }
}