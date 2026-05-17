function json(data, status = 200) {
  return Response.json(data, { status })
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase()
}

function readText(value = '') {
  return String(value || '').trim()
}

function normalizeCode(value = '') {
  return String(value || '').trim().toUpperCase()
}

function normalizeCurrency(value = 'EUR') {
  const currency = String(value || 'EUR').trim().toUpperCase()
  return /^[A-Z]{3}$/.test(currency) ? currency : 'EUR'
}

function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}

function sanitizeIdempotencyKey(value = '') {
  const key = String(value || '').trim()
  if (!key || key.length > 120) return ''
  return /^[a-zA-Z0-9:_-]+$/.test(key) ? key : ''
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

async function loadPaymentSettings(env) {
  const fallback = {
    payment_provider: 'manual',
    stripe_enabled: false,
    stripe_mode: 'test',
    stripe_public_key: '',
    stripe_secret_configured: Boolean(env.STRIPE_SECRET_KEY),
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT key, value
      FROM site_settings
      WHERE key IN ('payment_provider', 'stripe_enabled', 'stripe_mode', 'stripe_public_key')
    `).all()

    const map = (results || []).reduce((settings, row) => {
      settings[row.key] = row.value
      return settings
    }, {})

    return {
      payment_provider: ['manual', 'stripe'].includes(map.payment_provider)
        ? map.payment_provider
        : fallback.payment_provider,
      stripe_enabled: String(map.stripe_enabled || '0') === '1',
      stripe_mode: map.stripe_mode === 'live' ? 'live' : 'test',
      stripe_public_key: readText(map.stripe_public_key),
      stripe_secret_configured: fallback.stripe_secret_configured,
    }
  } catch {
    return fallback
  }
}

function resolvePayment(paymentMethod, settings) {
  const method = readText(paymentMethod || 'manual')

  if (method === 'stripe') {
    const stripeReady =
      settings.payment_provider === 'stripe' &&
      settings.stripe_enabled &&
      settings.stripe_secret_configured

    if (!stripeReady) {
      return {
        error: 'Stripe non e configurato. Scegli pagamento manuale o test.',
      }
    }

    return {
      payment_method: 'stripe',
      payment_provider: 'stripe',
      payment_status: 'pending',
      requires_payment_redirect: true,
    }
  }

  if (method === 'test_paid') {
    return {
      payment_method: 'test_paid',
      payment_provider: 'manual',
      payment_status: 'paid',
      requires_payment_redirect: false,
    }
  }

  if (method === 'test_failed') {
    return {
      payment_method: 'test_failed',
      payment_provider: 'manual',
      payment_status: 'failed',
      requires_payment_redirect: false,
    }
  }

  return {
    payment_method: 'manual',
    payment_provider: 'manual',
    payment_status: 'pending',
    requires_payment_redirect: false,
  }
}

async function loadTaxSettings(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT key, value
      FROM tax_settings
    `).all()

    const map = (results || []).reduce((settings, row) => {
      settings[row.key] = row.value
      return settings
    }, {})
    const vatRate = Number(map.vat_rate)

    return {
      vat_rate: Number.isFinite(vatRate) && vatRate >= 0 ? vatRate : 22,
      prices_include_tax: String(map.prices_include_tax ?? '1') !== '0',
    }
  } catch {
    return {
      vat_rate: 22,
      prices_include_tax: true,
    }
  }
}

function isDiscountDateValid(discount) {
  const now = Date.now()
  const startsAt = discount.starts_at ? Date.parse(discount.starts_at) : null
  const endsAt = discount.ends_at ? Date.parse(discount.ends_at) : null

  if (startsAt && Number.isFinite(startsAt) && now < startsAt) return false
  if (endsAt && Number.isFinite(endsAt) && now > endsAt) return false
  return true
}

function calculateDiscountCents(discount, subtotalCents) {
  if (!discount || subtotalCents <= 0) return 0

  if (discount.type === 'fixed') {
    return Math.min(subtotalCents, Math.max(0, Number(discount.value || 0)))
  }

  const percent = Math.min(100, Math.max(0, Number(discount.value || 0)))
  return Math.round((subtotalCents * percent) / 100)
}

