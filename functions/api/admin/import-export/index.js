function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  })
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function escapeCsvValue(value = '') {
  const text = String(value ?? '')
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`
  return text
}

function toCsv(rows = []) {
  if (!rows.length) return ''

  const headers = Object.keys(rows[0])
  const lines = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
  ]

  return lines.join('\n')
}

function parseCsvLine(line = '') {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      index += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

function parseCsv(text = '') {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []

  const headers = parseCsvLine(lines[0]).map((header) => header.trim())

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return headers.reduce((row, header, index) => {
      row[header] = values[index]?.trim() || ''
      return row
    }, {})
  })
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replaceAll("'", '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function centsFromValue(value) {
  const text = String(value ?? '').trim()
  if (!text) return 0
  return text.includes('.') || text.includes(',')
    ? Math.round(Number(text.replace(',', '.')) * 100)
    : Number(text)
}

function normalizeProductRow(row = {}, index = 0) {
  const name = String(row.name || row.Nome || '').trim()
  const slug = slugify(row.slug || row.Slug || name)
  const priceValue = row.price_cents ?? row.price ?? row.prezzo ?? row.Prezzo
  const stock = Number(row.stock ?? row.Stock ?? 0)

  const product = {
    slug,
    name,
    description: String(row.description || row.Descrizione || '').trim(),
    price_cents: centsFromValue(priceValue),
    image_url: String(row.image_url || row.immagine || '').trim(),
    collection_slug: String(row.collection_slug || row.collezione || '').trim(),
    category: String(row.category || row.categoria || '').trim(),
    stock,
  }

  const errors = []
  if (!product.name) errors.push(`Riga ${index + 1}: nome prodotto mancante.`)
  if (!product.slug) errors.push(`Riga ${index + 1}: slug prodotto mancante.`)
  if (!Number.isFinite(product.price_cents) || product.price_cents <= 0) {
    errors.push(`Riga ${index + 1}: prezzo prodotto non valido.`)
  }
  if (!Number.isFinite(product.stock) || product.stock < 0) {
    errors.push(`Riga ${index + 1}: stock prodotto non valido.`)
  }

  return { item: product, errors }
}

function normalizeCollectionRow(row = {}, index = 0) {
  const name = String(row.name || row.title || row.Nome || '').trim()
  const slug = slugify(row.slug || row.Slug || name)
  const activeValue = row.active ?? row.attiva ?? 1

  const collection = {
    slug,
    name,
    description: String(row.description || row.Descrizione || '').trim(),
    image_url: String(row.image_url || row.immagine || '').trim(),
    active: Number(activeValue) === 0 ? 0 : 1,
  }

  const errors = []
  if (!collection.name) errors.push(`Riga ${index + 1}: nome collezione mancante.`)
  if (!collection.slug) errors.push(`Riga ${index + 1}: slug collezione mancante.`)

  return { item: collection, errors }
}

function normalizeTranslationRow(row = {}, index = 0) {
  const entityId = Number(row.entity_id || 0)
  const translation = {
    locale: String(row.locale || '').trim().toLowerCase(),
    entity_type: String(row.entity_type || row.type || '').trim(),
    entity_id: Number.isFinite(entityId) ? entityId : 0,
    entity_key: String(row.entity_key || row.slug || '').trim(),
    field_key: String(row.field_key || row.field || '').trim(),
    source_value: String(row.source_value ?? row.original ?? '').trim(),
    translated_value: String(row.translated_value ?? row.translation ?? '').trim(),
    status: String(row.status || 'active').trim() === 'draft' ? 'draft' : 'active',
  }

  const errors = []
  if (!translation.locale) errors.push(`Riga ${index + 1}: locale mancante.`)
  if (!translation.entity_type) errors.push(`Riga ${index + 1}: entity_type mancante.`)
  if (!translation.entity_id && !translation.entity_key) {
    errors.push(`Riga ${index + 1}: entity_id o entity_key richiesto.`)
  }
  if (!translation.field_key) errors.push(`Riga ${index + 1}: field_key mancante.`)
  if (!translation.translated_value) errors.push(`Riga ${index + 1}: translated_value mancante.`)

  return { item: translation, errors }
}

function parseRowsFromBody(body = {}) {
  const format = String(body.format || 'json').trim()

  if (format === 'csv') return parseCsv(body.content || '')
  if (Array.isArray(body.rows)) return body.rows
  if (!body.content) return []

  try {
    const parsed = JSON.parse(body.content)
    if (Array.isArray(parsed)) return parsed
    if (Array.isArray(parsed.rows)) return parsed.rows
    if (Array.isArray(parsed.translations)) return parsed.translations
    if (Array.isArray(parsed.resources?.translations)) return parsed.resources.translations
    return []
  } catch {
    return []
  }
}

async function safeAll(env, sql, bindings = []) {
  try {
    const statement = env.DB.prepare(sql)
    const result = bindings.length ? await statement.bind(...bindings).all() : await statement.all()
    return result.results || []
  } catch {
    return []
  }
}

async function logActivity(env, action, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, description)
      VALUES (?, 'import_export', ?)
    `)
      .bind(action, description)
      .run()
  } catch {}
}

