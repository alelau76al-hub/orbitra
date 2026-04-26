export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()

    const name = body.name?.trim()
    const slug = body.slug?.trim()
    const description = body.description?.trim() || ''
    const price_cents = Number(body.price_cents)
    const image_url = body.image_url?.trim() || ''
    const collection_slug = body.collection_slug?.trim() || ''
    const category = body.category?.trim() || ''
    const stock = Number(body.stock)

    if (!name || !slug || !price_cents || Number.isNaN(price_cents)) {
      return Response.json(
        {
          success: false,
          message: 'Nome, slug e prezzo sono obbligatori.',
        },
        { status: 400 },
      )
    }

    const existing = await env.DB.prepare(
      'SELECT id FROM products WHERE slug = ?',
    )
      .bind(slug)
      .first()

    if (existing) {
      return Response.json(
        {
          success: false,
          message: 'Esiste già un prodotto con questo slug.',
        },
        { status: 409 },
      )
    }

    const insertProduct = await env.DB.prepare(`
      INSERT INTO products (
        slug,
        name,
        description,
        price_cents,
        image_url,
        collection_slug,
        category,
        active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `)
      .bind(
        slug,
        name,
        description,
        price_cents,
        image_url,
        collection_slug,
        category,
      )
      .run()

    const productId = insertProduct.meta.last_row_id

    await env.DB.prepare(`
      INSERT INTO inventory (
        product_id,
        stock
      )
      VALUES (?, ?)
    `)
      .bind(productId, stock)
      .run()

    return Response.json({
      success: true,
      message: 'Prodotto creato correttamente.',
      product_id: productId,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Errore durante la creazione del prodotto.',
        error: error.message,
      },
      { status: 500 },
    )
  }
}