async function resolveDiscount(env, code, subtotalCents) {
  const discountCode = normalizeCode(code)

  if (!discountCode) {
    return {
      code: '',
      discount_cents: 0,
    }
  }

  const discount = await env.DB.prepare(`
    SELECT
      code,
      type,
      value,
      starts_at,
      ends_at,
      min_subtotal_cents,
      active
    FROM discount_codes
    WHERE code = ? AND active = 1
  `)
    .bind(discountCode)
    .first()

  if (!discount) {
    return {
      error: 'Codice sconto non valido.',
    }
  }

  if (!isDiscountDateValid(discount)) {
    return {
      error: 'Codice sconto non attivo in questo momento.',
    }
  }

  const minimum = Number(discount.min_subtotal_cents || 0)
  if (minimum > 0 && subtotalCents < minimum) {
    return {
      error: 'Il carrello non raggiunge il minimo richiesto per questo codice sconto.',
    }
  }

  return {
    code: discount.code,
    discount_cents: calculateDiscountCents(discount, subtotalCents),
  }
}

async function recordMockNotification(env, type, metadata = {}) {
  try {
    const template = await env.DB.prepare(`
      SELECT id
      FROM notification_templates
      WHERE type = ? AND active = 1
    `)
      .bind(type)
      .first()

    await env.DB.prepare(`
      INSERT INTO notification_logs (template_id, type, status, description, metadata_json)
      VALUES (?, ?, 'mocked', ?, ?)
    `)
      .bind(
        template?.id || null,
        type,
        `Notifica mock ${type} registrata dal checkout. Nessuna email reale inviata.`,
        JSON.stringify(metadata),
      )
      .run()
  } catch {
    // Notifiche MVP opzionali: il checkout non deve fallire se la tabella manca.
  }
}