async function loadExportRows(env, resource) {
  if (resource === 'pages') {
    return safeAll(
      env,
      `
      SELECT id, slug, title, created_at, updated_at
      FROM pages
      ORDER BY id ASC
      `,
    )
  }

  if (resource === 'sections') {
    return safeAll(
      env,
      `
      SELECT id, page_slug, type, sort_order, data_json, created_at, updated_at
      FROM sections
      ORDER BY page_slug ASC, sort_order ASC, id ASC
      `,
    )
  }

  if (resource === 'menus') {
    return safeAll(
      env,
      `
      SELECT
        menus.id AS menu_id,
        menus.handle,
        menus.name,
        menu_items.id AS item_id,
        menu_items.label,
        menu_items.url,
        menu_items.link_type,
        menu_items.target_slug,
        menu_items.sort_order,
        menu_items.active
      FROM menus
      LEFT JOIN menu_items ON menu_items.menu_id = menus.id
      ORDER BY menus.id ASC, menu_items.sort_order ASC, menu_items.id ASC
      `,
    )
  }

  if (resource === 'settings' || resource === 'theme') {
    return safeAll(
      env,
      `
      SELECT key, value, type, label, updated_at
      FROM site_settings
      ORDER BY key ASC
      `,
    )
  }

  if (resource === 'collections') {
    return safeAll(
      env,
      `
      SELECT id, slug, name, description, image_url, active, created_at
      FROM collections
      ORDER BY id ASC
      `,
    )
  }

  if (resource === 'markets') {
    return safeAll(
      env,
      `
      SELECT id, handle, name, country_code, language_code, currency_code, active, is_default, domain, path_prefix, notes, created_at, updated_at
      FROM markets
      ORDER BY is_default DESC, active DESC, name ASC
      `,
    )
  }

  if (resource === 'market_languages') {
    return safeAll(
      env,
      `
      SELECT locale, name, native_name, active, is_default, created_at, updated_at
      FROM market_languages
      ORDER BY is_default DESC, locale ASC
      `,
    )
  }

  if (resource === 'market_currencies') {
    return safeAll(
      env,
      `
      SELECT code, name, symbol, active, is_default, manual_rate, created_at, updated_at
      FROM market_currencies
      ORDER BY is_default DESC, code ASC
      `,
    )
  }

  if (resource === 'localized_prices') {
    return safeAll(
      env,
      `
      SELECT
        localized_prices.id,
        localized_prices.product_id,
        products.slug AS product_slug,
        products.name AS product_name,
        localized_prices.variant_id,
        product_variants.option_name AS variant_option_name,
        product_variants.option_value AS variant_option_value,
        localized_prices.market_handle,
        localized_prices.currency_code,
        localized_prices.price_cents,
        localized_prices.active,
        localized_prices.created_at,
        localized_prices.updated_at
      FROM localized_prices
      LEFT JOIN products ON products.id = localized_prices.product_id
      LEFT JOIN product_variants ON product_variants.id = localized_prices.variant_id
      ORDER BY products.name ASC, localized_prices.market_handle ASC
      `,
    )
  }

  if (resource === 'blog') {
    return safeAll(
      env,
      `
      SELECT id, slug, title, excerpt, content, image_url, author, status, meta_title, meta_description, og_image, created_at, updated_at
      FROM blog_posts
      ORDER BY id ASC
      `,
    )
  }

  if (resource === 'policies') {
    return safeAll(
      env,
      `
      SELECT id, type, slug, title, content, status, created_at, updated_at
      FROM policies
      ORDER BY id ASC
      `,
    )
  }

  if (resource === 'metafields') {
    return safeAll(
      env,
      `
      SELECT
        metafield_definitions.id AS definition_id,
        metafield_definitions.entity_type,
        metafield_definitions.key,
        metafield_definitions.label,
        metafield_definitions.type,
        metafield_definitions.active,
        metafield_values.entity_id,
        metafield_values.value
      FROM metafield_definitions
      LEFT JOIN metafield_values ON metafield_values.definition_id = metafield_definitions.id
      ORDER BY metafield_definitions.entity_type ASC, metafield_definitions.key ASC
      `,
    )
  }

  if (resource === 'translations') {
    return safeAll(
      env,
      `
      SELECT id, locale, entity_type, entity_id, entity_key, field_key, source_value, translated_value, status, created_at, updated_at
      FROM translations
      ORDER BY locale ASC, entity_type ASC, entity_id ASC, entity_key ASC, field_key ASC
      `,
    )
  }

  if (resource === 'seo') {
    return safeAll(
      env,
      `
      SELECT id, entity_type, entity_id, meta_title, meta_description, og_image, canonical_url, created_at, updated_at
      FROM seo_metadata
      ORDER BY entity_type ASC, entity_id ASC
      `,
    )
  }

  if (resource === 'customers') {
    return safeAll(
      env,
      `
      SELECT id, email, name, phone, shipping_address_city, shipping_address_country, created_at
      FROM customers
      ORDER BY id ASC
      `,
    )
  }

  if (resource === 'orders') {
    return safeAll(
      env,
      `
      SELECT id, email, total_cents, status, payment_status, order_status, payment_provider, provider_reference, created_at
      FROM orders
      ORDER BY id ASC
      `,
    )
  }

  return safeAll(
    env,
    `
    SELECT
      products.id,
      products.slug,
      products.name,
      products.description,
      products.price_cents,
      products.image_url,
      products.collection_slug,
      products.category,
      products.active,
      COALESCE(inventory.stock, 0) AS stock
    FROM products
    LEFT JOIN inventory ON inventory.product_id = products.id
    ORDER BY products.id ASC
    `,
  )
}

