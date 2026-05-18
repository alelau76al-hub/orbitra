function json(data, status = 200) {
  return Response.json(data, { status })
}

function normalizeCode(value = '') {
  return String(value).trim().toUpperCase()
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

function isDiscountDateValid(discount) {
  const now = Date.now()
  const startsAt = discount.starts_at ? Date.parse(discount.starts_at) : null
  const endsAt = discount.ends_at ? Date.parse(discount.ends_at) : null

  if (startsAt && Number.isFinite(startsAt) && now < startsAt) return false
  if (endsAt && Number.isFinite(endsAt) && now > endsAt) return false
  return true
}

function calculateDiscountCents(discount, subtotalCents) {
  if (!discount || subtotalCents <= 0) return 0
  if (discount.discount_kind === 'free_shipping') return 0

  if (discount.type === 'fixed') {
    return Math.min(subtotalCents, Math.max(0, Number(discount.value || 0)))
  }

  const percent = Math.min(100, Math.max(0, Number(discount.value || 0)))
  return Math.round((subtotalCents * percent) / 100)
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

async function loadDiscount(env, normalizedCode) {
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

  const discount = await env.DB.prepare(`
    SELECT
      id,
      code,
      description,
      type,
      value,
      starts_at,
      ends_at,
      min_subtotal_cents,
      active
      ${advancedSelect}
    FROM discount_codes
    WHERE code = ? AND active = 1
  `)
    .bind(normalizedCode)
    .first()

  if (!discount) return null

  return {
    ...discount,
    discount_kind: advancedEnabled ? discount.discount_kind || 'standard' : 'standard',
    usage_limit: advancedEnabled ? Number(discount.usage_limit || 0) : 0,
    usage_count: advancedEnabled ? Number(discount.usage_count || 0) : 0,
    customer_eligibility: advancedEnabled ? discount.customer_eligibility || 'all' : 'all',
    market_handle: advancedEnabled ? discount.market_handle || '' : '',
    currency_code: advancedEnabled ? discount.currency_code || '' : '',
    combinable: advancedEnabled ? Number(discount.combinable || 0) : 0,
    advanced_columns_ready: advancedEnabled,
  }
}

async function validateDiscount(env, code, subtotalCents) {
  const normalizedCode = normalizeCode(code)

  if (!normalizedCode) {
    return {
      valid: false,
      message: 'Inserisci un codice sconto.',
    }
  }

  const discount = await loadDiscount(env, normalizedCode)

  if (!discount) {
    return {
      valid: false,
      message: 'Codice sconto non valido.',
    }
  }

  if (!isDiscountDateValid(discount)) {
    return {
      valid: false,
      message: 'Codice sconto non attivo in questo momento.',
    }
  }

  if (discount.usage_limit > 0 && discount.usage_count >= discount.usage_limit) {
    return {
      valid: false,
      message: 'Questo codice ha raggiunto il limite di utilizzo.',
    }
  }

  const minimum = Number(discount.min_subtotal_cents || 0)
  if (minimum > 0 && subtotalCents < minimum) {
    return {
      valid: false,
      message: `Questo codice richiede un carrello minimo di ${(minimum / 100).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'EUR',
      })}.`,
    }
  }

  const discountCents = calculateDiscountCents(discount, subtotalCents)

  return {
    valid: true,
    discount: {
      id: discount.id,
      code: discount.code,
      description: discount.description || '',
      type: discount.type,
      value: Number(discount.value || 0),
      discount_kind: discount.discount_kind,
      free_shipping: discount.discount_kind === 'free_shipping',
      checkout_support:
        discount.discount_kind === 'free_shipping'
          ? 'Available in checkout'
          : 'Available in checkout',
      discount_cents: discountCents,
    },
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)
    const subtotalCents = Math.max(0, Number(body.subtotal_cents || 0))
    const result = await validateDiscount(env, body.code, subtotalCents)

    return json({
      success: result.valid,
      ...result,
    }, result.valid ? 200 : 400)
  } catch (error) {
    return json(
      {
        success: false,
        valid: false,
        message: tableMissing(error)
          ? 'Sconti non configurati.'
          : 'Sconti non disponibili.',
      },
      500,
    )
  }
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const fakeRequest = {
    json: async () => ({
      code: url.searchParams.get('code') || '',
      subtotal_cents: Number(url.searchParams.get('subtotal_cents') || 0),
    }),
  }

  return onRequestPost({ request: fakeRequest, env })
}
