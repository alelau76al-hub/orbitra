function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers })
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

function parseCsv(text = '') {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((header) => header.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(',')
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

function normalizeProductRow(row = {}, index = 0) {
  const name = String(row.name || row.Nome || '').trim()
  const slug = slugify(row.slug || row.Slug || name)
  const priceValue = row.price_cents ?? row.price ?? row.prezzo ?? row.Prezzo
  const priceCents = String(priceValue || '').includes('.')
    ? Math.round(Number(priceValue) * 100)
    : Number(priceValue || 0)
  const stock = Number(row.stock ?? row.Stock ?? 0)

  const product = {
    slug,
    name,
    description: String(row.description || row.Descrizione || '').trim(),
    price_cents: priceCents,
    image_url: String(row.image_url || row.immagine || '').trim(),
    collection_slug: String(row.collection_slug || row.collezione || '').trim(),
    category: String(row.category || row.categoria || '').trim(),
    stock,
  }

  const errors = []
  if (!product.name) errors.push(`Riga ${index + 1}: nome mancante.`)
  if (!product.slug) errors.push(`Riga ${index + 1}: slug mancante.`)
  if (!Number.isFinite(product.price_cents) || product.price_cents <= 0) {
    errors.push(`Riga ${index + 1}: prezzo non valido.`)
  }
  if (!Number.isFinite(product.stock) || product.stock < 0) {
    errors.push(`Riga ${index + 1}: stock non valido.`)
  }

  return { product, errors }
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
    const { results } = await env.DB.prepare(`
      SELECT id, slug, title, created_at, updated_at
      FROM pages
      ORDER BY id ASC
    `).all()
    return results || []
  }

  if (resource === 'menus') {
    const { results } = await env.DB.prepare(`
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
    `).all()
    return results || []
  }

  if (resource === 'settings') {
    const { results } = await env.DB.prepare(`
      SELECT key, value, type, label, updated_at
      FROM site_settings
      ORDER BY key ASC
    `).all()
    return results || []
  }

  if (resource === 'collections') {
    const { results } = await env.DB.prepare(`
      SELECT id, slug, name, description, image_url, active, created_at
      FROM collections
      ORDER BY id ASC
    `).all()
    return results || []
  }

  if (resource === 'customers') {
    const { results } = await env.DB.prepare(`
      SELECT id, email, name, phone, shipping_address_city, shipping_address_country, created_at
      FROM customers
      ORDER BY id ASC
    `).all()
    return results || []
  }

  if (resource === 'orders') {
    const { results } = await env.DB.prepare(`
      SELECT id, email, total_cents, status, payment_status, order_status, created_at
      FROM orders
      ORDER BY id ASC
    `).all()
    return results || []
  }

  const { results } = await env.DB.prepare(`
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
  `).all()
  return results || []
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

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const resource = String(url.searchParams.get('resource') || 'products').trim()
    const format = String(url.searchParams.get('format') || 'json').trim()
    const allowed = new Set([
      'products',
      'collections',
      'pages',
      'menus',
      'settings',
      'customers',
      'orders',
      'backup',
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

    const rows = await loadExportRows(env, resource)
    await logActivity(env, 'export', `Export ${resource} in formato ${format}.`)

    if (format === 'csv') {
      return new Response(toCsv(rows), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${resource}.csv"`,
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
    return json({ success: false, message: 'Errore export dati.' }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)
    const dryRun = body.dry_run !== false
    const format = String(body.format || 'json').trim()
    const rawRows = format === 'csv' ? parseCsv(body.content || '') : Array.isArray(body.rows) ? body.rows : []
    const normalized = rawRows.map((row, index) => normalizeProductRow(row, index))
    const errors = normalized.flatMap((item) => item.errors)

    if (!rawRows.length) {
      return json({ success: false, message: 'Nessuna riga prodotto da importare.' }, 400)
    }

    if (errors.length) {
      return json({
        success: false,
        dry_run: dryRun,
        errors,
        preview: normalized.map((item) => item.product),
      }, 400)
    }

    if (dryRun) {
      return json({
        success: true,
        dry_run: true,
        message: 'Dry-run completato. Nessuna scrittura eseguita.',
        count: normalized.length,
        preview: normalized.map((item) => item.product),
      })
    }

    for (const item of normalized) {
      const product = item.product
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
      }

      await env.DB.prepare(`
        INSERT INTO inventory (product_id, stock)
        VALUES (?, ?)
        ON CONFLICT(product_id) DO UPDATE SET stock = excluded.stock
      `)
        .bind(productId, product.stock)
        .run()
    }

    await logActivity(env, 'import', `Import prodotti completato: ${normalized.length} righe.`)

    return json({
      success: true,
      dry_run: false,
      message: 'Import prodotti completato.',
      count: normalized.length,
    })
  } catch {
    return json({ success: false, message: 'Errore import prodotti.' }, 500)
  }
}
