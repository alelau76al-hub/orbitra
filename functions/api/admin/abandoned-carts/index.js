const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  })

const STATUSES = new Set(['open', 'recovered', 'expired'])

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

function safeJson(value, fallback = []) {
  try {
    return JSON.parse(value || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

async function logRecovery(env, cartId, email) {
  try {
    await env.DB.prepare(`
      INSERT INTO notification_logs (type, status, description, metadata_json)
      VALUES ('abandoned_cart', 'mocked', ?, ?)
    `)
      .bind('Abandoned cart recovery mocked/logged. Provider required for real sending.', JSON.stringify({ cart_id: cartId, email }))
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    const rows = await env.DB.prepare(`
      SELECT id, session_id, email, items_json, total_cents, status, last_activity_at, recovered_order_id, created_at, updated_at
      FROM abandoned_carts
      ORDER BY last_activity_at DESC, id DESC
      LIMIT 250
    `).all()

    const carts = (rows.results || []).map((cart) => ({
      ...cart,
      items: safeJson(cart.items_json),
    }))
    return json({ success: true, carts })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, carts: [], setup_required: true })
    return json({ success: false, message: 'Abandoned carts non disponibili.' }, { status: 500 })
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request)
    if (body.action === 'send_recovery') {
      const id = Number(body.id)
      if (!id) return json({ success: false, message: 'Carrello non valido.' }, { status: 400 })
      const cart = await env.DB.prepare('SELECT id, email FROM abandoned_carts WHERE id = ?').bind(id).first()
      if (!cart?.email) return json({ success: false, message: 'Email cliente non disponibile per recovery.' }, { status: 400 })
      await logRecovery(env, id, cart.email)
      return json({ success: true, message: 'Recovery email registrata in modalita mock/logging.' })
    }

    const sessionId = String(body.session_id || '').trim() || `manual-${Date.now()}`
    const itemsJson = JSON.stringify(Array.isArray(body.items) ? body.items : [])
    const totalCents = Math.max(0, Math.round(Number(body.total_cents || 0)))
    const status = STATUSES.has(body.status) ? body.status : 'open'

    await env.DB.prepare(`
      INSERT INTO abandoned_carts (session_id, email, items_json, total_cents, status, last_activity_at, recovered_order_id)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
      ON CONFLICT(session_id) DO UPDATE SET
        email = excluded.email,
        items_json = excluded.items_json,
        total_cents = excluded.total_cents,
        status = excluded.status,
        last_activity_at = CURRENT_TIMESTAMP,
        recovered_order_id = excluded.recovered_order_id,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(sessionId, String(body.email || '').trim() || null, itemsJson, totalCents, status, Number(body.recovered_order_id) || null)
      .run()

    return json({ success: true, message: 'Abandoned cart salvato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Abandoned Cart richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile salvare abandoned cart.' }, { status: 500 })
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request)
    const id = Number(body.id)
    if (!id) return json({ success: false, message: 'Carrello non valido.' }, { status: 400 })
    const status = STATUSES.has(body.status) ? body.status : 'open'
    await env.DB.prepare('UPDATE abandoned_carts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(status, id)
      .run()
    return json({ success: true, message: 'Abandoned cart aggiornato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Abandoned Cart richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile aggiornare abandoned cart.' }, { status: 500 })
  }
}
