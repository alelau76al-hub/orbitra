const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  })

const STATUSES = new Set(['active', 'used', 'expired', 'disabled'])

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

function cents(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 0
  return Math.max(0, Math.round(amount * 100))
}

async function logCreditEvent(env, creditId, eventType, amountCents, note = '') {
  try {
    await env.DB.prepare(`
      INSERT INTO store_credit_events (store_credit_id, event_type, amount_cents, note)
      VALUES (?, ?, ?, ?)
    `)
      .bind(creditId, eventType, amountCents, note)
      .run()
  } catch {}
}

export async function onRequestGet({ env, request }) {
  try {
    const email = new URL(request.url).searchParams.get('email')
    const params = []
    let where = '1 = 1'
    if (email) {
      where = 'customer_email = ?'
      params.push(email)
    }

    const rows = await env.DB.prepare(`
      SELECT id, customer_id, customer_email, amount_cents, remaining_amount_cents, note, status, active, created_at, updated_at
      FROM store_credits
      WHERE ${where}
      ORDER BY created_at DESC, id DESC
      LIMIT 250
    `)
      .bind(...params)
      .all()

    return json({ success: true, store_credits: rows.results || [] })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, store_credits: [], setup_required: true })
    return json({ success: false, message: 'Store credit non disponibile.' }, { status: 500 })
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request)
    const amountCents = cents(body.amount || body.amount_cents / 100)
    const email = String(body.customer_email || '').trim()
    const customerId = Number(body.customer_id) || null
    if (!email && !customerId) return json({ success: false, message: 'Cliente o email obbligatori.' }, { status: 400 })
    if (amountCents <= 0) return json({ success: false, message: 'Importo credito obbligatorio.' }, { status: 400 })

    const result = await env.DB.prepare(`
      INSERT INTO store_credits (customer_id, customer_email, amount_cents, remaining_amount_cents, note, status, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        customerId,
        email || null,
        amountCents,
        cents(body.remaining_amount || body.remaining_amount_cents / 100) || amountCents,
        String(body.note || '').trim() || null,
        STATUSES.has(body.status) ? body.status : 'active',
        body.active === false ? 0 : 1,
      )
      .run()

    await logCreditEvent(env, result.meta.last_row_id, 'created', amountCents, 'Store credit created.')
    return json({ success: true, id: result.meta.last_row_id, message: 'Store credit creato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Store Credit richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile creare store credit.' }, { status: 500 })
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request)
    const id = Number(body.id)
    const amount = cents(body.amount || body.amount_cents / 100)
    if (!id) return json({ success: false, message: 'Store credit non valido.' }, { status: 400 })

    await env.DB.prepare(`
      UPDATE store_credits
      SET customer_email = ?, amount_cents = ?, remaining_amount_cents = ?, note = ?, status = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        String(body.customer_email || '').trim() || null,
        amount,
        amount,
        String(body.note || '').trim() || null,
        STATUSES.has(body.status) ? body.status : 'active',
        body.active === false ? 0 : 1,
        id,
      )
      .run()

    await logCreditEvent(env, id, 'updated', 0, 'Store credit updated.')
    return json({ success: true, message: 'Store credit aggiornato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Store Credit richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile aggiornare store credit.' }, { status: 500 })
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const body = await readJson(request)
    const id = Number(new URL(request.url).searchParams.get('id') || body.id)
    if (!id) return json({ success: false, message: 'Store credit non valido.' }, { status: 400 })
    await env.DB.prepare("UPDATE store_credits SET active = 0, status = 'disabled', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(id)
      .run()
    await logCreditEvent(env, id, 'disabled', 0, 'Store credit disabled.')
    return json({ success: true, message: 'Store credit disattivato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Store Credit richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile disattivare store credit.' }, { status: 500 })
  }
}
