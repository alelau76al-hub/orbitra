const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  })

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || error || ''))
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizePath(value = '') {
  const path = String(value || '').trim()
  if (!path) return ''
  return path.startsWith('/') ? path : `/${path}`
}

async function loadMissingMeta(env) {
  try {
    const products = await env.DB.prepare(`
      SELECT p.id, p.name, 'product' AS entity_type
      FROM products p
      LEFT JOIN seo_metadata s ON s.entity_type = 'product' AND s.entity_id = p.id
      WHERE p.active = 1 AND (s.meta_title IS NULL OR s.meta_title = '' OR s.meta_description IS NULL OR s.meta_description = '')
      LIMIT 50
    `).all()
    const media = await env.DB.prepare(`
      SELECT id, name, url
      FROM media_items
      WHERE active = 1 AND type = 'image' AND (alt_text IS NULL OR alt_text = '')
      LIMIT 50
    `).all()
    return {
      missing_meta: products.results || [],
      missing_alt: media.results || [],
    }
  } catch {
    return { missing_meta: [], missing_alt: [] }
  }
}

export async function onRequestGet({ env }) {
  try {
    const redirects = await env.DB.prepare(`
      SELECT id, from_path, to_path, status_code, active, created_at, updated_at
      FROM seo_redirects
      ORDER BY active DESC, updated_at DESC, id DESC
      LIMIT 250
    `).all()
    return json({
      success: true,
      sitemap: { endpoint: '/api/sitemap.xml', status: 'available' },
      robots: { endpoint: '/api/robots.txt', status: 'available' },
      schema: ['Organization', 'Website', 'Product', 'Breadcrumb'],
      redirects: redirects.results || [],
      ...(await loadMissingMeta(env)),
    })
  } catch (error) {
    if (tableMissing(error)) {
      return json({
        success: true,
        setup_required: true,
        sitemap: { endpoint: '/api/sitemap.xml', status: 'available' },
        robots: { endpoint: '/api/robots.txt', status: 'available' },
        redirects: [],
        ...(await loadMissingMeta(env)),
      })
    }
    return json({ success: false, message: 'SEO Technical non disponibile.' }, { status: 500 })
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request)
    const fromPath = normalizePath(body.from_path)
    const toPath = normalizePath(body.to_path)
    const statusCode = Number(body.status_code) === 302 ? 302 : 301
    if (!fromPath || !toPath) return json({ success: false, message: 'From path e To path sono obbligatori.' }, { status: 400 })

    await env.DB.prepare(`
      INSERT INTO seo_redirects (from_path, to_path, status_code, active)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(from_path) DO UPDATE SET
        to_path = excluded.to_path,
        status_code = excluded.status_code,
        active = excluded.active,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(fromPath, toPath, statusCode, body.active === false ? 0 : 1)
      .run()

    return json({ success: true, message: 'Redirect salvato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Redirect manager richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile salvare redirect.' }, { status: 500 })
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request)
    const id = Number(body.id)
    const fromPath = normalizePath(body.from_path)
    const toPath = normalizePath(body.to_path)
    const statusCode = Number(body.status_code) === 302 ? 302 : 301
    if (!id || !fromPath || !toPath) {
      return json({ success: false, message: 'Redirect non valido.' }, { status: 400 })
    }

    await env.DB.prepare(`
      UPDATE seo_redirects
      SET from_path = ?, to_path = ?, status_code = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(fromPath, toPath, statusCode, body.active === false ? 0 : 1, id)
      .run()

    return json({ success: true, message: 'Redirect aggiornato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Redirect manager richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile aggiornare redirect.' }, { status: 500 })
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const id = Number(new URL(request.url).searchParams.get('id'))
    if (!id) return json({ success: false, message: 'Redirect non valido.' }, { status: 400 })
    await env.DB.prepare('UPDATE seo_redirects SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(id).run()
    return json({ success: true, message: 'Redirect disattivato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Redirect manager richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile disattivare redirect.' }, { status: 500 })
  }
}