async function loadTranslationMap(env, locale) {
  const rows = await loadExportRows(env, 'translations')
  return rows
    .filter((row) => row.locale === locale)
    .reduce((map, row) => {
      const key = `${row.entity_type}:${row.entity_id || 0}:${row.entity_key || ''}:${row.field_key}`
      map[key] = row.translated_value || ''
      return map
    }, {})
}

function addTranslationPackageRows(target, rows, config, translationMap) {
  rows.forEach((row) => {
    const entityId = Number(row[config.idKey] || row.id || 0)
    const entityKey = String(row[config.keyKey] || row.slug || row.handle || '').trim()

    config.fields.forEach((fieldKey) => {
      const sourceValue = String(row[fieldKey] ?? '').trim()
      if (!sourceValue) return

      const mapKey = `${config.entityType}:${entityId}:${entityKey}:${fieldKey}`
      target.push({
        locale: config.locale,
        entity_type: config.entityType,
        entity_id: entityId,
        entity_key: entityKey,
        field_key: fieldKey,
        source_value: sourceValue,
        translated_value: translationMap[mapKey] || '',
        status: translationMap[mapKey] ? 'active' : 'draft',
      })
    })
  })
}

async function loadTranslationPackage(env, locale = 'en') {
  const translationMap = await loadTranslationMap(env, locale)
  const packageRows = []

  const [products, collections, pages, sections, blog, policies, seo] = await Promise.all([
    loadExportRows(env, 'products'),
    loadExportRows(env, 'collections'),
    loadExportRows(env, 'pages'),
    loadExportRows(env, 'sections'),
    loadExportRows(env, 'blog'),
    loadExportRows(env, 'policies'),
    loadExportRows(env, 'seo'),
  ])

  addTranslationPackageRows(
    packageRows,
    products,
    { locale, entityType: 'product', idKey: 'id', keyKey: 'slug', fields: ['name', 'description'] },
    translationMap,
  )
  addTranslationPackageRows(
    packageRows,
    collections,
    { locale, entityType: 'collection', idKey: 'id', keyKey: 'slug', fields: ['name', 'description'] },
    translationMap,
  )
  addTranslationPackageRows(
    packageRows,
    pages,
    { locale, entityType: 'page', idKey: 'id', keyKey: 'slug', fields: ['title'] },
    translationMap,
  )
  addTranslationPackageRows(
    packageRows,
    blog,
    { locale, entityType: 'blog', idKey: 'id', keyKey: 'slug', fields: ['title', 'excerpt', 'content', 'meta_title', 'meta_description'] },
    translationMap,
  )
  addTranslationPackageRows(
    packageRows,
    policies,
    { locale, entityType: 'policy', idKey: 'id', keyKey: 'slug', fields: ['title', 'content'] },
    translationMap,
  )
  addTranslationPackageRows(
    packageRows,
    seo,
    { locale, entityType: 'seo', idKey: 'entity_id', keyKey: 'entity_type', fields: ['meta_title', 'meta_description'] },
    translationMap,
  )

  sections.forEach((section) => {
    let data = {}
    try {
      data = JSON.parse(section.data_json || '{}')
    } catch {
      data = {}
    }

    Object.entries(data).forEach(([fieldKey, value]) => {
      if (!['eyebrow', 'title', 'subtitle', 'text', 'button_text', 'question', 'answer'].includes(fieldKey)) return
      const sourceValue = String(value ?? '').trim()
      if (!sourceValue) return
      const entityKey = `${section.page_slug}:${section.type}:${section.sort_order}`
      const mapKey = `section:${section.id}:${entityKey}:${fieldKey}`

      packageRows.push({
        locale,
        entity_type: 'section',
        entity_id: Number(section.id || 0),
        entity_key: entityKey,
        field_key: fieldKey,
        source_value: sourceValue,
        translated_value: translationMap[mapKey] || '',
        status: translationMap[mapKey] ? 'active' : 'draft',
      })
    })
  })

  return packageRows
}

