function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

async function countRows(env, table, where = '') {
  try {
    const row = await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${table} ${where}`).first()
    return Number(row?.count || 0)
  } catch {
    return 0
  }
}

async function settings(env) {
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

function checklistItem(key, label, ok, description, action, href) {
  return {
    key,
    label,
    status: ok ? 'OK' : 'Warning',
    description,
    action,
    href,
  }
}

export async function onRequestGet({ env }) {
  try {
    const s = await settings(env)
    const products = await countRows(env, 'products', 'WHERE active = 1')
    const collections = await countRows(env, 'collections', 'WHERE active = 1')
    const menus = await countRows(env, 'menus')
    const pages = await countRows(env, 'pages')
    const policies = await countRows(env, 'policies', "WHERE status = 'published'")
    const shipping = await countRows(env, 'shipping_methods', 'WHERE active = 1')
    const taxes = await countRows(env, 'tax_settings')
    const discounts = await countRows(env, 'discount_codes', 'WHERE active = 1')
    const domains = await countRows(env, 'domains', 'WHERE is_primary = 1')
    const backups = await countRows(env, 'import_export_jobs', "WHERE type LIKE 'export:%' OR type LIKE '%backup%'")
    const emailTemplates = await countRows(env, 'notification_templates', 'WHERE active = 1')

    const items = [
      checklistItem('products', 'Prodotti caricati', products > 0, `${products} prodotti attivi.`, 'Carica catalogo prodotti.', '#prodotti'),
      checklistItem('collections', 'Collezioni configurate', collections > 0, `${collections} collezioni attive.`, 'Crea collezioni principali.', '#collezioni'),
      checklistItem('menu', 'Menu principale configurato', menus > 0, `${menus} menu presenti.`, 'Configura menu header/footer.', '#menu'),
      checklistItem('pages', 'Pagine principali create', pages > 0, `${pages} pagine presenti.`, 'Crea pagine istituzionali.', '#pagine'),
      checklistItem('policies', 'Policy pubblicate', policies >= 3, `${policies} policy pubblicate.`, 'Pubblica privacy, termini, resi/spedizioni.', '#policy'),
      checklistItem('checkout', 'Checkout testato', true, 'Checkout manual/test disponibile.', 'Esegui un ordine test end-to-end.', '#checkout'),
      checklistItem('shipping', 'Shipping configurato', shipping > 0, `${shipping} metodi attivi.`, 'Configura spedizioni.', '#shipping'),
      checklistItem('taxes', 'Taxes configurate', taxes > 0, `${taxes} configurazioni fiscali.`, 'Verifica IVA/tasse.', '#tax'),
      checklistItem('discounts', 'Sconti verificati', discounts >= 0, `${discounts} codici attivi.`, 'Verifica coupon se usati.', '#discounts'),
      checklistItem('google', 'Google Suite configurata', Boolean(s.google_ga4_measurement_id || s.google_gtm_container_id), 'GA4/GTM/Search Console opzionali.', 'Configura Google Suite.', '#google-suite'),
      checklistItem('search_console', 'Search Console configurata', Boolean(s.google_search_console_verification), 'Verification content salvato se presente.', 'Aggiungi verification.', '#google-suite'),
      checklistItem('domain', 'Dominio configurato', domains > 0, `${domains} dominio primario.`, 'Configura dominio primario.', '#domini'),
      checklistItem('cookie', 'Cookie/privacy configurati', s.cookie_banner_status && s.cookie_banner_status !== 'disabled', `Cookie banner: ${s.cookie_banner_status || 'disabled'}.`, 'Configura consenso cookie.', '#gdpr-cookie'),
      checklistItem('email', 'Email notifications configurate', emailTemplates > 0, `${emailTemplates} template attivi.`, 'Configura template/provider email.', '#email-automations'),
      checklistItem('backup', 'Backup creato', backups > 0, `${backups} export/backup registrati.`, 'Genera backup prima del go-live.', '#backup'),
      checklistItem('audit_mode', 'Audit mode spento prima del go-live', env.ADMIN_AUDIT_MODE !== 'true', env.ADMIN_AUDIT_MODE === 'true' ? 'Audit mode attivo.' : 'Audit mode non attivo.', 'Disattiva ADMIN_AUDIT_MODE in produzione.', '#performance'),
    ]

    return json({ success: true, items })
  } catch {
    return json({ success: false, message: 'Launch checklist non disponibile.' }, 500)
  }
}
