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

function normalizeSettings(body = {}) {
  const provider = body.payment_provider === 'stripe' ? 'stripe' : 'manual'
  const mode = body.stripe_mode === 'live' ? 'live' : 'test'

  return {
    payment_provider: provider,
    stripe_enabled: body.stripe_enabled === true || String(body.stripe_enabled) === '1' ? '1' : '0',
    stripe_mode: mode,
    stripe_public_key: String(body.stripe_public_key || '').trim(),
  }
}

async function loadPaymentSettings(env) {
  const defaults = {
    payment_provider: 'manual',
    stripe_enabled: '0',
    stripe_mode: 'test',
    stripe_public_key: '',
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT key, value
      FROM site_settings
      WHERE key IN ('payment_provider', 'stripe_enabled', 'stripe_mode', 'stripe_public_key')
    `).all()

    return (results || []).reduce((settings, row) => {
      settings[row.key] = row.value
      return settings
    }, defaults)
  } catch {
    return defaults
  }
}

async function savePaymentSetting(env, key, value, type, label) {
  await env.DB.prepare(`
    INSERT INTO site_settings (key, value, group_name, type, label, updated_at)
    VALUES (?, ?, 'payments', ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key)
    DO UPDATE SET
      value = excluded.value,
      group_name = 'payments',
      type = excluded.type,
      label = excluded.label,
      updated_at = CURRENT_TIMESTAMP
  `)
    .bind(key, value, type, label)
    .run()
}

function publicSettings(settings, env) {
  return {
    payment_provider: settings.payment_provider === 'stripe' ? 'stripe' : 'manual',
    stripe_enabled: String(settings.stripe_enabled || '0') === '1',
    stripe_mode: settings.stripe_mode === 'live' ? 'live' : 'test',
    stripe_public_key: settings.stripe_public_key || '',
    stripe_secret_configured: Boolean(env.STRIPE_SECRET_KEY),
    stripe_webhook_configured: Boolean(env.STRIPE_WEBHOOK_SECRET),
  }
}

export async function onRequestGet({ env }) {
  const settings = await loadPaymentSettings(env)

  return json({
    success: true,
    settings: publicSettings(settings, env),
    message: env.STRIPE_SECRET_KEY
      ? 'Stripe secret configurata via ambiente.'
      : 'Stripe non configurato: imposta STRIPE_SECRET_KEY nelle variabili ambiente.',
  })
}

export async function onRequestPut({ request, env }) {
  try {
    const settings = normalizeSettings(await readBody(request))

    await savePaymentSetting(env, 'payment_provider', settings.payment_provider, 'select', 'Provider pagamento')
    await savePaymentSetting(env, 'stripe_enabled', settings.stripe_enabled, 'boolean', 'Stripe abilitato')
    await savePaymentSetting(env, 'stripe_mode', settings.stripe_mode, 'select', 'Modalita Stripe')
    await savePaymentSetting(env, 'stripe_public_key', settings.stripe_public_key, 'text', 'Stripe publishable key')

    return json({
      success: true,
      message: 'Impostazioni pagamento salvate. Le chiavi segrete restano solo nelle variabili ambiente.',
      settings: publicSettings(settings, env),
    })
  } catch {
    return json({ success: false, message: 'Errore salvataggio impostazioni pagamento.' }, 500)
  }
}
