const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  })

const EVENTS = new Set(['order.created', 'order.paid', 'order.fulfilled', 'customer.created', 'product.updated', 'return.requested'])

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || error || ''))
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

async function sha256Hex(value = '') {
  if (!value) return null
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function deliverWebhook(env, hook, payload = {}) {
  const event = hook.event
  const requestBody = JSON.stringify({ event, data: payload })
  let status = 'failed'
  let responseStatus = null
  let errorText = ''

  try {
    const response = await fetch(hook.target_url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-takeoff-event': event,
      },
      body: requestBody,
    })
    responseStatus = response.status
    status = response.ok ? 'delivered' : 'failed'
  } catch {
    status = 'failed'
    errorText = 'Delivery failed.'
  }

  await env.DB.prepare(`
    INSERT INTO webhook_deliveries (webhook_id, event, status, response_status, error, request_body)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
    .bind(hook.id, event, status, responseStatus, errorText, requestBody)
    .run()

  return { status, response_status: responseStatus }
}

export async function onRequestGet({ env }) {
  try {
    const [webhooks, deliveries] = await Promise.all([
      env.DB.prepare(`
        SELECT id, event, target_url, active, created_at, updated_at, CASE WHEN secret_hash IS NULL THEN 0 ELSE 1 END AS has_secret
        FROM webhooks
        ORDER BY active DESC, created_at DESC, id DESC
        LIMIT 250
      `).all(),
      env.DB.prepare(`
        SELECT id, webhook_id, event, status, response_status, error, created_at
        FROM webhook_deliveries
        ORDER BY created_at DESC, id DESC
        LIMIT 50
      `).all(),
    ])
    return json({ success: true, events: [...EVENTS], webhooks: webhooks.results || [], deliveries: deliveries.results || [] })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, events: [...EVENTS], webhooks: [], deliveries: [], setup_required: true })
    return json({ success: false, message: 'Webhooks non disponibili.' }, { status: 500 })
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request)
    if (body.action === 'test') {
      const id = Number(body.id)
      const hook = await env.DB.prepare('SELECT id, event, target_url FROM webhooks WHERE id = ?').bind(id).first()
      if (!hook) return json({ success: false, message: 'Webhook non trovato.' }, { status: 404 })
      const delivery = await deliverWebhook(env, hook, {
        test: true,
        source: 'TakeOff Webhooks',
      })
      return json({
        success: true,
        delivery,
        message:
          delivery.status === 'delivered'
            ? 'Webhook test consegnato.'
            : 'Webhook test registrato con esito failed. Controlla target URL e log.',
      })
    }

    const event = EVENTS.has(body.event) ? body.event : ''
    const targetUrl = String(body.target_url || '').trim()
    if (!event || !/^https?:\/\//i.test(targetUrl)) {
      return json({ success: false, message: 'Evento e target URL valido sono obbligatori.' }, { status: 400 })
    }
    const secretHash = body.secret ? await sha256Hex(String(body.secret)) : null

    await env.DB.prepare(`
      INSERT INTO webhooks (event, target_url, secret_hash, active)
      VALUES (?, ?, ?, ?)
    `)
      .bind(event, targetUrl, secretHash, body.active === false ? 0 : 1)
      .run()
    return json({ success: true, message: 'Webhook creato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Webhooks richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile salvare webhook.' }, { status: 500 })
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request)
    const id = Number(body.id)
    const event = EVENTS.has(body.event) ? body.event : ''
    const targetUrl = String(body.target_url || '').trim()
    if (!id || !event || !/^https?:\/\//i.test(targetUrl)) return json({ success: false, message: 'Webhook non valido.' }, { status: 400 })
    const secretHash = body.secret ? await sha256Hex(String(body.secret)) : null
    const secretSql = secretHash ? ', secret_hash = ?' : ''
    const statement = `
      UPDATE webhooks
      SET event = ?, target_url = ?, active = ?, updated_at = CURRENT_TIMESTAMP${secretSql}
      WHERE id = ?
    `
    const params = secretHash
      ? [event, targetUrl, body.active === false ? 0 : 1, secretHash, id]
      : [event, targetUrl, body.active === false ? 0 : 1, id]
    await env.DB.prepare(statement).bind(...params).run()
    return json({ success: true, message: 'Webhook aggiornato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Webhooks richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile aggiornare webhook.' }, { status: 500 })
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const id = Number(new URL(request.url).searchParams.get('id'))
    if (!id) return json({ success: false, message: 'Webhook non valido.' }, { status: 400 })
    await env.DB.prepare('UPDATE webhooks SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(id).run()
    return json({ success: true, message: 'Webhook disattivato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Webhooks richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile disattivare webhook.' }, { status: 500 })
  }
}
