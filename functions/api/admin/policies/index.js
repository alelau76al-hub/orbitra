function json(data, status = 200) {
  return Response.json(data, { status })
}

const policyTypes = new Set([
  'privacy_policy',
  'terms_conditions',
  'refund_policy',
  'shipping_policy',
  'cookie_policy',
])
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

function normalizePolicy(body = {}) {
  const title = String(body.title || '').trim()

  return {
    id: body.id ? Number(body.id) : null,
    type: policyTypes.has(body.type) ? body.type : 'privacy_policy',
    slug: slugify(body.slug || title),
    title,
    content: String(body.content || '').trim(),
    status: statuses.has(body.status) ? body.status : 'draft',
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'policy', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, type, slug, title, content, status, created_at, updated_at
      FROM policies
      ORDER BY type ASC, title ASC
    `).all()

    return json({ success: true, policies: results || [] })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento policy. Verifica la migration 0010.', error: error.message }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const policy = normalizePolicy(await readBody(request))

    if (!policy.title || !policy.slug) {
      return json({ success: false, message: 'Titolo e slug policy sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO policies (type, slug, title, content, status)
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(policy.type, policy.slug, policy.title, policy.content, policy.status)
      .run()

    await logActivity(env, 'create', inserted.meta.last_row_id, `Policy ${policy.title} creata.`)
    return json({ success: true, message: 'Policy creata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore creazione policy.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const policy = normalizePolicy(await readBody(request))

    if (!policy.id || !policy.title || !policy.slug) {
      return json({ success: false, message: 'Dati policy non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE policies
      SET type = ?, slug = ?, title = ?, content = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(policy.type, policy.slug, policy.title, policy.content, policy.status, policy.id)
      .run()

    await logActivity(env, 'update', policy.id, `Policy ${policy.title} aggiornata.`)
    return json({ success: true, message: 'Policy aggiornata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento policy.', error: error.message }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID policy mancante.' }, 400)

    await env.DB.prepare(`
      UPDATE policies
      SET status = 'draft', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    await logActivity(env, 'unpublish', id, 'Policy riportata in bozza.')
    return json({ success: true, message: 'Policy riportata in bozza.' })
  } catch (error) {
    return json({ success: false, message: 'Errore disattivazione policy.', error: error.message }, 500)
  }
}
