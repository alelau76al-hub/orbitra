const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers || {}),
    },
  })

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || error || ''))
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase()
}

async function loadOrders(env, email) {
  try {
    const rows = await env.DB.prepare(`
      SELECT id, email, total_cents, payment_status, order_status, shipping_method, created_at
      FROM orders
      WHERE LOWER(email) = LOWER(?)
      ORDER BY created_at DESC, id DESC
      LIMIT 50
    `)
      .bind(email)
      .all()
    return rows.results || []
  } catch {
    return []
  }
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url)
    const email = normalizeEmail(url.searchParams.get('email') || '')
    if (!email) {
      return json({ success: false, message: 'Inserisci email cliente per consultare l account.' }, { status: 400 })
    }

    const customer = await env.DB.prepare(`
      SELECT id, email, name, phone, shipping_address_line1, shipping_address_city,
             shipping_address_postal_code, shipping_address_country,
             COALESCE(account_status, 'guest') AS account_status
      FROM customers
      WHERE LOWER(email) = LOWER(?)
      LIMIT 1
    `)
      .bind(email)
      .first()

    if (!customer) {
      return json({ success: true, found: false, customer: null, orders: [], message: 'Nessun account cliente trovato per questa email.' })
    }

    const orders = await loadOrders(env, email)
    return json({
      success: true,
      found: true,
      customer,
      orders,
      message: orders.length ? '' : 'Nessun ordine collegato a questa email.',
    })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, found: false, customer: null, orders: [], setup_required: true })
    return json({ success: false, message: 'Account cliente non disponibile.' }, { status: 500 })
  }
}
