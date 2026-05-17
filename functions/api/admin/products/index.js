function normalizeSeo(seo = {}) {
  return {
    meta_title: String(seo.meta_title || '').trim(),
    meta_description: String(seo.meta_description || '').trim(),
    og_image: String(seo.og_image || '').trim(),
    canonical_url: String(seo.canonical_url || '').trim(),
  }
}

async function saveSeoMetadata(env, entityType, entityId, seo) {
  const normalizedSeo = normalizeSeo(seo)

  try {
    await env.DB.prepare(`
      INSERT INTO seo_metadata (
        entity_type,
        entity_id,
        meta_title,
        meta_description,
        og_image,
        canonical_url,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(entity_type, entity_id)
      DO UPDATE SET
        meta_title = excluded.meta_title,
        meta_description = excluded.meta_description,
        og_image = excluded.og_image,
        canonical_url = excluded.canonical_url,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(
        entityType,
        entityId,
        normalizedSeo.meta_title,
        normalizedSeo.meta_description,
        normalizedSeo.og_image,
        normalizedSeo.canonical_url,
      )
      .run()
  } catch {
    // SEO resta opzionale finche la migration 0008 non viene applicata.
  }
}

function validateProduct(body) {
  const variants = Array.isArray(body.variants)
    ? body.variants
        .map((variant, index) => ({
          id: variant.id ? Number(variant.id) : null,
          option_name: variant.option_name?.trim() || '',
          option_value: variant.option_value?.trim() || '',
          sku: variant.sku?.trim() || '',
          price_cents:
            variant.price_cents === '' || variant.price_cents === null || variant.price_cents === undefined
              ? null
              : Number(variant.price_cents),
          stock:
            variant.stock === '' || variant.stock === null || variant.stock === undefined
              ? null
              : Number(variant.stock),
          sort_order: index,
        }))
        .filter((variant) => variant.option_name || variant.option_value || variant.sku)
    : []

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
    variants,
    seo: normalizeSeo(body.seo || {}),
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

  const invalidVariant = product.variants.find(
    (variant) =>
      !variant.option_name ||
      !variant.option_value ||
      (variant.price_cents !== null && (Number.isNaN(variant.price_cents) || variant.price_cents < 0)) ||
      (variant.stock !== null && (Number.isNaN(variant.stock) || variant.stock < 0)),
  )

  if (invalidVariant) {
    return {
      valid: false,
      message: 'Varianti non valide: nome opzione, valore, prezzo e stock devono essere corretti.',
    }
  }

  return {
    valid: true,
    product,
  }
}

async function hasVariantTable(env) {
  try {
    await env.DB.prepare('SELECT id FROM product_variants LIMIT 1').first()
    return true
  } catch {
    return false
  }
}

async function saveProductVariants(env, productId, variants) {
  if (!(await hasVariantTable(env))) {
    return {
      success: variants.length === 0,
      message: 'La tabella product_variants non esiste. Applica la migration 0006 prima di salvare varianti.',
    }
  }

  await env.DB.prepare(`
    UPDATE product_variants
    SET active = 0, updated_at = CURRENT_TIMESTAMP
    WHERE product_id = ?
  `)
    .bind(productId)
    .run()

  for (const variant of variants) {
    await env.DB.prepare(`
      INSERT INTO product_variants (
        product_id,
        option_name,
        option_value,
        sku,
        price_cents,
        stock,
        active,
        sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `)
      .bind(
        productId,
        variant.option_name,
        variant.option_value,
        variant.sku,
        variant.price_cents,
        variant.stock,
        variant.sort_order,
      )
      .run()
  }

  return {
    success: true,
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

    if (product.variants.length > 0 && !(await hasVariantTable(env))) {
      return Response.json(
        {
          success: false,
          message: 'Per salvare varianti devi prima applicare la migration 0006_create_product_variants.sql.',
        },
        { status: 400 },
      )
    }

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

    const variantsResult = await saveProductVariants(env, productId, product.variants)
    await saveSeoMetadata(env, 'product', productId, product.seo)

    if (!variantsResult.success) {
      return Response.json(
        {
          success: false,
          message: variantsResult.message,
        },
        { status: 400 },
      )
    }

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

    if (product.variants.length > 0 && !(await hasVariantTable(env))) {
      return Response.json(
        {
          success: false,
          message: 'Per salvare varianti devi prima applicare la migration 0006_create_product_variants.sql.',
        },
        { status: 400 },
      )
    }

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

    const variantsResult = await saveProductVariants(env, product.id, product.variants)
    await saveSeoMetadata(env, 'product', product.id, product.seo)

    if (!variantsResult.success) {
      return Response.json(
        {
          success: false,
          message: variantsResult.message,
        },
        { status: 400 },
      )
    }

    return Response.json({
      success: true,
      message: 'Prodotto aggiornato correttamente.',
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Errore durante l’aggiornamento del prodotto.',
      },
      { status: 500 },
    )
  }
}

export async function onRequestPatch({ request, env }) {
  try {
    const body = await request.json()
    const action = String(body.action || '').trim()

    if (action !== 'update_stock') {
      return Response.json(
        {
          success: false,
          message: 'Azione prodotto non supportata.',
        },
        { status: 400 },
      )
    }

    const productId = Number(body.product_id)
    const variantId = Number(body.variant_id || 0)
    const stock = Number(body.stock)

    if (!productId || Number.isNaN(stock) || stock < 0) {
      return Response.json(
        {
          success: false,
          message: 'Dati stock non validi.',
        },
        { status: 400 },
      )
    }

    if (variantId > 0) {
      await env.DB.prepare(`
        UPDATE product_variants
        SET stock = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND product_id = ?
      `)
        .bind(stock, variantId, productId)
        .run()

      return Response.json({
        success: true,
        message: 'Stock variante aggiornato.',
      })
    }

    await env.DB.prepare(`
      INSERT INTO inventory (product_id, stock)
      VALUES (?, ?)
      ON CONFLICT(product_id) DO UPDATE SET stock = excluded.stock
    `)
      .bind(productId, stock)
      .run()

    return Response.json({
      success: true,
      message: 'Stock prodotto aggiornato.',
    })
  } catch {
    return Response.json(
      {
        success: false,
        message: 'Aggiornamento stock non riuscito.',
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
      },
      { status: 500 },
    )
  }
}
