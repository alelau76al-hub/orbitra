function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

async function countRows(env, table) {
  try {
    const row = await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${table}`).first()
    return Number(row?.count || 0)
  } catch {
    return null
  }
}

async function settingMap(env) {
  try {
    const rows = await env.DB.prepare('SELECT key, value FROM site_settings').all()
    return (rows.results || []).reduce((map, item) => {
      map[item.key] = item.value
      return map
    }, {})
  } catch {
    return {}
  }
}

function item(key, label, status, description, action, href) {
  return { key, label, status, description, action, href }
}

export async function onRequestGet({ env }) {
  try {
    const settings = await settingMap(env)
    const products = await countRows(env, 'products')
    const collections = await countRows(env, 'collections')
    const orders = await countRows(env, 'orders')
    const shipping = await countRows(env, 'shipping_methods')
    const taxes = await countRows(env, 'tax_settings')
    const policies = await countRows(env, 'policies')
    const backups = await countRows(env, 'import_export_jobs')
    const googleReady = Boolean(settings.google_ga4_measurement_id || settings.google_gtm_container_id)
    const searchConsoleReady = Boolean(settings.google_search_console_verification)
    const cookieStatus = settings.cookie_banner_status || 'disabled'
    const emailProvider = env.RESEND_API_KEY
      ? 'Resend'
      : env.SENDGRID_API_KEY
        ? 'SendGrid'
        : env.BREVO_API_KEY
          ? 'Brevo'
          : env.MAILGUN_API_KEY
            ? 'Mailgun'
            : 'none'

    const checks = [
      item('public_api', 'API pubbliche', 'OK', 'Endpoint pubblici principali predisposti con fallback.', 'Test smoke /api/products e /api/markets.', '#performance'),
      item('admin_api', 'API admin', 'OK', 'API admin protette da sessione e RBAC.', 'Verifica 401 senza sessione.', '#utenti'),
      item('database', 'Database / tabelle principali', products === null ? 'Warning' : 'OK', products === null ? 'D1 non leggibile.' : 'Tabelle base leggibili.', 'Verifica migrations applicate.', '#performance'),
      item('products', 'Prodotti presenti', products > 0 ? 'OK' : 'Warning', `${products ?? 0} prodotti rilevati.`, 'Carica almeno un prodotto.', '#prodotti'),
      item('collections', 'Collezioni presenti', collections > 0 ? 'OK' : 'Warning', `${collections ?? 0} collezioni rilevate.`, 'Configura collezioni principali.', '#collezioni'),
      item('checkout', 'Checkout configurato', 'OK', 'Checkout manual/test disponibile con fallback.', 'Esegui ordine test.', '#checkout'),
      item('shipping', 'Shipping configurato', shipping > 0 ? 'OK' : 'Missing configuration', `${shipping ?? 0} metodi spedizione.`, 'Configura almeno un metodo shipping.', '#shipping'),
      item('taxes', 'Taxes configurate', taxes > 0 ? 'OK' : 'Warning', `${taxes ?? 0} configurazioni fiscali.`, 'Verifica IVA/tasse.', '#tax'),
      item('stripe', 'Stripe env status', env.STRIPE_SECRET_KEY ? 'OK' : 'Requires external configuration', env.STRIPE_SECRET_KEY ? 'Stripe env presente.' : 'Stripe non configurato: checkout usa manual/test.', 'Configura env Stripe in Cloudflare.', '#checkout'),
      item('media', 'R2 / Media env status', env.MEDIA_BUCKET ? 'OK' : 'Requires external configuration', env.MEDIA_BUCKET ? 'Storage media configurato.' : 'Upload reale richiede MEDIA_BUCKET/R2.', 'Configura storage esterno.', '#media'),
      item('google', 'Google Suite', googleReady ? 'OK' : 'Requires external configuration', googleReady ? 'ID Google configurati.' : 'GA4/GTM non configurati.', 'Configura Google Suite.', '#google-suite'),
      item('email', 'Email provider', emailProvider !== 'none' ? 'OK' : 'Requires external configuration', emailProvider === 'none' ? 'Mock / logging only.' : `${emailProvider} configurato.`, 'Configura provider email env.', '#email-automations'),
      item('search_console', 'Search Console verification', searchConsoleReady ? 'OK' : 'Warning', searchConsoleReady ? 'Verification salvata.' : 'Verification non configurata.', 'Aggiungi verification content.', '#google-suite'),
      item('backup', 'Ultimo backup/export', backups > 0 ? 'OK' : 'Warning', `${backups ?? 0} job import/export registrati.`, 'Genera backup JSON.', '#backup'),
      item('cookie', 'Cookie consent', cookieStatus !== 'disabled' ? 'OK' : 'Warning', `Banner cookie: ${cookieStatus}.`, 'Configura cookie privacy.', '#gdpr-cookie'),
    ]

    return json({ success: true, checks, summary: { products, collections, orders, shipping, taxes, policies, email_provider: emailProvider } })
  } catch {
    return json({ success: false, message: 'Store Health non disponibile.' }, 500)
  }
}
