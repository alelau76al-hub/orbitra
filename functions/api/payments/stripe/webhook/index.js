function json(data, status = 200) {
  return Response.json(data, { status })
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function safeEqual(left = '', right = '') {
  if (left.length !== right.length) return false

  let diff = 0
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return diff === 0
}

function parseStripeSignature(header = '') {
  return header.split(',').reduce((parts, item) => {
    const [key, value] = item.split('=')
    if (key && value) parts[key] = value
    return parts
  }, {})
}

async function hmacSha256Hex(secret, value) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return bytesToHex(new Uint8Array(signature))
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return bytesToHex(new Uint8Array(digest))
}

async function verifyStripeSignature(request, payload, webhookSecret) {
  if (!webhookSecret) return true

  const header = request.headers.get('Stripe-Signature') || ''
  const signature = parseStripeSignature(header)

  if (!signature.t || !signature.v1) return false

  const expected = await hmacSha256Hex(webhookSecret, `${signature.t}.${payload}`)
  return safeEqual(expected, signature.v1)
}

function resolveOrderIdFromEvent(event) {
  const object = event?.data?.object || {}
  return Number(
    object.metadata?.order_id ||
      object.client_reference_id ||
      object.payment_intent?.metadata?.order_id ||
      0,
  )
}

function resolvePaymentIntentId(event) {
  const object = event?.data?.object || {}
  if (typeof object.payment_intent === 'string') return object.payment_intent
  if (object.id?.startsWith?.('pi_')) return object.id
  return ''
}

async function hasPaymentEventsTable(env) {
  try {
    await env.DB.prepare('SELECT id FROM payment_events LIMIT 1').first()
    return true
  } catch {
    return false
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

async function recordPaymentEvent(env, event, orderId, status, payloadDigest) {
  if (!(await hasPaymentEventsTable(env))) return { duplicate: false }

  try {
    await env.DB.prepare(`
      INSERT INTO payment_events (provider, event_id, event_type, order_id, status, payload_digest)
      VALUES ('stripe', ?, ?, ?, ?, ?)
    `)
      .bind(event.id, event.type || '', orderId || null, status, payloadDigest)
      .run()

    return { duplicate: false }
  } catch {
    return { duplicate: true }
  }
}

async function updateOrderPayment(env, orderId, event, paymentStatus) {
  if (!orderId) return

  const object = event?.data?.object || {}
  const sessionId = object.id?.startsWith?.('cs_') ? object.id : ''
  const paymentIntentId = resolvePaymentIntentId(event)
  const orderStatus = paymentStatus === 'paid' ? 'paid' : 'new'

  if (await hasOrderPaymentColumns(env)) {
    await env.DB.prepare(`
      UPDATE orders
      SET
        payment_status = ?,
        order_status = ?,
        status = ?,
        payment_provider = 'stripe',
        provider_reference = COALESCE(NULLIF(?, ''), provider_reference),
        stripe_session_id = COALESCE(NULLIF(?, ''), stripe_session_id),
        payment_intent_id = COALESCE(NULLIF(?, ''), payment_intent_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        paymentStatus,
        orderStatus,
        orderStatus,
        sessionId || paymentIntentId,
        sessionId,
        paymentIntentId,
        orderId,
      )
      .run()

    return
  }

  await env.DB.prepare(`
    UPDATE orders
    SET
      payment_status = ?,
      order_status = ?,
      status = ?,
      stripe_session_id = COALESCE(NULLIF(?, ''), stripe_session_id),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
    .bind(paymentStatus, orderStatus, orderStatus, sessionId, orderId)
    .run()
}

function paymentStatusForEvent(type = '') {
  if (['checkout.session.completed', 'payment_intent.succeeded'].includes(type)) return 'paid'
  if (['checkout.session.async_payment_failed', 'payment_intent.payment_failed'].includes(type)) {
    return 'failed'
  }
  return ''
}

export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.text()
    const verified = await verifyStripeSignature(request, payload, env.STRIPE_WEBHOOK_SECRET)

    if (!verified) {
      return json({ success: false, message: 'Firma webhook Stripe non valida.' }, 400)
    }

    const event = JSON.parse(payload)
    if (!event?.id || !event?.type) {
      return json({ success: false, message: 'Evento Stripe non valido.' }, 400)
    }

    const orderId = resolveOrderIdFromEvent(event)
    const paymentStatus = paymentStatusForEvent(event.type)
    const payloadDigest = await sha256Hex(payload)
    const eventRecord = await recordPaymentEvent(env, event, orderId, paymentStatus || 'ignored', payloadDigest)

    if (eventRecord.duplicate) {
      return json({ success: true, received: true, duplicate: true })
    }

    if (paymentStatus && orderId) {
      await updateOrderPayment(env, orderId, event, paymentStatus)
    }

    return json({
      success: true,
      received: true,
      processed: Boolean(paymentStatus && orderId),
    })
  } catch {
    return json({ success: false, message: 'Webhook Stripe non processabile.' }, 400)
  }
}
