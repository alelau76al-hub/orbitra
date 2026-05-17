function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
    },
  })
}

function fallbackMarkets() {
  return [
    {
      handle: 'it',
      name: 'Italy / Italia',
      country_code: 'IT',
      language_code: 'it',
      currency_code: 'EUR',
      active: 1,
      is_default: 1,
      domain: '',
      path_prefix: '/it',
      notes: 'Recommended default market',
    },
    { handle: 'eu', name: 'Europe / Europa', country_code: 'EU', language_code: 'en', currency_code: 'EUR', active: 1, is_default: 0, domain: '', path_prefix: '/eu', notes: 'Recommended market' },
    { handle: 'us', name: 'United States', country_code: 'US', language_code: 'en', currency_code: 'USD', active: 1, is_default: 0, domain: '', path_prefix: '/us', notes: 'Recommended market' },
    { handle: 'uk', name: 'United Kingdom', country_code: 'GB', language_code: 'en', currency_code: 'GBP', active: 1, is_default: 0, domain: '', path_prefix: '/uk', notes: 'Recommended market' },
    { handle: 'ch', name: 'Switzerland', country_code: 'CH', language_code: 'de', currency_code: 'CHF', active: 1, is_default: 0, domain: '', path_prefix: '/ch', notes: 'Recommended market' },
    { handle: 'fr', name: 'France', country_code: 'FR', language_code: 'fr', currency_code: 'EUR', active: 1, is_default: 0, domain: '', path_prefix: '/fr', notes: 'Recommended market' },
    { handle: 'de', name: 'Germany', country_code: 'DE', language_code: 'de', currency_code: 'EUR', active: 1, is_default: 0, domain: '', path_prefix: '/de', notes: 'Recommended market' },
    { handle: 'es', name: 'Spain', country_code: 'ES', language_code: 'es', currency_code: 'EUR', active: 1, is_default: 0, domain: '', path_prefix: '/es', notes: 'Recommended market' },
    { handle: 'se', name: 'Sweden', country_code: 'SE', language_code: 'en', currency_code: 'SEK', active: 1, is_default: 0, domain: '', path_prefix: '/se', notes: 'Recommended market' },
    { handle: 'global', name: 'Global', country_code: 'GLOBAL', language_code: 'en', currency_code: 'EUR', active: 1, is_default: 0, domain: '', path_prefix: '/', notes: 'Recommended market' },
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

function mergeRecommendedRows(rows, recommendedRows, key) {
  if (!Array.isArray(rows) || !rows.length) return recommendedRows

  const existing = new Set(rows.map((item) => String(item[key] || '').toUpperCase()))
  const missingRecommendations = recommendedRows
    .filter((item) => !existing.has(String(item[key] || '').toUpperCase()))
    .map((item) => ({ ...item, recommended: true }))

  return [...rows, ...missingRecommendations]
}

async function safeAll(env, sql) {
  try {
    if (!env?.DB) return []
    const { results } = await env.DB.prepare(sql).all()
    return results || []
  } catch {
    return []
  }
}

async function loadMarkets(env) {
  const extendedRows = await safeAll(
    env,
    `
    SELECT handle, name, country_code, language_code, currency_code, active, is_default, domain, path_prefix, notes
    FROM markets
    WHERE active = 1
    ORDER BY is_default DESC, name ASC
    `,
  )

  if (extendedRows.length) return extendedRows

  const legacyRows = await safeAll(
    env,
    `
    SELECT handle, name, country_code, language_code, currency_code, active, is_default
    FROM markets
    WHERE active = 1
    ORDER BY is_default DESC, name ASC
    `,
  )

  return legacyRows.map((market) => ({
    ...market,
    domain: '',
    path_prefix: '',
    notes: '',
  }))
}

function fallbackResponse() {
  const markets = fallbackMarkets()
  const languages = recommendedLanguages()
  const currencies = recommendedCurrencies()

  return {
    success: true,
    markets,
    languages,
    currencies,
    default_market: markets[0],
    default_language: languages[0],
    default_currency: currencies[0],
    fallback: true,
  }
}

export async function onRequestGet({ env }) {
  try {
    const [marketRows, languageRows, currencyRows] = await Promise.all([
      loadMarkets(env),
      safeAll(
        env,
        `
        SELECT locale, name, native_name, active, is_default
        FROM market_languages
        WHERE active = 1
        ORDER BY is_default DESC, locale ASC
        `,
      ),
      safeAll(
        env,
        `
        SELECT code, name, symbol, active, is_default, manual_rate
        FROM market_currencies
        WHERE active = 1
        ORDER BY is_default DESC, code ASC
        `,
      ),
    ])

    const markets = marketRows.length ? marketRows : fallbackMarkets()
    const languages = mergeRecommendedRows(languageRows, recommendedLanguages(), 'locale')
    const currencies = mergeRecommendedRows(currencyRows, recommendedCurrencies(), 'code')

    return json({
      success: true,
      markets,
      languages,
      currencies,
      default_market: markets.find((market) => Number(market.is_default) === 1) || markets[0],
      default_language: languages.find((language) => Number(language.is_default) === 1) || languages[0],
      default_currency: currencies.find((currency) => Number(currency.is_default) === 1) || currencies[0],
      fallback: !marketRows.length,
    })
  } catch {
    return json(fallbackResponse())
  }
}
