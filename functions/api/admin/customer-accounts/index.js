function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function onRequestGet({ env }) {
  try {
    const rows = await env.DB.prepare(`
      SELECT account_status, COUNT(*) AS count
      FROM customers
      GROUP BY account_status
    `).all()
    return json({
      success: true,
      statuses: rows.results || [],
      provider_ready: true,
      note: 'Customer account login frontend non attivo: inviti e provider email sono predisposti.',
    })
  } catch {
    return json({
      success: true,
      statuses: [],
      setup_required: true,
      note: 'Customer Accounts richiede la migration Operations Suite.',
    })
  }
}
