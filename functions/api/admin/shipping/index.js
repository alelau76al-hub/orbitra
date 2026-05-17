function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function fallbackShippingMethods() {
  return [
    {
      id: 0,
      handle: 'standard',
      name: 'Spedizione standard',
      description: 'Metodo standard disponibile come fallback.',
      price_cents: 990,
      free_over_cents: null,
      active: 1,
      sort_order: 1,
      fallback: true,
    },
    {
      id: 0,
      handle: 'free_over_100',
      name: 'Spedizione gratuita',
      description: 'Disponibile sopra 100 euro di prodotti.',
      price_cents: 0,
      free_over_cents: 10000,
      active: 1,
      sort_order: 2,
      fallback: true,
    },
  ]
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function slugify(value = '') {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function centsFromValue(value) {
  const text = String(value ?? '').trim()
  if (!text) return 0
  return text.includes('.') || text.includes(',')
    ? Math.round(Number(text.replace(',', '.')) * 100)
    : Number(text)
}

function normalizeShippingMethod(body = {}) {
  const name = String(body.name || '').trim()
  const handle = slugify(body.handle || name)
  const priceCents = centsFromValue(body.price_cents ?? body.price)
  const freeOverRaw = body.free_over_cents ?? body.free_over
  const freeOverCents = String(freeOverRaw ?? '').trim() === '' ? null : centsFromValue(freeOverRaw)

  return {
    id: body.id ? Number(body.id) : null,
    handle,
    name,
    description: String(body.description || '').trim(),
    price_cents: Number.isFinite(priceCents) ? Math.max(0, priceCents) : 0,
    free_over_cents: Number.isFinite(freeOverCents) ? Math.max(0, freeOverCents) : null,
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
    sort_order: Number(body.sort_order || 0),
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'shipping_method', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

async function loadShippingMethods(env) {
  try {
    if (!env?.DB) return []
    const { results } = await env.DB.prepare(`
      SELECT id, handle, name, description, price_cents, free_over_cents, active, sort_order, created_at, updated_at
      FROM shipping_methods
      ORDER BY active DESC, sort_order ASC, id ASC
    `).all()

    return results || []
  } catch {
    return []
  }
}

export async function onRequestGet({ env }) {
  const methods = await loadShippingMethods(env)

  return json({
    success: true,
    methods: methods.length ? methods : fallbackShippingMethods(),
    fallback: methods.length === 0,
    capabilities: {
      country_or_market_rules: false,
      note: 'Configurazione base: zone, corrieri reali e regole per mercato richiedono uno schema dedicato.',
    },
  })
}

export async function onRequestPost({ request, env }) {
  try {
    const method = normalizeShippingMethod(await readBody(request))

    if (!method.name || !method.handle) {
      return json({ success: false, message: 'Nome e codice spedizione sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO shipping_methods (handle, name, description, price_cents, free_over_cents, active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        method.handle,
        method.name,
        method.description,
        method.price_cents,
        method.free_over_cents,
        method.active,
        method.sort_order,
      )
      .run()

    await logActivity(env, 'create', inserted.meta.last_row_id, `Metodo spedizione ${method.name} creato.`)
    return json({ success: true, message: 'Metodo spedizione creato.' })
  } catch {
    return json({ success: false, message: 'Salvataggio spedizione non riuscito. Verifica codice univoco e configurazione.' }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const method = normalizeShippingMethod(await readBody(request))

    if (!method.id || !method.name || !method.handle) {
      return json({ success: false, message: 'Dati spedizione non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE shipping_methods
      SET
        handle = ?,
        name = ?,
        description = ?,
        price_cents = ?,
        free_over_cents = ?,
        active = ?,
        sort_order = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        method.handle,
        method.name,
        method.description,
        method.price_cents,
        method.free_over_cents,
        method.active,
        method.sort_order,
        method.id,
      )
      .run()

    await logActivity(env, 'update', method.id, `Metodo spedizione ${method.name} aggiornato.`)
    return json({ success: true, message: 'Metodo spedizione aggiornato.' })
  } catch {
    return json({ success: false, message: 'Aggiornamento spedizione non riuscito.' }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID spedizione mancante.' }, 400)

    await env.DB.prepare('UPDATE shipping_methods SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, 'Metodo spedizione disattivato.')
    return json({ success: true, message: 'Metodo spedizione disattivato.' })
  } catch {
    return json({ success: false, message: 'Disattivazione spedizione non riuscita.' }, 500)
  }
}
