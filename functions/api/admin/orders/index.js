function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

const ORDER_STATUSES = new Set(['pending', 'confirmed', 'fulfilled', 'cancelled', 'new', 'paid', 'processing', 'shipped', 'completed'])
const PAYMENT_STATUSES = new Set(['pending', 'paid', 'failed', 'refunded'])
const FULFILLMENT_STATUSES = new Set(['unfulfilled', 'partially_fulfilled', 'fulfilled'])

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function tableMissing(error) {
  return String(error?.message || error || '').toLowerCase().includes('no such table')
}

async function hasOperationColumns(env) {
  try {
    await env.DB.prepare('SELECT fulfillment_status, tracking_number, refund_status, internal_note FROM orders LIMIT 1').first()
    return true
  } catch {
    return false
  }
}

async function hasPaymentColumns(env) {
  try {
    await env.DB.prepare('SELECT payment_provider, provider_reference, payment_intent_id, currency FROM orders LIMIT 1').first()
    return true
  } catch {
    return false
  }
}

async function loadOrderItems(env, orderId) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        order_id,
        product_id,
        product_slug,
        product_name,
        variant_id,
        variant_label,
        sku,
        quantity,
        price_cents
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
    `)
      .bind(orderId)
      .all()

    return results || []
  } catch {
    return []
  }
}

async function loadOrderTimeline(env, orderId) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, order_id, event_type, title, description, metadata_json, created_at
      FROM order_timeline
      WHERE order_id = ?
      ORDER BY created_at ASC, id ASC
    `)
      .bind(orderId)
      .all()
    return results || []
  } catch {
    return []
  }
}

async function loadOrderReturns(env, orderId) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, order_id, customer_email, reason, note, internal_note, refund_amount_cents, status, created_at, updated_at
      FROM return_requests
      WHERE active = 1 AND order_id = ?
      ORDER BY created_at DESC, id DESC
    `)
      .bind(orderId)
      .all()
    return results || []
  } catch {
    return []
  }
}

async function loadNotificationLogs(env, orderId) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, type, status, description, metadata_json, created_at
      FROM notification_logs
      WHERE metadata_json LIKE ?
      ORDER BY created_at DESC, id DESC
      LIMIT 25
    `)
      .bind(`%"order_id":${orderId}%`)
      .all()
    return results || []
  } catch {
    return []
  }
}

async function appendTimeline(env, orderId, eventType, title, description = '', metadata = {}) {
  try {
    await env.DB.prepare(`
      INSERT INTO order_timeline (order_id, event_type, title, description, metadata_json)
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(orderId, eventType, title, description, JSON.stringify(metadata))
      .run()
  } catch {}
}

async function logNotification(env, type, orderId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO notification_logs (type, status, description, metadata_json)
      VALUES (?, 'mocked', ?, ?)
    `)
      .bind(type, description, JSON.stringify({ order_id: orderId, source: 'operations' }))
      .run()
  } catch {}
}

