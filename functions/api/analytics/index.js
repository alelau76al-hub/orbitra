function json(data, status = 200) {
  return Response.json(data, { status })
}

const allowedEvents = new Set([
  'page_view',
  'product_view',
  'add_to_cart',
  'checkout_start',
  'order_created',
])

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function sanitizePath(value = '') {
  const path = String(value || '').trim()
  if (!path.startsWith('/')) return '/'
  return path.slice(0, 250)
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)
    const eventType = String(body.event_type || '').trim()

    if (!allowedEvents.has(eventType)) {
      return json({ success: false, message: 'Evento analytics non valido.' }, 400)
    }

    const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : {}

    await env.DB.prepare(`
      INSERT INTO analytics_events (
        event_type,
        path,
        entity_type,
        entity_id,
        session_id,
        metadata_json
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `)
      .bind(
        eventType,
        sanitizePath(body.path),
        String(body.entity_type || '').trim().slice(0, 60),
        String(body.entity_id || '').trim().slice(0, 80),
        String(body.session_id || '').trim().slice(0, 80),
        JSON.stringify(metadata),
      )
      .run()

    return json({ success: true })
  } catch {
    return json({ success: true, fallback: true })
  }
}
