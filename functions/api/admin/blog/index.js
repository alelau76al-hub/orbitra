function json(data, status = 200) {
  return Response.json(data, { status })
}

const statuses = new Set(['draft', 'published'])

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replaceAll("'", '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizePost(body = {}) {
  const title = String(body.title || '').trim()

  return {
    id: body.id ? Number(body.id) : null,
    slug: slugify(body.slug || title),
    title,
    excerpt: String(body.excerpt || '').trim(),
    content: String(body.content || '').trim(),
    image_url: String(body.image_url || '').trim(),
    author: String(body.author || '').trim(),
    status: statuses.has(body.status) ? body.status : 'draft',
    meta_title: String(body.meta_title || '').trim(),
    meta_description: String(body.meta_description || '').trim(),
    og_image: String(body.og_image || '').trim(),
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'blog_post', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {
    // Activity log opzionale.
  }
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        slug,
        title,
        excerpt,
        content,
        image_url,
        author,
        status,
        meta_title,
        meta_description,
        og_image,
        created_at,
        updated_at
      FROM blog_posts
      ORDER BY created_at DESC, id DESC
    `).all()

    return json({
      success: true,
      posts: results || [],
    })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento blog. Verifica la migration 0009.', error: error.message }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const post = normalizePost(await readBody(request))

    if (!post.title || !post.slug) {
      return json({ success: false, message: 'Titolo e slug sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO blog_posts (
        slug,
        title,
        excerpt,
        content,
        image_url,
        author,
        status,
        meta_title,
        meta_description,
        og_image
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        post.image_url,
        post.author,
        post.status,
        post.meta_title,
        post.meta_description,
        post.og_image,
      )
      .run()

    await logActivity(env, 'create', inserted.meta.last_row_id, `Articolo blog ${post.title} creato.`)

    return json({ success: true, message: 'Articolo creato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore creazione articolo.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const post = normalizePost(await readBody(request))

    if (!post.id || !post.title || !post.slug) {
      return json({ success: false, message: 'Dati articolo non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE blog_posts
      SET
        slug = ?,
        title = ?,
        excerpt = ?,
        content = ?,
        image_url = ?,
        author = ?,
        status = ?,
        meta_title = ?,
        meta_description = ?,
        og_image = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        post.image_url,
        post.author,
        post.status,
        post.meta_title,
        post.meta_description,
        post.og_image,
        post.id,
      )
      .run()

    await logActivity(env, 'update', post.id, `Articolo blog ${post.title} aggiornato.`)

    return json({ success: true, message: 'Articolo aggiornato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento articolo.', error: error.message }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID articolo mancante.' }, 400)

    await env.DB.prepare(`
      UPDATE blog_posts
      SET status = 'draft', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    await logActivity(env, 'unpublish', id, 'Articolo blog riportato in bozza.')

    return json({ success: true, message: 'Articolo riportato in bozza.' })
  } catch (error) {
    return json({ success: false, message: 'Errore disattivazione articolo.', error: error.message }, 500)
  }
}
