function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

async function countRows(env, sql) {
  try {
    const row = await env.DB.prepare(sql).first()
    return Number(row?.count || 0)
  } catch {
    return 0
  }
}

export async function onRequestGet({ env }) {
  try {
    const pendingOrders = await countRows(env, "SELECT COUNT(*) AS count FROM orders WHERE COALESCE(order_status, status, 'pending') IN ('pending', 'new')")
    const unfulfilled = await countRows(env, "SELECT COUNT(*) AS count FROM orders WHERE COALESCE(fulfillment_status, 'unfulfilled') != 'fulfilled'")
    const refundQueue = await countRows(env, "SELECT COUNT(*) AS count FROM orders WHERE COALESCE(refund_status, 'none') IN ('requested')")
    const returnQueue = await countRows(env, "SELECT COUNT(*) AS count FROM return_requests WHERE active = 1 AND status IN ('requested', 'approved', 'received')")
    const customers = await countRows(env, 'SELECT COUNT(*) AS count FROM customers')
    const notifications = await countRows(env, 'SELECT COUNT(*) AS count FROM notification_logs')

    return json({
      success: true,
      summary: {
        pending_orders: pendingOrders,
        unfulfilled_orders: unfulfilled,
        refund_queue: refundQueue,
        return_queue: returnQueue,
        customers,
        notification_logs: notifications,
      },
    })
  } catch {
    return json({ success: false, message: 'Operations overview non disponibile.' }, 500)
  }
}
