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

    return Response.json({
      success: true,
      products: products.map((product) => ({
        ...product,
        variants: variantsByProductId[product.id] || [],
      })),
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
