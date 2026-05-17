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

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeDomain(value = '') {
  return String(value || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')
}

function normalizePathPrefix(value = '') {
  const path = String(value || '').trim()
  if (!path) return ''
  return `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`
}

function normalizeMarket(body = {}) {
  const name = String(body.name || '').trim()

  return {
    id: body.id ? Number(body.id) : null,
    handle: slugify(body.handle || name),
    name,
    country_code: String(body.country_code || 'IT').trim().toUpperCase().slice(0, 12),
    language_code: String(body.language_code || 'it').trim().toLowerCase().slice(0, 5),
    currency_code: String(body.currency_code || 'EUR').trim().toUpperCase().slice(0, 3),
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
    is_default: body.is_default === true || String(body.is_default) === '1' ? 1 : 0,
    domain: normalizeDomain(body.domain),
    path_prefix: normalizePathPrefix(body.path_prefix),
    notes: String(body.notes || '').trim(),
  }
}

function fallbackLanguages() {
  return [
    { locale: 'it', name: 'Italiano', native_name: 'Italiano', active: 1, is_default: 1 },
    { locale: 'en', name: 'Inglese', native_name: 'English', active: 1, is_default: 0 },
    { locale: 'fr', name: 'Francese', native_name: 'Français', active: 1, is_default: 0 },
    { locale: 'es', name: 'Spagnolo', native_name: 'Español', active: 1, is_default: 0 },
    { locale: 'de', name: 'Tedesco', native_name: 'Deutsch', active: 1, is_default: 0 },
  ]
}

function fallbackCurrencies() {
  return [
    { code: 'EUR', name: 'Euro', symbol: '€', active: 1, is_default: 1, manual_rate: 1 },
    { code: 'USD', name: 'US Dollar', symbol: '$', active: 1, is_default: 0, manual_rate: 1 },
    { code: 'GBP', name: 'British Pound', symbol: '£', active: 1, is_default: 0, manual_rate: 1 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', active: 1, is_default: 0, manual_rate: 1 },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', active: 1, is_default: 0, manual_rate: 1 },
  ]
}

function fallbackCountries() {
  return [
    { country_code: 'IT', name: 'Italia', market_handle: 'it-eur', active: 1 },
    { country_code: 'US', name: 'Stati Uniti', market_handle: '', active: 1 },
    { country_code: 'GB', name: 'Regno Unito', market_handle: '', active: 1 },
    { country_code: 'CH', name: 'Svizzera', market_handle: '', active: 1 },
    { country_code: 'SE', name: 'Svezia', market_handle: '', active: 1 },
    { country_code: 'FR', name: 'Francia', market_handle: '', active: 1 },
    { country_code: 'ES', name: 'Spagna', market_handle: '', active: 1 },
    { country_code: 'DE', name: 'Germania', market_handle: '', active: 1 },
  ]
}

function recommendedLanguages() {
  return [
    { locale: 'it', name: 'Italiano', native_name: 'Italiano', active: 1, is_default: 1 },
    { locale: 'en', name: 'Inglese', native_name: 'English', active: 1, is_default: 0 },
    { locale: 'fr', name: 'Francese', native_name: 'Francais', active: 1, is_default: 0 },
    { locale: 'es', name: 'Spagnolo', native_name: 'Espanol', active: 1, is_default: 0 },
    { locale: 'de', name: 'Tedesco', native_name: 'Deutsch', active: 1, is_default: 0 },
  ]
}

function recommendedCurrencies() {
  return [
    { code: 'EUR', name: 'Euro', symbol: 'EUR', active: 1, is_default: 1, manual_rate: 1 },
    { code: 'USD', name: 'US Dollar', symbol: '$', active: 1, is_default: 0, manual_rate: 1 },
    { code: 'GBP', name: 'British Pound', symbol: 'GBP', active: 1, is_default: 0, manual_rate: 1 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', active: 1, is_default: 0, manual_rate: 1 },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', active: 1, is_default: 0, manual_rate: 1 },
  ]
}

function recommendedCountries() {
  return [
    { country_code: 'IT', name: 'Italia', market_handle: 'it', active: 1 },
    { country_code: 'EU', name: 'Europa', market_handle: 'eu', active: 1 },
    { country_code: 'US', name: 'Stati Uniti', market_handle: 'us', active: 1 },
    { country_code: 'GB', name: 'Regno Unito', market_handle: 'uk', active: 1 },
    { country_code: 'CH', name: 'Svizzera', market_handle: 'ch', active: 1 },
    { country_code: 'FR', name: 'Francia', market_handle: 'fr', active: 1 },
    { country_code: 'DE', name: 'Germania', market_handle: 'de', active: 1 },
    { country_code: 'ES', name: 'Spagna', market_handle: 'es', active: 1 },
    { country_code: 'SE', name: 'Svezia', market_handle: 'se', active: 1 },
    { country_code: 'GLOBAL', name: 'Global', market_handle: 'global', active: 1 },
  ]
}

function mergeRecommendedRows(rows, recommendedRows, key) {
  if (!rows.length) return recommendedRows

  const existing = new Set(rows.map((item) => String(item[key] || '').toUpperCase()))
  const missingRecommendations = recommendedRows
    .filter((item) => !existing.has(String(item[key] || '').toUpperCase()))
    .map((item) => ({ ...item, recommended: true }))

  return [...rows, ...missingRecommendations]
}

async function safeAll(env, sql) {
  try {
    const { results } = await env.DB.prepare(sql).all()
    return results || []
  } catch {
    return []
  }
}

async function loadMarkets(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        handle,
        name,
        country_code,
        language_code,
        currency_code,
        active,
        is_default,
        domain,
        path_prefix,
        notes,
        created_at,
        updated_at
      FROM markets
      ORDER BY is_default DESC, active DESC, name ASC
    `).all()

    return results || []
  } catch {
    const { results } = await env.DB.prepare(`
      SELECT id, handle, name, country_code, language_code, currency_code, active, is_default, created_at, updated_at
      FROM markets
      ORDER BY is_default DESC, active DESC, name ASC
    `).all()

    return (results || []).map((market) => ({
      ...market,
      domain: '',
      path_prefix: '',
      notes: '',
    }))
  }
}

async function loadLanguages(env) {
  const rows = await safeAll(
    env,
    `
    SELECT locale, name, native_name, active, is_default, updated_at
    FROM market_languages
    ORDER BY is_default DESC, active DESC, locale ASC
    `,
  )

  return mergeRecommendedRows(rows, recommendedLanguages(), 'locale')
}

async function loadCurrencies(env) {
  const rows = await safeAll(
    env,
    `
    SELECT code, name, symbol, active, is_default, manual_rate, updated_at
    FROM market_currencies
    ORDER BY is_default DESC, active DESC, code ASC
    `,
  )

  return mergeRecommendedRows(rows, recommendedCurrencies(), 'code')
}

async function loadCountries(env) {
  const rows = await safeAll(
    env,
    `
    SELECT country_code, name, market_handle, active, updated_at
    FROM market_countries
    ORDER BY active DESC, country_code ASC
    `,
  )

  return mergeRecommendedRows(rows, recommendedCountries(), 'country_code')
}

async function findMarketByHandle(env, handle, excludedId = null) {
  try {
    const statement = excludedId
      ? env.DB.prepare('SELECT id FROM markets WHERE handle = ? AND id != ? LIMIT 1').bind(handle, excludedId)
      : env.DB.prepare('SELECT id FROM markets WHERE handle = ? LIMIT 1').bind(handle)

    return await statement.first()
  } catch {
    return null
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'market', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

async function ensureSingleDefault(env, id) {
  if (!id) return

  await env.DB.prepare(`
    UPDATE markets
    SET is_default = CASE WHEN id = ? THEN 1 ELSE 0 END,
        updated_at = CURRENT_TIMESTAMP
  `)
    .bind(id)
    .run()
}

async function insertMarket(env, market) {
  try {
    return await env.DB.prepare(`
      INSERT INTO markets (
        handle,
        name,
        country_code,
        language_code,
        currency_code,
        active,
        is_default,
        domain,
        path_prefix,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        market.handle,
        market.name,
        market.country_code,
        market.language_code,
        market.currency_code,
        market.active,
        market.is_default,
        market.domain,
        market.path_prefix,
        market.notes,
      )
      .run()
  } catch {
    return env.DB.prepare(`
      INSERT INTO markets (handle, name, country_code, language_code, currency_code, active, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        market.handle,
        market.name,
        market.country_code,
        market.language_code,
        market.currency_code,
        market.active,
        market.is_default,
      )
      .run()
  }
}

async function updateMarket(env, market) {
  try {
    return await env.DB.prepare(`
      UPDATE markets
      SET
        handle = ?,
        name = ?,
        country_code = ?,
        language_code = ?,
        currency_code = ?,
        active = ?,
        is_default = ?,
        domain = ?,
        path_prefix = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        market.handle,
        market.name,
        market.country_code,
        market.language_code,
        market.currency_code,
        market.active,
        market.is_default,
        market.domain,
        market.path_prefix,
        market.notes,
        market.id,
      )
      .run()
  } catch {
    return env.DB.prepare(`
      UPDATE markets
      SET
        handle = ?,
        name = ?,
        country_code = ?,
        language_code = ?,
        currency_code = ?,
        active = ?,
        is_default = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        market.handle,
        market.name,
        market.country_code,
        market.language_code,
        market.currency_code,
        market.active,
        market.is_default,
        market.id,
      )
      .run()
  }
}

export async function onRequestGet({ env }) {
  try {
    const [markets, languages, currencies, countries] = await Promise.all([
      loadMarkets(env),
      loadLanguages(env),
      loadCurrencies(env),
      loadCountries(env),
    ])

    return json({
      success: true,
      markets,
      languages,
      currencies,
      countries,
      default_market: markets.find((market) => market.is_default) || markets[0] || null,
      default_language: languages.find((language) => language.is_default) || languages[0] || null,
      default_currency: currencies.find((currency) => currency.is_default) || currencies[0] || null,
    })
  } catch {
    return json({ success: false, message: 'Errore caricamento Markets.' }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const market = normalizeMarket(await readBody(request))

    if (!market.name || !market.handle) {
      return json({ success: false, message: 'Nome e handle mercato sono obbligatori.' }, 400)
    }

    const existing = await findMarketByHandle(env, market.handle)
    if (existing) {
      return json({ success: false, message: 'Esiste gia un mercato con questo handle.' }, 409)
    }

    const inserted = await insertMarket(env, market)

    if (market.is_default) await ensureSingleDefault(env, inserted.meta.last_row_id)
    await logActivity(env, 'create', inserted.meta.last_row_id, `Mercato ${market.name} creato.`)

    return json({ success: true, message: 'Mercato creato.' })
  } catch {
    return json({ success: false, message: 'Errore creazione mercato.' }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const market = normalizeMarket(await readBody(request))

    if (!market.id || !market.name || !market.handle) {
      return json({ success: false, message: 'Dati mercato non validi.' }, 400)
    }

    const existing = await findMarketByHandle(env, market.handle, market.id)
    if (existing) {
      return json({ success: false, message: 'Esiste gia un altro mercato con questo handle.' }, 409)
    }

    await updateMarket(env, market)

    if (market.is_default) await ensureSingleDefault(env, market.id)
    await logActivity(env, 'update', market.id, `Mercato ${market.name} aggiornato.`)

    return json({ success: true, message: 'Mercato aggiornato.' })
  } catch {
    return json({ success: false, message: 'Errore aggiornamento mercato.' }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID mercato mancante.' }, 400)

    await env.DB.prepare('UPDATE markets SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, 'Mercato disattivato.')

    return json({ success: true, message: 'Mercato disattivato.' })
  } catch {
    return json({ success: false, message: 'Errore disattivazione mercato.' }, 500)
  }
}
