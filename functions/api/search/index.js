const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60',
      ...(init.headers || {}),
    },
  })

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || error || ''))
}

function normalizeLike(value = '') {
  return `%${String(value).trim().replace(/[%_]/g, '')}%`
}

function sortClause(value = '') {
  if (value === 'price_asc') return 'p.price_cents ASC, p.name ASC'
  if (value === 'price_desc') return 'p.price_cents DESC, p.name ASC'
  if (value === 'newest') return 'p.created_at DESC, p.id DESC'
  if (value === 'name') return 'p.name ASC'
  return 'relevance DESC, p.created_at DESC, p.id DESC'
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url)
    const q = String(url.searchParams.get('q') || '').trim()
    const collection = String(url.searchParams.get('collection') || '').trim()
    const stock = String(url.searchParams.get('stock') || '').trim()
    const minPrice = Number(url.searchParams.get('price_min') || 0)
    const maxPrice = Number(url.searchParams.get('price_max') || 0)
    const sort = sortClause(url.searchParams.get('sort') || 'relevance')
    const params = []
    const where = ['p.active = 1']

    if (q) {
      where.push(`(
        p.name LIKE ?
        OR p.description LIKE ?
        OR p.slug LIKE ?
        OR COALESCE(p.category, '') LIKE ?
        OR EXISTS (
          SELECT 1
          FROM product_variants v
          WHERE v.product_id = p.id AND COALESCE(v.sku, '') LIKE ?
        )
      )`)
      params.push(normalizeLike(q), normalizeLike(q), normalizeLike(q), normalizeLike(q), normalizeLike(q))
    }
    if (collection) {
      where.push('p.collection_slug = ?')
      params.push(collection)
    }
    if (stock === 'in') where.push('COALESCE(i.stock, 0) > 0')
    if (stock === 'out') where.push('COALESCE(i.stock, 0) <= 0')
    if (Number.isFinite(minPrice) && minPrice > 0) {
      where.push('p.price_cents >= ?')
      params.push(Math.round(minPrice * 100))
    }
    if (Number.isFinite(maxPrice) && maxPrice > 0) {
      where.push('p.price_cents <= ?')
      params.push(Math.round(maxPrice * 100))
    }

    const rows = await env.DB.prepare(`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.description,
        p.price_cents,
        p.image_url,
        p.collection_slug,
        p.category,
        COALESCE(i.stock, 0) AS stock,
        CASE
          WHEN p.name LIKE ? THEN 5
          WHEN p.slug LIKE ? THEN 4
          WHEN p.description LIKE ? THEN 2
          ELSE 1
        END AS relevance
      FROM products p
      LEFT JOIN inventory i ON i.product_id = p.id
      WHERE ${where.join(' AND ')}
      ORDER BY ${sort}
      LIMIT 80
    `)
      .bind(normalizeLike(q), normalizeLike(q), normalizeLike(q), ...params)
      .all()

    return json({
      success: true,
      query: q,
      products: rows.results || [],
      count: rows.results?.length || 0,
    })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, query: '', products: [], count: 0, setup_required: true })
    return json({ success: false, message: 'Ricerca non disponibile.' }, { status: 500 })
  }
}