function calculateTaxAndTotal(subtotalCents, shippingCents, discountCents, taxSettings) {
  const taxableBaseCents = Math.max(0, subtotalCents - discountCents + shippingCents)
  const taxRate = Math.max(0, Number(taxSettings.vat_rate || 0))
  const pricesIncludeTax = taxSettings.prices_include_tax !== false

  if (taxRate <= 0) {
    return {
      taxable_base_cents: taxableBaseCents,
      tax_cents: 0,
      total_cents: taxableBaseCents,
      tax_rate: 0,
      prices_include_tax: pricesIncludeTax,
    }
  }

  if (pricesIncludeTax) {
    const netCents = Math.round(taxableBaseCents / (1 + taxRate / 100))
    return {
      taxable_base_cents: netCents,
      tax_cents: Math.max(0, taxableBaseCents - netCents),
      total_cents: taxableBaseCents,
      tax_rate: taxRate,
      prices_include_tax: true,
    }
  }

  const taxCents = Math.round((taxableBaseCents * taxRate) / 100)

  return {
    taxable_base_cents: taxableBaseCents,
    tax_cents: taxCents,
    total_cents: taxableBaseCents + taxCents,
    tax_rate: taxRate,
    prices_include_tax: false,
  }
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

async function loadLocalizedPrice(env, productId, variantId, marketHandle, currencyCode) {
  const handle = readText(marketHandle)
  const currency = normalizeCurrency(currencyCode)

  if (!productId || (!handle && !currency)) return null

  try {
    const exact = await env.DB.prepare(`
      SELECT price_cents
      FROM localized_prices
      WHERE product_id = ?
        AND variant_id = ?
        AND active = 1
        AND market_handle = ?
        AND currency_code = ?
      LIMIT 1
    `)
      .bind(productId, Number(variantId || 0), handle, currency)
      .first()

    if (exact) return Number(exact.price_cents)

    const productFallback = await env.DB.prepare(`
      SELECT price_cents
      FROM localized_prices
      WHERE product_id = ?
        AND variant_id = 0
        AND active = 1
        AND market_handle = ?
        AND currency_code = ?
      LIMIT 1
    `)
      .bind(productId, handle, currency)
      .first()

    return productFallback ? Number(productFallback.price_cents) : null
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

async function hasOrderHardeningColumns(env) {
  try {
    await env.DB.prepare('SELECT idempotency_key, payment_provider FROM orders LIMIT 1').first()
    return true
  } catch {
    return false
  }
}

async function publishedPolicyAcceptanceRequired(env) {
  try {
    const row = await env.DB.prepare(`
      SELECT COUNT(*) AS total
      FROM policies
      WHERE status = 'published'
        AND type IN ('privacy_policy', 'terms_conditions')
    `).first()

    return Number(row?.total || 0) > 0
  } catch {
    return false
  }
}

async function findOrderByIdempotency(env, idempotencyKey, hasHardeningColumns) {
  if (!hasHardeningColumns || !idempotencyKey) return null

  return env.DB.prepare(`
    SELECT
      id,
      customer_id,
      subtotal_cents,
      shipping_cents,
      discount_code,
      discount_cents,
      tax_cents,
      tax_rate,
      prices_include_tax,
      total_cents,
      payment_status,
      payment_method,
      payment_provider,
      provider_reference,
      stripe_session_id,
      payment_intent_id,
      order_status,
      shipping_method,
      currency,
      idempotency_key
    FROM orders
    WHERE idempotency_key = ?
    LIMIT 1
  `)
    .bind(idempotencyKey)
    .first()
}

function publicOrderResponse(order) {
  return {
    id: order.id,
    customer_id: order.customer_id,
    subtotal_cents: Number(order.subtotal_cents || 0),
    shipping_cents: Number(order.shipping_cents || 0),
    discount_code: order.discount_code || '',
    discount_cents: Number(order.discount_cents || 0),
    taxable_base_cents: Number(order.taxable_base_cents || 0),
    tax_cents: Number(order.tax_cents || 0),
    tax_rate: Number(order.tax_rate || 0),
    prices_include_tax: order.prices_include_tax !== false && Number(order.prices_include_tax) !== 0,
    total_cents: Number(order.total_cents || 0),
    payment_status: order.payment_status || 'pending',
    payment_method: order.payment_method || 'manual',
    payment_provider: order.payment_provider || (order.payment_method === 'stripe' ? 'stripe' : 'manual'),
    provider_reference: order.provider_reference || order.stripe_session_id || '',
    stripe_session_id: order.stripe_session_id || '',
    payment_intent_id: order.payment_intent_id || '',
    requires_payment_redirect: Boolean(order.requires_payment_redirect),
    order_status: order.order_status || order.status || 'new',
    shipping_method: order.shipping_method || 'standard',
    currency: normalizeCurrency(order.currency || 'EUR'),
    idempotency_key: order.idempotency_key || '',
  }
}

async function insertOrder(env, data, hasHardeningColumns) {
  if (hasHardeningColumns) {
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
        payment_provider,
        provider_reference,
        payment_intent_id,
        checkout_id,
        idempotency_key,
        currency,
        order_status,
        shipping_method,
        shipping_address_line1,
        shipping_address_city,
        shipping_address_postal_code,
        shipping_address_country,
        discount_code,
        discount_cents,
        tax_cents,
        tax_rate,
        prices_include_tax,
        terms_accepted_at,
        privacy_accepted_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
      .bind(
        data.customer.email,
        data.total_cents,
        data.order_status,
        data.customer_id,
        data.customer.name,
        data.customer.phone,
        data.subtotal_cents,
        data.shipping_cents,
        data.payment_status,
        data.payment_method,
        data.payment_provider,
        data.provider_reference,
        data.payment_intent_id,
        data.checkout_id,
        data.idempotency_key,
        data.currency,
        data.order_status,
        data.shipping_method,
        data.address.line1,
        data.address.city,
        data.address.postal_code,
        data.address.country,
        data.discount_code,
        data.discount_cents,
        data.tax_cents,
        data.tax_rate,
        data.prices_include_tax ? 1 : 0,
        data.policy_accepted_at,
        data.policy_accepted_at,
      )
      .run()

    return insertedOrder.meta.last_row_id
  }

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
      discount_code,
      discount_cents,
      tax_cents,
      tax_rate,
      prices_include_tax,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `)
    .bind(
      data.customer.email,
      data.total_cents,
      data.order_status,
      data.customer_id,
      data.customer.name,
      data.customer.phone,
      data.subtotal_cents,
      data.shipping_cents,
      data.payment_status,
      data.payment_method,
      data.order_status,
      data.shipping_method,
      data.address.line1,
      data.address.city,
      data.address.postal_code,
      data.address.country,
      data.discount_code,
      data.discount_cents,
      data.tax_cents,
      data.tax_rate,
      data.prices_include_tax ? 1 : 0,
    )
    .run()

  return insertedOrder.meta.last_row_id
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readJson(request)
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
    const requestedDiscountCode = normalizeCode(body.discount_code)
    const idempotencyKey = sanitizeIdempotencyKey(body.idempotency_key || body.checkout_id)
    const checkoutId = idempotencyKey || sanitizeIdempotencyKey(body.checkout_id)
    const currency = normalizeCurrency(body.currency || 'EUR')
    const marketHandle = readText(body.market_handle || body.market?.handle || '')
    const hasHardeningColumns = await hasOrderHardeningColumns(env)

    if (!customer.name || !isValidEmail(customer.email)) {
      return json({ success: false, message: 'Nome ed email valida sono obbligatori.' }, 400)
    }

    if (!address.line1 || !address.city || !address.postal_code || !address.country) {
      return json({ success: false, message: 'Indirizzo di spedizione incompleto.' }, 400)
    }

    if (items.length === 0) {
      return json({ success: false, message: 'Il carrello e vuoto.' }, 400)
    }

    if (await publishedPolicyAcceptanceRequired(env)) {
      const acceptedPolicy = body.policy_accepted === true || String(body.policy_accepted) === '1'
      if (!acceptedPolicy) {
        return json({ success: false, message: 'Accetta termini e privacy per completare l ordine.' }, 400)
      }
    }

    const idempotentOrder = await findOrderByIdempotency(env, idempotencyKey, hasHardeningColumns)
    if (idempotentOrder) {
      return json({
        success: true,
        idempotent_replay: true,
        order: publicOrderResponse(idempotentOrder),
      })
    }

    const paymentSettings = await loadPaymentSettings(env)
    const payment = resolvePayment(body.payment_method, paymentSettings)
    if (payment.error) {
      return json({ success: false, message: payment.error }, 400)
    }

    const orderItems = []
    let subtotalCents = 0

    for (const item of items) {
      const productSlug = readText(item.productSlug)
      const quantity = Math.max(1, Math.min(99, Number(item.quantity || 1)))
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

      const basePriceCents =
        variant && variant.price_cents !== null && variant.price_cents !== undefined
          ? Number(variant.price_cents)
          : Number(product.price_cents)
      const localizedPriceCents = await loadLocalizedPrice(
        env,
        product.id,
        variant?.id || 0,
        marketHandle,
        currency,
      )
      const priceCents = Number.isFinite(localizedPriceCents) && localizedPriceCents > 0
        ? localizedPriceCents
        : basePriceCents
      const stock =
        variant && variant.stock !== null && variant.stock !== undefined
          ? Number(variant.stock)
          : Number(product.stock)

      if (!Number.isFinite(priceCents) || priceCents < 0) {
        return json({ success: false, message: `Prezzo non valido per ${product.name}.` }, 400)
      }

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
    const discount = await resolveDiscount(env, requestedDiscountCode, subtotalCents)

    if (discount.error) {
      return json({ success: false, message: discount.error }, 400)
    }

    const taxSettings = await loadTaxSettings(env)
    const taxSummary = calculateTaxAndTotal(
      subtotalCents,
      shipping.price_cents,
      discount.discount_cents,
      taxSettings,
    )
    const totalCents = taxSummary.total_cents
    const orderStatus = payment.payment_status === 'paid' ? 'paid' : 'new'
    const customerId = await upsertCustomer(env, customer, address)
    const policyAcceptedAt = body.policy_accepted ? new Date().toISOString() : null

    const orderId = await insertOrder(
      env,
      {
        customer,
        customer_id: customerId,
        address,
        subtotal_cents: subtotalCents,
        shipping_cents: shipping.price_cents,
        total_cents: totalCents,
        discount_code: discount.code || '',
        discount_cents: discount.discount_cents,
        tax_cents: taxSummary.tax_cents,
        tax_rate: taxSummary.tax_rate,
        prices_include_tax: taxSummary.prices_include_tax,
        payment_status: payment.payment_status,
        payment_method: payment.payment_method,
        payment_provider: payment.payment_provider,
        provider_reference: '',
        payment_intent_id: '',
        checkout_id: checkoutId,
        idempotency_key: idempotencyKey,
        currency,
        order_status: orderStatus,
        shipping_method: shipping.handle,
        policy_accepted_at: policyAcceptedAt,
      },
      hasHardeningColumns,
    )

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

    await recordMockNotification(env, 'order_created', {
      order_id: orderId,
      total_cents: totalCents,
      payment_status: payment.payment_status,
    })

    return json({
      success: true,
      order: publicOrderResponse({
        id: orderId,
        customer_id: customerId,
        subtotal_cents: subtotalCents,
        shipping_cents: shipping.price_cents,
        discount_code: discount.code || '',
        discount_cents: discount.discount_cents,
        taxable_base_cents: taxSummary.taxable_base_cents,
        tax_cents: taxSummary.tax_cents,
        tax_rate: taxSummary.tax_rate,
        prices_include_tax: taxSummary.prices_include_tax,
        total_cents: totalCents,
        payment_status: payment.payment_status,
        payment_method: payment.payment_method,
        payment_provider: payment.payment_provider,
        requires_payment_redirect: payment.requires_payment_redirect,
        order_status: orderStatus,
        shipping_method: shipping.handle,
        currency,
        idempotency_key: idempotencyKey,
      }),
    })
  } catch {
    return json(
      {
        success: false,
        message: 'Errore durante la creazione ordine. Verifica la configurazione checkout e riprova.',
      },
      500,
    )
  }
}
