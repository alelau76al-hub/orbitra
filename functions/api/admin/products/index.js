function validateProduct(body) {
  const product = {
    id: body.id ? Number(body.id) : null,
    name: body.name?.trim(),
    slug: body.slug?.trim(),
    description: body.description?.trim() || '',
    price_cents: Number(body.price_cents),
    image_url: body.image_url?.trim() || '',
    collection_slug: body.collection_slug?.trim() || '',
    category: body.category?.trim() || '',
    stock: Number(body.stock),
  }

  if (!product.name || !product.slug || !product.price_cents || Number.isNaN(product.price_cents)) {
    return {
      valid: false,
      message: 'Nome, slug e prezzo sono obbligatori.',
    }
  }

  if (Number.isNaN(product.stock) || product.stock < 0) {
    return {
      valid: false,
      message: 'Stock non valido.',
    }
  }

  return {
    valid: true,
    product,
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const validation = validateProduct(body)

    if (!validation.valid) {
      return Response.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 },
      )
    }

    const product = validation.product

    const existing = await env.DB.prepare(
      'SELECT id FROM products WHERE slug = ?',
    )
      .bind(product.slug)
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
        product.slug,
        product.name,
        product.description,
        product.price_cents,
        product.image_url,
        product.collection_slug,
        product.category,
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
      .bind(productId, product.stock)
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

export async function onRequestPut({ request, env }) {
  try {
    const body = await request.json()
    const validation = validateProduct(body)

    if (!validation.valid || !validation.product.id) {
      return Response.json(
        {
          success: false,
          message: 'Dati prodotto non validi.',
        },
        { status: 400 },
      )
    }

    const product = validation.product

    const slugUsed = await env.DB.prepare(
      'SELECT id FROM products WHERE slug = ? AND id != ?',
    )
      .bind(product.slug, product.id)
      .first()

    if (slugUsed) {
      return Response.json(
        {
          success: false,
          message: 'Questo slug è già usato da un altro prodotto.',
        },
        { status: 409 },
      )
    }

    await env.DB.prepare(`
      UPDATE products
      SET
        slug = ?,
        name = ?,
        description = ?,
        price_cents = ?,
        image_url = ?,
        collection_slug = ?,
        category = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        product.slug,
        product.name,
        product.description,
        product.price_cents,
        product.image_url,
        product.collection_slug,
        product.category,
        product.id,
      )
      .run()

    await env.DB.prepare(`
      INSERT INTO inventory (
        product_id,
        stock
      )
      VALUES (?, ?)
      ON CONFLICT(product_id) DO UPDATE SET stock = excluded.stock
    `)
      .bind(product.id, product.stock)
      .run()

    return Response.json({
      success: true,
      message: 'Prodotto aggiornato correttamente.',
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Errore durante l’aggiornamento del prodotto.',
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await request.json()
    const id = Number(body.id)

    if (!id || Number.isNaN(id)) {
      return Response.json(
        {
          success: false,
          message: 'ID prodotto non valido.',
        },
        { status: 400 },
      )
    }

    await env.DB.prepare(`
      UPDATE products
      SET active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    return Response.json({
      success: true,
      message: 'Prodotto disattivato correttamente.',
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Errore durante la disattivazione del prodotto.',
        error: error.message,
      },
      { status: 500 },
    )
  }
}