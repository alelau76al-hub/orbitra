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

function readText(value = '') {
  return String(value || '').trim()
}

function normalizeCurrency(value = 'EUR') {
  const currency = String(value || 'EUR').trim().toUpperCase()
  return /^[A-Z]{3}$/.test(currency) ? currency : 'EUR'
}

function safeReturnUrl(value, fallbackOrigin, fallbackPath) {
  try {
    const url = new URL(readText(value) || fallbackPath, fallbackOrigin)
    if (url.origin !== new URL(fallbackOrigin).origin) {
      return new URL(fallbackPath, fallbackOrigin).toString()
    }
    return url.toString()
  } catch {
    return new URL(fallbackPath, fallbackOrigin).toString()
  }
}

async function hasOrderPaymentColumns(env) {
  try {
    await env.DB.prepare('SELECT payment_provider, provider_reference, payment_intent_id FROM orders LIMIT 1').first()
    return true
  } catch {
    return false
  }
}

async function loadOrder(env, orderId) {
  const hasPaymentColumns = await hasOrderPaymentColumns(env)

  if (hasPaymentColumns) {
    const order = await env.DB.prepare(`
      SELECT
        id,
        email,
        total_cents,
        payment_status,
        payment_method,
        payment_provider,
        provider_reference,
        stripe_session_id,
        payment_intent_id,
        currency
      FROM orders
      WHERE id = ?
      LIMIT 1
    `)
      .bind(orderId)
      .first()

    return {
      order,
      hasPaymentColumns,
    }
  }

  const order = await env.DB.prepare(`
    SELECT
      id,
      email,
      total_cents,
      payment_status,
      payment_method,
      stripe_session_id
    FROM orders
    WHERE id = ?
    LIMIT 1
  `)
    .bind(orderId)
    .first()

  return {
    order,
    hasPaymentColumns,
  }
}

async function updateOrderStripeSession(env, orderId, session, hasPaymentColumns) {
  if (hasPaymentColumns) {
    await env.DB.prepare(`
      UPDATE orders
      SET
        payment_provider = 'stripe',
        payment_method = 'stripe',
        provider_reference = ?,
        stripe_session_id = ?,
        payment_intent_id = ?,
        payment_status = 'pending',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(session.id, session.id, session.payment_intent || '', orderId)
      .run()

    return
  }

  await env.DB.prepare(`
    UPDATE orders
    SET
      payment_method = 'stripe',
      stripe_session_id = ?,
      payment_status = 'pending',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
    .bind(session.id, orderId)
    .run()
}

async function createStripeCheckoutSession(env, order, request, body) {
  const origin = new URL(request.url).origin
  const successUrl = safeReturnUrl(
    body.success_url,
    origin,
    `/checkout?payment=stripe_success&order_id=${order.id}`,
  )
  const cancelUrl = safeReturnUrl(
    body.cancel_url,
    origin,
    `/checkout?payment=stripe_cancel&order_id=${order.id}`,
  )
  const params = new URLSearchParams()

  params.set('mode', 'payment')
  params.set('success_url', successUrl)
  params.set('cancel_url', cancelUrl)
  params.set('client_reference_id', String(order.id))
  params.set('customer_email', order.email || '')
  params.set('line_items[0][price_data][currency]', normalizeCurrency(order.currency).toLowerCase())
  params.set('line_items[0][price_data][product_data][name]', `Ordine #${order.id}`)
  params.set('line_items[0][price_data][unit_amount]', String(Math.max(0, Number(order.total_cents || 0))))
  params.set('line_items[0][quantity]', '1')
  params.set('metadata[order_id]', String(order.id))
  params.set('payment_intent_data[metadata][order_id]', String(order.id))

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.id || !data.url) {
    return {
      success: false,
      message: 'Stripe non ha creato la sessione. Verifica chiavi test mode e configurazione.',
    }
  }

  return {
    success: true,
    session: data,
  }
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.STRIPE_SECRET_KEY) {
      return json(
        {
          success: false,
          configured: false,
          message: 'Stripe non configurato: imposta STRIPE_SECRET_KEY nelle variabili ambiente.',
        },
        400,
      )
    }

    const body = await readJson(request)
    const orderId = Number(body.order_id)
    const email = readText(body.email).toLowerCase()

    if (!orderId || Number.isNaN(orderId)) {
      return json({ success: false, message: 'Ordine non valido per il pagamento Stripe.' }, 400)
    }

    const { order, hasPaymentColumns } = await loadOrder(env, orderId)

    if (!order) {
      return json({ success: false, message: 'Ordine non trovato.' }, 404)
    }

    if (email && readText(order.email).toLowerCase() !== email) {
      return json({ success: false, message: 'Ordine non valido per questa email.' }, 403)
    }

    if (Number(order.total_cents || 0) <= 0) {
      return json({ success: false, message: 'Totale ordine non valido per Stripe.' }, 400)
    }

    if (order.payment_method !== 'stripe' && order.payment_provider !== 'stripe') {
      return json({ success: false, message: 'Questo ordine non richiede pagamento Stripe.' }, 400)
    }

    if (order.payment_status === 'paid') {
      return json({ success: false, message: 'Questo ordine risulta gia pagato.' }, 400)
    }

    const result = await createStripeCheckoutSession(env, order, request, body)
    if (!result.success) return json(result, 400)

    await updateOrderStripeSession(env, orderId, result.session, hasPaymentColumns)

    return json({
      success: true,
      configured: true,
      checkout_url: result.session.url,
      session_id: result.session.id,
      order_id: orderId,
    })
  } catch {
    return json(
      {
        success: false,
        message: 'Errore preparazione pagamento Stripe. Riprova o usa pagamento manuale.',
      },
      500,
    )
  }
}