async function loadBackupData(env) {
  const [products, collections, pages, menus, settings] = await Promise.all([
    loadExportRows(env, 'products'),
    loadExportRows(env, 'collections'),
    loadExportRows(env, 'pages'),
    loadExportRows(env, 'menus'),
    loadExportRows(env, 'settings'),
  ])

  return {
    generated_at: new Date().toISOString(),
    resources: {
      products,
      collections,
      pages,
      menus,
      settings,
    },
  }
}

async function loadSitePackage(env) {
  const [pages, sections, menus, settings, policies, blog, translations, seo, markets, localizedPrices] = await Promise.all([
    loadExportRows(env, 'pages'),
    loadExportRows(env, 'sections'),
    loadExportRows(env, 'menus'),
    loadExportRows(env, 'settings'),
    loadExportRows(env, 'policies'),
    loadExportRows(env, 'blog'),
    loadExportRows(env, 'translations'),
    loadExportRows(env, 'seo'),
    loadExportRows(env, 'markets'),
    loadExportRows(env, 'localized_prices'),
  ])

  return {
    generated_at: new Date().toISOString(),
    note: 'Site package esporta contenuti configurabili. Non contiene codice eseguibile.',
    resources: {
      pages,
      sections,
      menus,
      settings,
      policies,
      blog,
      translations,
      seo,
      markets,
      localized_prices: localizedPrices,
    },
  }
}

function loadTemplateRows(target) {
  if (target === 'collections') {
    return [
      {
        slug: 'collezione-demo',
        name: 'Collezione Demo',
        description: 'Descrizione collezione',
        image_url: 'https://example.com/collection.jpg',
        active: 1,
      },
    ]
  }

  if (target === 'translations') {
    return [
      {
        locale: 'en',
        entity_type: 'product',
        entity_id: 1,
        entity_key: 'prodotto-demo',
        field_key: 'name',
        source_value: 'Prodotto Demo',
        translated_value: 'Demo Product',
        status: 'active',
      },
    ]
  }

  return [
    {
      slug: 'prodotto-demo',
      name: 'Prodotto Demo',
      description: 'Descrizione prodotto',
      price_cents: 4900,
      image_url: 'https://example.com/product.jpg',
      collection_slug: 'collezione-demo',
      category: 'Categoria',
      stock: 10,
    },
  ]
}

