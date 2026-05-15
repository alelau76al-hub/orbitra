function json(data, status = 200) {
  return Response.json(data, { status })
}

function normalizeCode(value = '') {
  return String(value).trim().toUpperCase()
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeDiscount(body = {}) {
  const type = body.type === 'fixed' ? 'fixed' : 'percentage'
  const value = Number(body.value)
  const minSubtotalCents = Math.max(0, Number(body.min_subtotal_cents || 0))

  return {
    id: body.id ? Number(body.id) : null,
    code: normalizeCode(body.code),
    description: String(body.description || '').trim(),
    type,
    value: Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0,
    starts_at: String(body.starts_at || '').trim() || null,
    ends_at: String(body.ends_at || '').trim() || null,
    min_subtotal_cents: Number.isFinite(minSubtotalCents) ? Math.round(minSubtotalCents) : 0,
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
  }
}

function validateDiscount(discount) {
  if (!discount.code) return 'Il codice sconto e obbligatorio.'
  if (!discount.value) return 'Il valore dello sconto deve essere maggiore di zero.'
  if (discount.type === 'percentage' && discount.value > 100) {
    return 'La percentuale non puo superare 100.'
  }
  return ''
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        code,
        description,
        type,
        value,
        starts_at,
        ends_at,
        min_subtotal_cents,
        active,
        created_at,
        updated_at
      FROM discount_codes
      ORDER BY active DESC, created_at DESC, id DESC
    `).all()

    return json({
      success: true,
      discounts: results || [],
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento sconti. Verifica che la migration 0008 sia applicata.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const discount = normalizeDiscount(await readBody(request))
    const validationMessage = validateDiscount(discount)

    if (validationMessage) {
      return json({ success: false, message: validationMessage }, 400)
    }

    await env.DB.prepare(`
      INSERT INTO discount_codes (
        code,
        description,
        type,
        value,
        starts_at,
        ends_at,
        min_subtotal_cents,
        active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        discount.code,
        discount.description,
        discount.type,
        discount.value,
        discount.starts_at,
        discount.ends_at,
        discount.min_subtotal_cents,
        discount.active,
      )
      .run()

    return json({
      success: true,
      message: 'Sconto creato.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore creazione sconto.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const discount = normalizeDiscount(await readBody(request))
    const validationMessage = validateDiscount(discount)

    if (!discount.id || validationMessage) {
      return json(
        {
          success: false,
          message: validationMessage || 'ID sconto mancante.',
        },
        400,
      )
    }

    await env.DB.prepare(`
      UPDATE discount_codes
      SET
        code = ?,
        description = ?,
        type = ?,
        value = ?,
        starts_at = ?,
        ends_at = ?,
        min_subtotal_cents = ?,
        active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        discount.code,
        discount.description,
        discount.type,
        discount.value,
        discount.starts_at,
        discount.ends_at,
        discount.min_subtotal_cents,
        discount.active,
        discount.id,
      )
      .run()

    return json({
      success: true,
      message: 'Sconto aggiornato.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore aggiornamento sconto.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) {
      return json({ success: false, message: 'ID sconto mancante.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE discount_codes
      SET active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    return json({
      success: true,
      message: 'Sconto disattivato.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore disattivazione sconto.',
        error: error.message,
      },
      500,
    )
  }
}
