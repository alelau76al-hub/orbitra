const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  })

const FREQUENCIES = new Set(['weekly', 'monthly', 'yearly'])

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

function normalize(body = {}) {
  return {
    product_id: Number(body.product_id) || 0,
    frequency: FREQUENCIES.has(body.frequency) ? body.frequency : 'monthly',
    subscription_price_cents: cents(body.subscription_price || body.subscription_price_cents / 100),
    trial_days: Math.max(0, Math.round(Number(body.trial_days || 0))),
    active: body.active === false ? 0 : 1,
  }
}

export async function onRequestGet({ env, request }) {
  try {
    const productId = Number(new URL(request.url).searchParams.get('product_id') || 0)
    const params = []
    let where = '1 = 1'
    if (productId) {
      where = 's.product_id = ?'
      params.push(productId)
    }
    const rows = await env.DB.prepare(`
      SELECT
        s.*,
        p.name AS product_name,
        p.slug AS product_slug,
        p.price_cents AS product_price_cents
      FROM subscription_products s
      LEFT JOIN products p ON p.id = s.product_id
      WHERE ${where}
      ORDER BY s.updated_at DESC, s.id DESC
      LIMIT 250
    `)
      .bind(...params)
      .all()
    return json({ success: true, subscriptions: rows.results || [] })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, subscriptions: [], setup_required: true })
    return json({ success: false, message: 'Subscriptions non disponibili.' }, { status: 500 })
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const subscription = normalize(await readJson(request))
    if (!subscription.product_id) return json({ success: false, message: 'Prodotto obbligatorio.' }, { status: 400 })
    await env.DB.prepare(`
      INSERT INTO subscription_products (product_id, frequency, subscription_price_cents, trial_days, active)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(product_id) DO UPDATE SET
        frequency = excluded.frequency,
        subscription_price_cents = excluded.subscription_price_cents,
        trial_days = excluded.trial_days,
        active = excluded.active,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(
        subscription.product_id,
        subscription.frequency,
        subscription.subscription_price_cents,
        subscription.trial_days,
        subscription.active,
      )
      .run()
    return json({ success: true, message: 'Subscription product salvato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Subscriptions richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile salvare subscription.' }, { status: 500 })
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const id = Number(new URL(request.url).searchParams.get('id'))
    if (!id) return json({ success: false, message: 'Subscription non valida.' }, { status: 400 })
    await env.DB.prepare('UPDATE subscription_products SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(id).run()
    return json({ success: true, message: 'Subscription disattivata.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Subscriptions richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile disattivare subscription.' }, { status: 500 })
  }
}
