export async function onRequestGet({ env }) {
  const row = await env.DB.prepare(`
    SELECT data
    FROM sections
    WHERE page_slug = 'home' AND type = 'hero'
    LIMIT 1
  `).first()

  return Response.json({
    success: true,
    hero: row ? JSON.parse(row.data) : null,
  })
}

export async function onRequestPut({ request, env }) {
  const hero = await request.json()

  const data = JSON.stringify({
    eyebrow: hero.eyebrow || '',
    title: hero.title || '',
    subtitle: hero.subtitle || '',
    button_text: hero.button_text || '',
  })

  await env.DB.prepare(`
    UPDATE sections
    SET data = ?, updated_at = CURRENT_TIMESTAMP
    WHERE page_slug = 'home' AND type = 'hero'
  `).bind(data).run()

  return Response.json({
    success: true,
    message: 'Hero aggiornata correttamente.',
  })
}