async function importProducts(env, normalized) {
  const report = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  }

  for (const item of normalized) {
    const product = item.item
    const existing = await env.DB.prepare('SELECT id FROM products WHERE slug = ?')
      .bind(product.slug)
      .first()

    let productId = existing?.id

    if (existing) {
      await env.DB.prepare(`
        UPDATE products
        SET
          name = ?,
          description = ?,
          price_cents = ?,
          image_url = ?,
          collection_slug = ?,
          category = ?,
          active = 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(
          product.name,
          product.description,
          product.price_cents,
          product.image_url,
          product.collection_slug,
          product.category,
          productId,
        )
        .run()
      report.updated += 1
    } else {
      const inserted = await env.DB.prepare(`
        INSERT INTO products (slug, name, description, price_cents, image_url, collection_slug, category, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `)
        .bind(
          product.slug,
          product.name,
          product.description,
          product.price_cents,
          product.image_url,
          product.collection_slug,
          product.category,
        )
        .run()
      productId = inserted.meta.last_row_id
      report.created += 1
    }

    await env.DB.prepare(`
      INSERT INTO inventory (product_id, stock)
      VALUES (?, ?)
      ON CONFLICT(product_id) DO UPDATE SET stock = excluded.stock
    `)
      .bind(productId, product.stock)
      .run()
  }

  return report
}

async function importCollections(env, normalized) {
  const report = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  }

  for (const item of normalized) {
    const collection = item.item
    const existing = await env.DB.prepare('SELECT id FROM collections WHERE slug = ?')
      .bind(collection.slug)
      .first()

    if (existing) {
      await env.DB.prepare(`
        UPDATE collections
        SET name = ?, description = ?, image_url = ?, active = ?
        WHERE id = ?
      `)
        .bind(collection.name, collection.description, collection.image_url, collection.active, existing.id)
        .run()
      report.updated += 1
    } else {
      await env.DB.prepare(`
        INSERT INTO collections (slug, name, description, image_url, active)
        VALUES (?, ?, ?, ?, ?)
      `)
        .bind(collection.slug, collection.name, collection.description, collection.image_url, collection.active)
        .run()
      report.created += 1
    }
  }

  return report
}

async function importTranslations(env, normalized) {
  const report = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  }

  for (const item of normalized) {
    const translation = item.item
    const existing = await env.DB.prepare(`
      SELECT id
      FROM translations
      WHERE locale = ?
        AND entity_type = ?
        AND entity_id = ?
        AND entity_key = ?
        AND field_key = ?
    `)
      .bind(
        translation.locale,
        translation.entity_type,
        translation.entity_id,
        translation.entity_key,
        translation.field_key,
      )
      .first()

    await env.DB.prepare(`
      INSERT INTO translations (
        locale,
        entity_type,
        entity_id,
        entity_key,
        field_key,
        source_value,
        translated_value,
        status,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(locale, entity_type, entity_id, entity_key, field_key)
      DO UPDATE SET
        source_value = excluded.source_value,
        translated_value = excluded.translated_value,
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(
        translation.locale,
        translation.entity_type,
        translation.entity_id,
        translation.entity_key,
        translation.field_key,
        translation.source_value,
        translation.translated_value,
        translation.status,
      )
      .run()

    if (existing) report.updated += 1
    else report.created += 1
  }

  return report
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const resource = String(url.searchParams.get('resource') || 'products').trim()
    const format = String(url.searchParams.get('format') || 'json').trim()
    const locale = String(url.searchParams.get('locale') || 'en').trim().toLowerCase()
    const templateTarget = String(url.searchParams.get('target') || 'products').trim()
    const allowed = new Set([
      'products',
      'collections',
      'pages',
      'menus',
      'settings',
      'theme',
      'customers',
      'orders',
      'blog',
      'policies',
      'metafields',
      'translations',
      'markets',
      'market_languages',
      'market_currencies',
      'localized_prices',
      'sections',
      'seo',
      'backup',
      'translation_package',
      'site_package',
      'template',
    ])

    if (!allowed.has(resource)) {
      return json({ success: false, message: 'Risorsa export non valida.' }, 400)
    }

    if (resource === 'backup') {
      if (format === 'csv') {
        return json({ success: false, message: 'Il backup completo e disponibile solo in JSON.' }, 400)
      }

      const backup = await loadBackupData(env)
      await logActivity(env, 'export', 'Export backup JSON principale.')

      return json({
        success: true,
        resource,
        backup,
      })
    }

    if (resource === 'translation_package') {
      const rows = await loadTranslationPackage(env, locale)
      await logActivity(env, 'export', `Export translation package ${locale}.`)

      if (format === 'csv') {
        return new Response(toCsv(rows), {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="translation-package-${locale}.csv"`,
            'Cache-Control': 'no-store',
          },
        })
      }

      return json({
        success: true,
        resource,
        locale,
        count: rows.length,
        rows,
      })
    }

    if (resource === 'site_package') {
      if (format === 'csv') {
        return json({ success: false, message: 'Il site package e disponibile solo in JSON.' }, 400)
      }

      const sitePackage = await loadSitePackage(env)
      await logActivity(env, 'export', 'Export site package JSON.')

      return json({
        success: true,
        resource,
        site_package: sitePackage,
      })
    }

    if (resource === 'template') {
      const rows = loadTemplateRows(templateTarget)

      if (format === 'csv') {
        return new Response(toCsv(rows), {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="${templateTarget}-template.csv"`,
            'Cache-Control': 'no-store',
          },
        })
      }

      return json({
        success: true,
        resource,
        target: templateTarget,
        rows,
      })
    }

    const rows = await loadExportRows(env, resource)
    await logActivity(env, 'export', `Export ${resource} in formato ${format}.`)

    if (format === 'csv') {
      return new Response(toCsv(rows), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${resource}.csv"`,
          'Cache-Control': 'no-store',
        },
      })
    }

    return json({
      success: true,
      resource,
      count: rows.length,
      rows,
    })
  } catch {
    return json({ success: false, message: 'Export non riuscito. Riprova piu tardi.' }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)
    const resource = String(body.resource || 'products').trim()
    const dryRun = body.dry_run !== false
    const rawRows = parseRowsFromBody(body)
    const normalizers = {
      products: normalizeProductRow,
      collections: normalizeCollectionRow,
      translations: normalizeTranslationRow,
      translation_package: normalizeTranslationRow,
    }
    const importers = {
      products: importProducts,
      collections: importCollections,
      translations: importTranslations,
      translation_package: importTranslations,
    }
    const normalizer = normalizers[resource]
    const importer = importers[resource]

    if (!normalizer || !importer) {
      return json({ success: false, message: 'Import disponibile solo per prodotti, collezioni e traduzioni.' }, 400)
    }

    if (!rawRows.length) {
      return json({ success: false, message: 'Nessuna riga valida da importare.' }, 400)
    }

    const normalized = rawRows.map((row, index) => normalizer(row, index))
    const errors = normalized.flatMap((item) => item.errors)

    if (errors.length) {
      return json({
        success: false,
        dry_run: dryRun,
        message: 'Import non valido. Correggi le righe segnalate e riprova.',
        count: rawRows.length,
        errors,
        preview: normalized.map((item) => item.item),
      }, 400)
    }

    if (dryRun) {
      return json({
        success: true,
        dry_run: true,
        message: 'Dry-run completato. Nessuna scrittura eseguita.',
        count: normalized.length,
        preview: normalized.map((item) => item.item),
        report: {
          created: 0,
          updated: 0,
          skipped: 0,
          errors: [],
        },
      })
    }

    let report
    try {
      report = await importer(env, normalized)
    } catch {
      const isTranslationsImport = resource === 'translations' || resource === 'translation_package'
      return json(
        {
          success: false,
          dry_run: false,
          message: isTranslationsImport
            ? 'Import traduzioni non disponibile. Verifica che la tabella translations sia stata applicata.'
            : 'Import non riuscito. Verifica dati e configurazione.',
        },
        500,
      )
    }

    await logActivity(env, 'import', `Import ${resource} completato: ${normalized.length} righe.`)

    return json({
      success: true,
      dry_run: false,
      message: 'Import completato.',
      count: normalized.length,
      report,
    })
  } catch {
    return json({ success: false, message: 'Import non riuscito. Verifica il formato e riprova.' }, 500)
  }
}
