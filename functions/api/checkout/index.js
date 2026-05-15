function json(data, status = 200) {
  return Response.json(data, { status })
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase()
}

function readText(value = '') {
  return String(value || '').trim()
}

function fallbackShippingMethods() {
  return [
    {
      handle: 'standard',
      name: 'Spedizione standard',
      price_cents: 990,
      free_over_cents: null,
    },
    {
      handle: 'free_over_100',
      name: 'Spedizione gratuita',
      price_cents: 0,
      free_over_cents: 10000,
    },
  ]
}

async function getShippingMethods(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT handle, name, price_cents, free_over_cents
      FROM shipping_methods
      WHERE active = 1
      ORDER BY sort_order ASC, id ASC
    `).all()

    return results?.length ? results : fallbackShippingMethods()
  } catch {
    return fallbackShippingMethods()
  }
}

function resolveShipping(methods, selectedHandle, subtotalCents) {
  const available = methods.filter(
    (method) => !method.free_over_cents || subtotalCents >= Number(method.free_over_cents),
  )
  const selected =
    available.find((method) => method.handle === selectedHandle) ||
    available[0] ||
    methods[0]

  if (!selected) {
    return {
      handle: 'standard',
      name: 'Spedizione standard',
      price_cents: 0,
    }
  }

  return {
    handle: selected.handle,
    name: selected.name,
    price_cents: Number(selected.price_cents || 0),
  }
}

function resolvePaymentStatus(paymentMethod) {
  if (paymentMethod === 'test_paid') return 'paid'
  if (paymentMethod === 'test_failed') return 'failed'
  return 'pending'
}

async function loadProduct(env, slug) {
  return env.DB.prepare(`
    SELECT
      products.id,
      products.slug,
      products.name,
      products.price_cents,
      products.active,
      COALESCE(inventory.stock, 0) AS stock
    FROM products
    LEFT JOIN inventory ON inventory.product_id = products.id
    WHERE products.slug = ? AND products.active = 1
  `)
    .bind(slug)
    .first()
}

async function loadVariant(env, productId, variantId) {
  if (!variantId) return null

  try {
    return await env.DB.prepare(`
      SELECT
        id,
        product_id,
        option_name,
        option_value,
        sku,
        price_cents,
        stock
      FROM product_variants
      WHERE id = ? AND product_id = ? AND active = 1
    `)
      .bind(Number(variantId), productId)
      .first()
  } catch {
    return null
  }
}

async function upsertCustomer(env, customer, address) {
  const existing = await env.DB.prepare(
    'SELECT id FROM customers WHERE email = ?',
  )
    .bind(customer.email)
    .first()

  if (existing) {
    await env.DB.prepare(`
      UPDATE customers
      SET
        name = ?,
        phone = ?,
        shipping_address_line1 = ?,
        shipping_address_city = ?,
        shipping_address_postal_code = ?,
        shipping_address_country = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        customer.name,
        customer.phone,
        address.line1,
        address.city,
        address.postal_code,
        address.country,
        existing.id,
      )
      .run()

    return existing.id
  }

  const inserted = await env.DB.prepare(`
    INSERT INTO customers (
      email,
      name,
      phone,
      shipping_address_line1,
      shipping_address_city,
      shipping_address_postal_code,
      shipping_address_country
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      customer.email,
      customer.name,
      customer.phone,
      address.line1,
      address.city,
      address.postal_code,
      address.country,
    )
    .run()

  return inserted.meta.last_row_id
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const customer = {
      name: readText(body.customer?.name),
      email: normalizeEmail(body.customer?.email),
      phone: readText(body.customer?.phone),
    }
    const address = {
      line1: readText(body.shipping_address?.line1),
      city: readText(body.shipping_address?.city),
      postal_code: readText(body.shipping_address?.postal_code),
      country: readText(body.shipping_address?.country || 'Italia'),
    }
    const items = Array.isArray(body.items) ? body.items : []
    const paymentMethod = readText(body.payment_method || 'manual')

    if (!customer.name || !customer.email || !customer.email.includes('@')) {
      return json({ success: false, message: 'Nome ed email valida sono obbligatori.' }, 400)
    }

    if (!address.line1 || !address.city || !address.postal_code || !address.country) {
      return json({ success: false, message: 'Indirizzo di spedizione incompleto.' }, 400)
    }

    if (items.length === 0) {
      return json({ success: false, message: 'Il carrello è vuoto.' }, 400)
    }

    const orderItems = []
    let subtotalCents = 0

    for (const item of items) {
      const productSlug = readText(item.productSlug)
      const quantity = Math.max(1, Number(item.quantity || 1))
      const product = await loadProduct(env, productSlug)

      if (!product) {
        return json({ success: false, message: `Prodotto non disponibile: ${productSlug}` }, 400)
      }

      const variant = await loadVariant(env, product.id, item.variantId)

      if (item.variantId && !variant) {
        return json(
          { success: false, message: `Variante non disponibile per ${product.name}.` },
          400,
        )
      }

      const priceCents =
        variant && variant.price_cents !== null && variant.price_cents !== undefined
          ? Number(variant.price_cents)
          : Number(product.price_cents)
      const stock =
        variant && variant.stock !== null && variant.stock !== undefined
          ? Number(variant.stock)
          : Number(product.stock)

      if (stock < quantity) {
        return json(
          { success: false, message: `Stock insufficiente per ${product.name}.` },
          400,
        )
      }

      subtotalCents += priceCents * quantity
      orderItems.push({
        product,
        variant,
        quantity,
        price_cents: priceCents,
      })
    }

    const shippingMethods = await getShippingMethods(env)
    const shipping = resolveShipping(
      shippingMethods,
      readText(body.shipping_method || 'standard'),
      subtotalCents,
    )
    const totalCents = subtotalCents + shipping.price_cents
    const paymentStatus = resolvePaymentStatus(paymentMethod)
    const orderStatus = paymentStatus === 'paid' ? 'paid' : 'new'
    const customerId = await upsertCustomer(env, customer, address)

    const insertedOrder = await env.DB.prepare(`
      INSERT INTO orders (
        email,
        total_cents,
        status,
        customer_id,
        customer_name,
        phone,
        subtotal_cents,
        shipping_cents,
        payment_status,
        payment_method,
        order_status,
        shipping_method,
        shipping_address_line1,
        shipping_address_city,
        shipping_address_postal_code,
        shipping_address_country,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
      .bind(
        customer.email,
        totalCents,
        orderStatus,
        customerId,
        customer.name,
        customer.phone,
        subtotalCents,
        shipping.price_cents,
        paymentStatus,
        paymentMethod,
        orderStatus,
        shipping.handle,
        address.line1,
        address.city,
        address.postal_code,
        address.country,
      )
      .run()

    const orderId = insertedOrder.meta.last_row_id

    for (const item of orderItems) {
      const variantLabel = item.variant
        ? `${item.variant.option_name}: ${item.variant.option_value}`
        : ''

      await env.DB.prepare(`
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          price_cents,
          product_slug,
          product_name,
          variant_id,
          variant_label,
          sku
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
        .bind(
          orderId,
          item.product.id,
          item.quantity,
          item.price_cents,
          item.product.slug,
          item.product.name,
          item.variant?.id || null,
          variantLabel,
          item.variant?.sku || '',
        )
        .run()
    }

    return json({
      success: true,
      order: {
        id: orderId,
        customer_id: customerId,
        subtotal_cents: subtotalCents,
        shipping_cents: shipping.price_cents,
        total_cents: totalCents,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        order_status: orderStatus,
        shipping_method: shipping.handle,
      },
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore durante la creazione ordine. Verifica che la migration checkout sia applicata.',
        error: error.message,
      },
      500,
    )
  }
}
