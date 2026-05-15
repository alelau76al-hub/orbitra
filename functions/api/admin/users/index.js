function json(data, status = 200) {
  return Response.json(data, { status })
}

const roles = new Set(['owner', 'admin', 'editor', 'viewer'])

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase()
}

function normalizeUser(body = {}) {
  return {
    id: body.id ? Number(body.id) : null,
    name: String(body.name || '').trim(),
    email: normalizeEmail(body.email),
    role: roles.has(body.role) ? body.role : 'viewer',
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'admin_user', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, name, email, role, active, created_at, updated_at
      FROM admin_users
      ORDER BY active DESC, role ASC, name ASC
    `).all()

    return json({ success: true, users: results || [] })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento utenti. Verifica la migration 0009.', error: error.message }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const user = normalizeUser(await readBody(request))

    if (!user.name || !user.email || !user.email.includes('@')) {
      return json({ success: false, message: 'Nome ed email valida sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO admin_users (name, email, role, active)
      VALUES (?, ?, ?, ?)
    `)
      .bind(user.name, user.email, user.role, user.active)
      .run()

    await logActivity(env, 'create', inserted.meta.last_row_id, `Utente admin ${user.email} creato.`)
    return json({ success: true, message: 'Utente creato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore creazione utente.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const user = normalizeUser(await readBody(request))

    if (!user.id || !user.name || !user.email || !user.email.includes('@')) {
      return json({ success: false, message: 'Dati utente non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE admin_users
      SET name = ?, email = ?, role = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(user.name, user.email, user.role, user.active, user.id)
      .run()

    await logActivity(env, 'update', user.id, `Utente admin ${user.email} aggiornato.`)
    return json({ success: true, message: 'Utente aggiornato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento utente.', error: error.message }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID utente mancante.' }, 400)

    await env.DB.prepare('UPDATE admin_users SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, 'Utente admin disattivato.')
    return json({ success: true, message: 'Utente disattivato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore disattivazione utente.', error: error.message }, 500)
  }
}
