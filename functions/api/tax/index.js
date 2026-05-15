function json(data, status = 200) {
  return Response.json(data, { status })
}

function parseTaxSettings(rows = []) {
  const map = rows.reduce((settings, row) => {
    settings[row.key] = row.value
    return settings
  }, {})

  const vatRate = Number(map.vat_rate)

  return {
    vat_rate: Number.isFinite(vatRate) && vatRate >= 0 ? vatRate : 22,
    prices_include_tax: String(map.prices_include_tax ?? '1') !== '0',
  }
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT key, value
      FROM tax_settings
    `).all()

    return json({
      success: true,
      settings: parseTaxSettings(results || []),
    })
  } catch {
    return json({
      success: true,
      settings: {
        vat_rate: 22,
        prices_include_tax: true,
      },
      fallback: true,
    })
  }
}
