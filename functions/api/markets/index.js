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
      handle: 'it-eur',
      name: 'Italia / EUR',
      country_code: 'IT',
      language_code: 'it',
      currency_code: 'EUR',
      active: 1,
      is_default: 1,
      domain: '',
      path_prefix: '',
      notes: '',
    },
  ]
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
      SELECT handle, name, country_code, language_code, currency_code, active, is_default, domain, path_prefix, notes
      FROM markets
      WHERE active = 1
      ORDER BY is_default DESC, name ASC
    `).all()

    return results || []
  } catch {
    const { results } = await env.DB.prepare(`
      SELECT handle, name, country_code, language_code, currency_code, active, is_default
      FROM markets
      WHERE active = 1
      ORDER BY is_default DESC, name ASC
    `).all()

    return (results || []).map((market) => ({
      ...market,
      domain: '',
      path_prefix: '',
      notes: '',
    }))
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
    const languages = languageRows.length ? languageRows : fallbackLanguages()
    const currencies = currencyRows.length ? currencyRows : fallbackCurrencies()

    return json({
      success: true,
      markets,
      languages,
      currencies,
      default_market: markets.find((market) => market.is_default) || markets[0],
      default_language: languages.find((language) => language.is_default) || languages[0],
      default_currency: currencies.find((currency) => currency.is_default) || currencies[0],
    })
  } catch {
    const markets = fallbackMarkets()
    const languages = fallbackLanguages()
    const currencies = fallbackCurrencies()

    return json({
      success: true,
      markets,
      languages,
      currencies,
      default_market: markets[0],
      default_language: languages[0],
      default_currency: currencies[0],
      fallback: true,
    })
  }
}
