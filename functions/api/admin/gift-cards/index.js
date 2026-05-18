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

function normalizeCode(value = '') {
  return String(value).trim().toUpperCase().replace(/\s+/g, '-')
}

function normalizeStatus(value, active = true) {
  if (!active) return 'disabled'
  return STATUSES.has(value) ? value : 'active'
}

export async function onRequestGet({ env }) {
  try {
    const rows = await env.DB.prepare(`
      SELECT id, code, initial_balance_cents, balance_cents, customer_email, expires_at, note, status, active, created_at, updated_at
      FROM gift_cards
      ORDER BY created_at DESC, id DESC
      LIMIT 250
    `).all()

    return json({ success: true, gift_cards: rows.results || [] })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, gift_cards: [], setup_required: true })
    return json({ success: false, message: 'Gift cards non disponibili.' }, { status: 500 })
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request)
    const code = normalizeCode(body.code)
    const initialBalance = cents(body.initial_balance || body.initial_balance_cents / 100)

    if (!code) return json({ success: false, message: 'Codice gift card obbligatorio.' }, { status: 400 })
    if (initialBalance <= 0) return json({ success: false, message: 'Saldo iniziale obbligatorio.' }, { status: 400 })

    const existing = await env.DB.prepare('SELECT id FROM gift_cards WHERE code = ? LIMIT 1').bind(code).first()
    if (existing) return json({ success: false, message: 'Codice gift card gia esistente.' }, { status: 409 })

    const result = await env.DB.prepare(`
      INSERT INTO gift_cards (code, initial_balance_cents, balance_cents, customer_email, expires_at, note, status, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        code,
        initialBalance,
        cents(body.balance || body.balance_cents / 100) || initialBalance,
        String(body.customer_email || '').trim() || null,
        String(body.expires_at || '').trim() || null,
        String(body.note || '').trim() || null,
        normalizeStatus(body.status, body.active !== false),
        body.active === false ? 0 : 1,
      )
      .run()

    return json({ success: true, id: result.meta.last_row_id, message: 'Gift card creata.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Gift Cards richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile creare la gift card.' }, { status: 500 })
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request)
    const id = Number(body.id)
    if (!id) return json({ success: false, message: 'Gift card non valida.' }, { status: 400 })

    await env.DB.prepare(`
      UPDATE gift_cards
      SET customer_email = ?, expires_at = ?, note = ?, status = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        String(body.customer_email || '').trim() || null,
        String(body.expires_at || '').trim() || null,
        String(body.note || '').trim() || null,
        normalizeStatus(body.status, body.active !== false),
        body.active === false ? 0 : 1,
        id,
      )
      .run()

    return json({ success: true, message: 'Gift card aggiornata.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Gift Cards richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile aggiornare la gift card.' }, { status: 500 })
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const body = await readJson(request)
    const id = Number(new URL(request.url).searchParams.get('id') || body.id)
    if (!id) return json({ success: false, message: 'Gift card non valida.' }, { status: 400 })
    await env.DB.prepare("UPDATE gift_cards SET active = 0, status = 'disabled', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(id)
      .run()
    return json({ success: true, message: 'Gift card disattivata.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Gift Cards richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile disattivare la gift card.' }, { status: 500 })
  }
}
