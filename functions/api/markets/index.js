function json(data, status = 200) {
  return Response.json(data, { status })
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
    },
  ]
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT handle, name, country_code, language_code, currency_code, active, is_default
      FROM markets
      WHERE active = 1
      ORDER BY is_default DESC, name ASC
    `).all()

    const markets = results?.length ? results : fallbackMarkets()

    return json({
      success: true,
      markets,
      default_market: markets.find((market) => market.is_default) || markets[0],
    })
  } catch {
    const markets = fallbackMarkets()

    return json({
      success: true,
      markets,
      default_market: markets[0],
      fallback: true,
    })
  }
}
