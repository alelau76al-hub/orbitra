function json(data, status = 200) {
  return Response.json(data, { status })
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function parseSettings(rows = []) {
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
      settings: parseSettings(results || []),
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento IVA. Verifica che la migration 0008 sia applicata.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const vatRate = Number(body.vat_rate)
    const pricesIncludeTax = body.prices_include_tax === false ? '0' : '1'

    if (!Number.isFinite(vatRate) || vatRate < 0) {
      return json({ success: false, message: 'Aliquota IVA non valida.' }, 400)
    }

    await env.DB.prepare(`
      INSERT INTO tax_settings (key, value, type, label, updated_at)
      VALUES ('vat_rate', ?, 'number', 'Aliquota IVA base', CURRENT_TIMESTAMP)
      ON CONFLICT(key)
      DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `)
      .bind(String(vatRate))
      .run()

    await env.DB.prepare(`
      INSERT INTO tax_settings (key, value, type, label, updated_at)
      VALUES ('prices_include_tax', ?, 'boolean', 'Prezzi IVA inclusa', CURRENT_TIMESTAMP)
      ON CONFLICT(key)
      DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `)
      .bind(pricesIncludeTax)
      .run()

    return json({
      success: true,
      message: 'Impostazioni IVA salvate.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore salvataggio IVA.',
        error: error.message,
      },
      500,
    )
  }
}
