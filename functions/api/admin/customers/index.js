function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

async function hasCustomerAccountColumns(env) {
  try {
    await env.DB.prepare('SELECT account_status, tags, note, last_invite_at FROM customers LIMIT 1').first()
    return true
  } catch {
    return false
  }
}

async function logNotification(env, type, customerId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO notification_logs (type, status, description, metadata_json)
      VALUES (?, 'mocked', ?, ?)
    `)
      .bind(type, description, JSON.stringify({ customer_id: customerId, source: 'customer_accounts' }))
      .run()
  } catch {}
}

async function logActivity(env, action, customerId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'customer', ?, ?)
    `)
      .bind(action, String(customerId), description)
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    const hasAccounts = await hasCustomerAccountColumns(env)
    const accountFields = hasAccounts ? 'account_status, tags, note, last_invite_at,' : ''
    const customersResult = await env.DB.prepare(`
      SELECT
        id,
        email,
        name,
        phone,
        shipping_address_line1,
        shipping_address_city,
        shipping_address_postal_code,
        shipping_address_country,
        ${accountFields}
        created_at,
        updated_at
      FROM customers
      ORDER BY updated_at DESC, created_at DESC, id DESC
      LIMIT 150
    `).all()

    const ordersResult = await env.DB.prepare(`
      SELECT
        id,
        customer_id,
        email,
        total_cents,
        payment_status,
        order_status,
        created_at
      FROM orders
      ORDER BY created_at DESC, id DESC
      LIMIT 500
    `).all()

    const orders = ordersResult.results || []
    const customers = (customersResult.results || []).map((customer) => {
      const customerOrders = orders.filter(
        (order) => order.customer_id === customer.id || order.email === customer.email,
      )
      const lifetimeValueCents = customerOrders.reduce((sum, order) => sum + Number(order.total_cents || 0), 0)
      return {
        ...customer,
        account_status: customer.account_status || 'guest',
        tags: customer.tags || '',
        note: customer.note || '',
        lifetime_value_cents: lifetimeValueCents,
        orders_count: customerOrders.length,
        last_order_at: customerOrders[0]?.created_at || '',
        orders: customerOrders,
        accounts_ready: hasAccounts,
      }
    })

    return json({ success: true, customers, accounts_ready: hasAccounts })
  } catch {
    return json(
      {
        success: false,
        message: 'Errore caricamento clienti. Verifica che la migration checkout sia applicata.',
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)
    if (!id) return json({ success: false, message: 'Cliente non valido.' }, 400)

    const hasAccounts = await hasCustomerAccountColumns(env)
    if (!hasAccounts) {
      return json({ success: false, message: 'Customer Accounts richiede la migration 0016.' }, 503)
    }

    const action = String(body.action || 'update').trim()
    if (action === 'send_invite') {
      await env.DB.prepare(`
        UPDATE customers
        SET account_status = CASE WHEN account_status = 'active' THEN account_status ELSE 'invited' END,
            last_invite_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(id)
        .run()
      await logNotification(env, 'customer_invite', id, 'Customer invite mocked/logged. Provider required for real sending.')
      await logActivity(env, 'customer_invite', id, 'Customer account invite mocked/logged.')
      return json({ success: true, message: 'Invito cliente registrato in modalita mock/logging.' })
    }

    const allowedStatuses = new Set(['guest', 'invited', 'active', 'disabled'])
    const accountStatus = allowedStatuses.has(body.account_status) ? body.account_status : 'guest'
    await env.DB.prepare(`
      UPDATE customers
      SET account_status = ?, tags = ?, note = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        accountStatus,
        String(body.tags || '').trim(),
        String(body.note || '').trim(),
        id,
      )
      .run()
    await logActivity(env, 'customer_updated', id, 'Customer account metadata updated.')
    return json({ success: true, message: 'Cliente aggiornato.' })
  } catch {
    return json({ success: false, message: 'Errore aggiornamento cliente.' }, 500)
  }
}
