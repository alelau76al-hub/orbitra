function xml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function safeAll(env, query) {
  try {
    const rows = await env.DB.prepare(query).all()
    return rows.results || []
  } catch {
    return []
  }
}

export async function onRequestGet({ env, request }) {
  const origin = new URL(request.url).origin
  const [products, collections, pages, blog, policies] = await Promise.all([
    safeAll(env, "SELECT slug, updated_at FROM products WHERE active = 1"),
    safeAll(env, "SELECT slug, updated_at FROM collections WHERE active = 1"),
    safeAll(env, "SELECT slug, updated_at FROM pages WHERE status = 'published' OR active = 1"),
    safeAll(env, "SELECT slug, updated_at FROM blog_posts WHERE status = 'published'"),
    safeAll(env, "SELECT slug, updated_at FROM policies WHERE status = 'published'"),
  ])

  const urls = [
    { loc: `${origin}/`, updated_at: '' },
    ...products.map((item) => ({ loc: `${origin}/products/${item.slug}`, updated_at: item.updated_at })),
    ...collections.map((item) => ({ loc: `${origin}/collections/${item.slug}`, updated_at: item.updated_at })),
    ...pages.filter((item) => item.slug !== 'home').map((item) => ({ loc: `${origin}/${item.slug}`, updated_at: item.updated_at })),
    ...blog.map((item) => ({ loc: `${origin}/blog/${item.slug}`, updated_at: item.updated_at })),
    ...policies.map((item) => ({ loc: `${origin}/policies/${item.slug}`, updated_at: item.updated_at })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${xml(item.loc)}</loc>
    ${item.updated_at ? `<lastmod>${xml(String(item.updated_at).slice(0, 10))}</lastmod>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  })
}
