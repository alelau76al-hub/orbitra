export async function onRequestGet({ request }) {
  const origin = new URL(request.url).origin
  return new Response(`User-agent: *
Allow: /

Sitemap: ${origin}/api/sitemap.xml
`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  })
}