async function logActivity(env, action, orderId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'order', ?, ?)
    `)
      .bind(action, String(orderId), description)
      .run()
  } catch {}
}

function normalizeOrderStatus(status) {
  const value = String(status || '').trim()
  if (value === 'new') return 'pending'
  if (value === 'paid' || value === 'processing') return 'confirmed'
  if (value === 'shipped' || value === 'completed') return 'fulfilled'
  if (ORDER_STATUSES.has(value)) return value
  return 'pending'
}

export async function onRequestGet({ env }) {
  try {
    const hasExtendedPayments = await hasPaymentColumns(env)
    const hasOperations = await hasOperationColumns(env)
    const paymentFields = hasExtendedPayments
      ? `
          payment_provider,
          provider_reference,
          stripe_session_id,
          payment_intent_id,
          currency,
          idempotency_key,
        `
      : ''
    const operationFields = hasOperations
      ? `
          fulfillment_status,
          tracking_number,
          tracking_carrier,
          tracking_url,
          fulfilled_at,
          shipping_note,
          internal_note,
          refund_status,
          refund_amount_cents,
          refund_note,
        `
      : ''

    const { results } = await env.DB.prepare(`
      SELECT
        id,
        email,
        total_cents,
        status,
        customer_id,
        customer_name,
        phone,
        subtotal_cents,
        shipping_cents,
        discount_code,
        discount_cents,
        tax_cents,
        tax_rate,
        prices_include_tax,
        payment_status,
        payment_method,
        ${paymentFields}
        order_status,
        shipping_method,
        shipping_address_line1,
        shipping_address_city,
        shipping_address_postal_code,
        shipping_address_country,
        ${operationFields}
        created_at,
        updated_at
      FROM orders
      ORDER BY created_at DESC, id DESC
      LIMIT 150
    `).all()

    const orders = []
    for (const order of results || []) {
      const orderStatus = normalizeOrderStatus(order.order_status || order.status)
      orders.push({
        ...order,
        order_status: orderStatus,
        payment_provider: order.payment_provider || (order.payment_method === 'stripe' ? 'stripe' : 'manual'),
        provider_reference: order.provider_reference || order.stripe_session_id || '',
        payment_intent_id: order.payment_intent_id || '',
        currency: order.currency || 'EUR',
        idempotency_key: order.idempotency_key || '',
        fulfillment_status: order.fulfillment_status || (orderStatus === 'fulfilled' ? 'fulfilled' : 'unfulfilled'),
        refund_status: order.refund_status || 'none',
        refund_amount_cents: order.refund_amount_cents || 0,
        items: await loadOrderItems(env, order.id),
        timeline: await loadOrderTimeline(env, order.id),
        returns: await loadOrderReturns(env, order.id),
        notification_logs: await loadNotificationLogs(env, order.id),
        operations_ready: hasOperations,
      })
    }

    return json({ success: true, orders, operations_ready: hasOperations })
  } catch {
    return json(
      {
        success: false,
        message: 'Errore caricamento ordini. Verifica che le migration checkout/operations siano applicate.',
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)
    const action = String(body.action || 'update_status').trim()
    const hasOperations = await hasOperationColumns(env)

    if (!id) return json({ success: false, message: 'Ordine non valido.' }, 400)

    if (!hasOperations && !['update_status', 'update_payment_status'].includes(action)) {
      return json({ success: false, message: 'Operations Suite richiede la migration 0016.' }, 503)
    }

    if (action === 'update_status') {
      const orderStatus = normalizeOrderStatus(body.order_status)
      await env.DB.prepare(`
        UPDATE orders
        SET order_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(orderStatus, orderStatus, id)
        .run()
      await appendTimeline(env, id, 'order_status_updated', 'Order status updated', `Status: ${orderStatus}`)
      return json({ success: true, message: 'Stato ordine aggiornato.' })
    }

    if (action === 'confirm_order') {
      await env.DB.prepare(`
        UPDATE orders
        SET order_status = 'confirmed', status = 'confirmed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(id)
        .run()
      await appendTimeline(env, id, 'order_confirmed', 'Order confirmed')
      await logActivity(env, 'order_confirmed', id, 'Order confirmed from operations.')
      return json({ success: true, message: 'Ordine confermato.' })
    }

    if (action === 'mark_paid') {
      await env.DB.prepare(`
        UPDATE orders
        SET payment_status = 'paid', order_status = 'confirmed', status = 'confirmed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(id)
        .run()
      await appendTimeline(env, id, 'payment_marked_paid', 'Payment marked as paid')
      await logNotification(env, 'payment_received', id, 'Payment received notification mocked/logged.')
      await logActivity(env, 'payment_marked_paid', id, 'Manual payment marked as paid.')
      return json({ success: true, message: 'Pagamento marcato come paid.' })
    }

    if (action === 'update_payment_status') {
      const paymentStatus = PAYMENT_STATUSES.has(body.payment_status) ? body.payment_status : 'pending'
      await env.DB.prepare('UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(paymentStatus, id)
        .run()
      await appendTimeline(env, id, 'payment_status_updated', 'Payment status updated', `Status: ${paymentStatus}`)
      return json({ success: true, message: 'Stato pagamento aggiornato.' })
    }

    if (action === 'mark_fulfilled' || action === 'add_tracking') {
      const carrier = String(body.tracking_carrier || body.carrier || '').trim()
      const trackingNumber = String(body.tracking_number || '').trim()
      const trackingUrl = String(body.tracking_url || '').trim()
      const shippingNote = String(body.shipping_note || '').trim()
      const fulfillmentStatus = action === 'mark_fulfilled' ? 'fulfilled' : 'partially_fulfilled'
      const fulfilledAt = action === 'mark_fulfilled' ? new Date().toISOString() : null

      await env.DB.prepare(`
        UPDATE orders
        SET fulfillment_status = ?,
            tracking_carrier = COALESCE(NULLIF(?, ''), tracking_carrier),
            tracking_number = COALESCE(NULLIF(?, ''), tracking_number),
            tracking_url = COALESCE(NULLIF(?, ''), tracking_url),
            shipping_note = COALESCE(NULLIF(?, ''), shipping_note),
            fulfilled_at = COALESCE(?, fulfilled_at),
            order_status = CASE WHEN ? = 'fulfilled' THEN 'fulfilled' ELSE order_status END,
            status = CASE WHEN ? = 'fulfilled' THEN 'fulfilled' ELSE status END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(
          fulfillmentStatus,
          carrier,
          trackingNumber,
          trackingUrl,
          shippingNote,
          fulfilledAt,
          fulfillmentStatus,
          fulfillmentStatus,
          id,
        )
        .run()

      await env.DB.prepare(`
        INSERT INTO fulfillment_records (order_id, status, carrier, tracking_number, tracking_url, shipping_note, fulfilled_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
        .bind(id, fulfillmentStatus, carrier || null, trackingNumber || null, trackingUrl || null, shippingNote || null, fulfilledAt)
        .run()
      await appendTimeline(
        env,
        id,
        action === 'mark_fulfilled' ? 'order_fulfilled' : 'tracking_added',
        action === 'mark_fulfilled' ? 'Order fulfilled' : 'Tracking added',
        trackingNumber ? `Tracking: ${trackingNumber}` : '',
        { carrier, tracking_number: trackingNumber, tracking_url: trackingUrl },
      )
      if (action === 'mark_fulfilled') await logNotification(env, 'order_fulfilled', id, 'Fulfillment notification mocked/logged.')
      return json({ success: true, message: action === 'mark_fulfilled' ? 'Ordine marcato fulfilled.' : 'Tracking aggiunto.' })
    }

    if (action === 'cancel_order') {
      await env.DB.prepare(`
        UPDATE orders
        SET order_status = 'cancelled', status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(id)
        .run()
      await appendTimeline(env, id, 'order_cancelled', 'Order cancelled', String(body.note || '').trim())
      await logNotification(env, 'order_cancelled', id, 'Order cancelled notification mocked/logged.')
      return json({ success: true, message: 'Ordine cancellato.' })
    }

    if (action === 'add_note') {
      const note = String(body.internal_note || '').trim()
      await env.DB.prepare('UPDATE orders SET internal_note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(note, id)
        .run()
      await appendTimeline(env, id, 'note_added', 'Internal note added', note)
      return json({ success: true, message: 'Nota ordine salvata.' })
    }

    if (action === 'refund_requested' || action === 'refund_complete') {
      const refundStatus = action === 'refund_complete' ? 'refunded' : 'requested'
      const refundAmount = Math.max(0, Math.round(Number(body.refund_amount || 0) * 100))
      const refundNote = String(body.refund_note || '').trim()
      await env.DB.prepare(`
        UPDATE orders
        SET refund_status = ?, refund_amount_cents = ?, refund_note = ?,
            payment_status = CASE WHEN ? = 'refunded' THEN 'refunded' ELSE payment_status END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(refundStatus, refundAmount, refundNote, refundStatus, id)
        .run()
      await appendTimeline(
        env,
        id,
        action === 'refund_complete' ? 'refund_marked_complete' : 'refund_requested',
        action === 'refund_complete' ? 'Refund marked complete' : 'Refund requested',
        refundNote || 'Manual refund / provider required',
        { refund_amount_cents: refundAmount },
      )
      await logNotification(env, action === 'refund_complete' ? 'refund_created' : 'return_requested', id, 'Refund/return notification mocked/logged.')
      return json({ success: true, message: action === 'refund_complete' ? 'Refund marcato completo.' : 'Refund richiesto.' })
    }

    return json({ success: false, message: 'Azione ordine non supportata.' }, 400)
  } catch {
    return json({ success: false, message: 'Errore aggiornamento ordine.' }, 500)
  }
}
