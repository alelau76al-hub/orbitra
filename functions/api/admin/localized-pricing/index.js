function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeCurrency(value = 'EUR') {
  const currency = String(value || 'EUR').trim().toUpperCase()
  return /^[A-Z]{3}$/.test(currency) ? currency : 'EUR'
}

function normalizePrice(body = {}) {
  const priceValue = body.price_cents ?? body.price
  const text = String(priceValue ?? '').trim()
  const priceCents = text.includes('.') || text.includes(',')
    ? Math.round(Number(text.replace(',', '.')) * 100)
    : Number(text || 0)

  return {
    id: body.id ? Number(body.id) : null,
    product_id: Number(body.product_id || 0),
    variant_id: Number(body.variant_id || 0),
    market_handle: String(body.market_handle || '').trim(),
    currency_code: normalizeCurrency(body.currency_code),
    price_cents: priceCents,
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
  }
}

async function loadProducts(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, slug, name, price_cents, active
      FROM products
      WHERE active = 1
      ORDER BY name ASC
    `).all()

    return results || []
  } catch {
    return []
  }
}

async function loadVariants(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, product_id, option_name, option_value, price_cents, active
      FROM product_variants
      WHERE active = 1
      ORDER BY product_id ASC, sort_order ASC, id ASC
    `).all()

    return results || []
  } catch {
    return []
  }
}

async function loadMarkets(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT handle, name, currency_code, active, is_default
      FROM markets
      WHERE active = 1
      ORDER BY is_default DESC, name ASC
    `).all()

    return results || []
  } catch {
    return [
      {
        handle: 'it-eur',
        name: 'Italia / EUR',
        currency_code: 'EUR',
        active: 1,
        is_default: 1,
      },
    ]
  }
}

async function loadPrices(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        localized_prices.id,
        localized_prices.product_id,
        localized_prices.variant_id,
        localized_prices.market_handle,
        localized_prices.currency_code,
        localized_prices.price_cents,
        localized_prices.active,
        localized_prices.updated_at,
        products.name AS product_name,
        products.slug AS product_slug,
        product_variants.option_name AS variant_option_name,
        product_variants.option_value AS variant_option_value
      FROM localized_prices
      LEFT JOIN products ON products.id = localized_prices.product_id
      LEFT JOIN product_variants ON product_variants.id = localized_prices.variant_id
      ORDER BY localized_prices.active DESC, products.name ASC, localized_prices.market_handle ASC
    `).all()

    return results || []
  } catch {
    return []
  }
}

async function logActivity(env, action, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, description)
      VALUES (?, 'localized_price', ?)
    `)
      .bind(action, description)
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    const [products, variants, markets, prices] = await Promise.all([
      loadProducts(env),
      loadVariants(env),
      loadMarkets(env),
      loadPrices(env),
    ])

    return json({
      success: true,
      products,
      variants,
      markets,
      prices,
      migration_ready: true,
    })
  } catch {
    return json({ success: false, message: 'Errore caricamento prezzi localizzati.' }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const price = normalizePrice(await readBody(request))

    if (!price.product_id || !price.market_handle || !price.currency_code) {
      return json({ success: false, message: 'Prodotto, mercato e valuta sono obbligatori.' }, 400)
    }

    if (!Number.isFinite(price.price_cents) || price.price_cents <= 0) {
      return json({ success: false, message: 'Prezzo localizzato non valido.' }, 400)
    }

    await env.DB.prepare(`
      INSERT INTO localized_prices (
        product_id,
        variant_id,
        market_handle,
        currency_code,
        price_cents,
        active,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(product_id, variant_id, market_handle, currency_code)
      DO UPDATE SET
        price_cents = excluded.price_cents,
        active = excluded.active,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(
        price.product_id,
        price.variant_id,
        price.market_handle,
        price.currency_code,
        price.price_cents,
        price.active,
      )
      .run()

    await logActivity(
      env,
      'upsert',
      `Prezzo localizzato salvato per prodotto ${price.product_id} / ${price.market_handle} ${price.currency_code}.`,
    )

    return json({ success: true, message: 'Prezzo localizzato salvato.' })
  } catch {
    return json(
      {
        success: false,
        message: 'Prezzi localizzati non disponibili. Applica la migration 0014 e riprova.',
      },
      500,
    )
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID prezzo localizzato mancante.' }, 400)

    await env.DB.prepare(`
      UPDATE localized_prices
      SET active = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    await logActivity(env, 'disable', `Prezzo localizzato ${id} disattivato.`)

    return json({ success: true, message: 'Prezzo localizzato disattivato.' })
  } catch {
    return json({ success: false, message: 'Errore disattivazione prezzo localizzato.' }, 500)
  }
}
