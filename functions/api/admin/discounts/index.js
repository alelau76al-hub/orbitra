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

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || ''))
}

async function hasAdvancedColumns(env) {
  try {
    const { results } = await env.DB.prepare('PRAGMA table_info(discount_codes)').all()
    const columns = new Set((results || []).map((column) => column.name))
    return columns.has('discount_kind') && columns.has('usage_limit') && columns.has('usage_count')
  } catch {
    return false
  }
}

function normalizeDiscount(body = {}) {
  const type = body.type === 'fixed' ? 'fixed' : 'percentage'
  const discountKind = body.discount_kind === 'free_shipping' ? 'free_shipping' : 'standard'
  const value = Number(body.value)
  const minSubtotalCents = Math.max(0, Number(body.min_subtotal_cents || 0))
  const usageLimit = Math.max(0, Number(body.usage_limit || 0))
  const usageCount = Math.max(0, Number(body.usage_count || 0))

  return {
    id: body.id ? Number(body.id) : null,
    code: normalizeCode(body.code),
    description: String(body.description || '').trim(),
    type,
    value: Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0,
    discount_kind: discountKind,
    usage_limit: Number.isFinite(usageLimit) ? Math.round(usageLimit) : 0,
    usage_count: Number.isFinite(usageCount) ? Math.round(usageCount) : 0,
    customer_eligibility: String(body.customer_eligibility || 'all').trim() || 'all',
    market_handle: String(body.market_handle || '').trim() || null,
    currency_code: String(body.currency_code || '').trim().toUpperCase() || null,
    combinable: body.combinable === true || String(body.combinable) === '1' ? 1 : 0,
    starts_at: String(body.starts_at || '').trim() || null,
    ends_at: String(body.ends_at || '').trim() || null,
    min_subtotal_cents: Number.isFinite(minSubtotalCents) ? Math.round(minSubtotalCents) : 0,
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
  }
}

function validateDiscount(discount) {
  if (!discount.code) return 'Il codice sconto e obbligatorio.'
  if (discount.discount_kind !== 'free_shipping' && !discount.value) {
    return 'Il valore dello sconto deve essere maggiore di zero.'
  }
  if (discount.type === 'percentage' && discount.value > 100) {
    return 'La percentuale non puo superare 100.'
  }
  return ''
}

function computedStatus(discount) {
  if (Number(discount.active) === 0) return 'disabled'
  const now = Date.now()
  const startsAt = discount.starts_at ? Date.parse(discount.starts_at) : 0
  const endsAt = discount.ends_at ? Date.parse(discount.ends_at) : 0
  if (startsAt && Number.isFinite(startsAt) && now < startsAt) return 'scheduled'
  if (endsAt && Number.isFinite(endsAt) && now > endsAt) return 'expired'
  return 'active'
}

function enrichDiscount(row, advancedEnabled) {
  const discount = {
    ...row,
    discount_kind: advancedEnabled ? row.discount_kind || 'standard' : 'standard',
    usage_limit: advancedEnabled ? Number(row.usage_limit || 0) : 0,
    usage_count: advancedEnabled ? Number(row.usage_count || 0) : 0,
    customer_eligibility: advancedEnabled ? row.customer_eligibility || 'all' : 'all',
    market_handle: advancedEnabled ? row.market_handle || '' : '',
    currency_code: advancedEnabled ? row.currency_code || '' : '',
    combinable: advancedEnabled ? Number(row.combinable || 0) : 0,
    advanced_columns_ready: advancedEnabled,
  }
  discount.status = computedStatus(discount)
  discount.checkout_support =
    discount.discount_kind === 'free_shipping'
      ? 'Configured / checkout support in progress'
      : 'Available in checkout'
  return discount
}

export async function onRequestGet({ env }) {
  try {
    const advancedEnabled = await hasAdvancedColumns(env)
    const advancedSelect = advancedEnabled
      ? `,
        discount_kind,
        usage_limit,
        usage_count,
        customer_eligibility,
        market_handle,
        currency_code,
        combinable`
      : ''

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
        ${advancedSelect}
      FROM discount_codes
      ORDER BY active DESC, created_at DESC, id DESC
    `).all()

    return json({
      success: true,
      advanced_columns_ready: advancedEnabled,
      discounts: (results || []).map((discount) => enrichDiscount(discount, advancedEnabled)),
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: tableMissing(error)
          ? 'Sconti non configurati: applica la migration sconti prima di usare questa area.'
          : 'Errore caricamento sconti.',
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

    const advancedEnabled = await hasAdvancedColumns(env)

    if (advancedEnabled) {
      await env.DB.prepare(`
        INSERT INTO discount_codes (
          code,
          description,
          type,
          value,
          starts_at,
          ends_at,
          min_subtotal_cents,
          active,
          discount_kind,
          usage_limit,
          usage_count,
          customer_eligibility,
          market_handle,
          currency_code,
          combinable
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          discount.discount_kind,
          discount.usage_limit,
          discount.usage_count,
          discount.customer_eligibility,
          discount.market_handle,
          discount.currency_code,
          discount.combinable,
        )
        .run()
    } else {
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
    }

    return json({
      success: true,
      message: advancedEnabled
        ? 'Sconto avanzato creato.'
        : 'Sconto creato. Applica la migration 0017 per campi avanzati.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: String(error?.message || '').includes('UNIQUE')
          ? 'Codice sconto gia esistente.'
          : 'Errore creazione sconto.',
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

    const advancedEnabled = await hasAdvancedColumns(env)

    if (advancedEnabled) {
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
          discount_kind = ?,
          usage_limit = ?,
          usage_count = ?,
          customer_eligibility = ?,
          market_handle = ?,
          currency_code = ?,
          combinable = ?,
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
          discount.discount_kind,
          discount.usage_limit,
          discount.usage_count,
          discount.customer_eligibility,
          discount.market_handle,
          discount.currency_code,
          discount.combinable,
          discount.id,
        )
        .run()
    } else {
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
    }

    return json({
      success: true,
      message: 'Sconto aggiornato.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: String(error?.message || '').includes('UNIQUE')
          ? 'Codice sconto gia esistente.'
          : 'Errore aggiornamento sconto.',
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
  } catch {
    return json(
      {
        success: false,
        message: 'Errore disattivazione sconto.',
      },
      500,
    )
  }
}
