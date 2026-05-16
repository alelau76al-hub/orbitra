import {
  canManageUsers,
  getAdminSession,
  hashPassword,
  logAdminActivity,
  validatePassword,
} from '../../../_shared/admin-auth.js'

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
    password: String(body.password || ''),
  }
}

async function logActivity(env, action, entityId, description) {
  await logAdminActivity(env, action, 'admin_user', entityId, description)
}

function forbidden() {
  return json({ success: false, message: 'Permessi insufficienti.' }, 403)
}

async function getCurrentAdmin(request, env, data) {
  if (data?.adminUser) return data.adminUser

  const session = await getAdminSession(request, env)
  return session.authenticated ? session.user : null
}

async function requireUserManager(request, env, data) {
  const currentAdmin = await getCurrentAdmin(request, env, data)
  return canManageUsers(currentAdmin) ? currentAdmin : null
}

async function getAdminUserById(env, id) {
  return env.DB.prepare(`
    SELECT id, name, email, role, active
    FROM admin_users
    WHERE id = ?
    LIMIT 1
  `)
    .bind(id)
    .first()
}

async function countOtherActiveOwners(env, id) {
  const row = await env.DB.prepare(`
    SELECT COUNT(*) AS total
    FROM admin_users
    WHERE active = 1
      AND role = 'owner'
      AND id != ?
  `)
    .bind(id)
    .first()

  return Number(row?.total || 0)
}

async function wouldRemoveLastOwner(env, existingUser, nextUser) {
  if (!existingUser || existingUser.role !== 'owner' || Number(existingUser.active) === 0) {
    return false
  }

  const removesOwnerAccess = nextUser.role !== 'owner' || Number(nextUser.active) === 0
  if (!removesOwnerAccess) return false

  return (await countOtherActiveOwners(env, existingUser.id)) === 0
}

export async function onRequestGet({ request, env, data }) {
  const currentAdmin = await requireUserManager(request, env, data)
  if (!currentAdmin) return forbidden()

  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        name,
        email,
        role,
        active,
        last_login_at,
        CASE WHEN password_hash IS NOT NULL AND password_hash != '' THEN 1 ELSE 0 END AS has_password,
        created_at,
        updated_at
      FROM admin_users
      ORDER BY active DESC, role ASC, name ASC
    `).all()

    return json({ success: true, users: results || [] })
  } catch {
    return json({ success: false, message: 'Errore caricamento utenti. Verifica la configurazione admin.' }, 500)
  }
}

export async function onRequestPost({ request, env, data }) {
  const currentAdmin = await requireUserManager(request, env, data)
  if (!currentAdmin) return forbidden()

  try {
    const user = normalizeUser(await readBody(request))

    if (!user.name || !user.email || !user.email.includes('@')) {
      return json({ success: false, message: 'Nome ed email valida sono obbligatori.' }, 400)
    }

    const passwordValidation = validatePassword(user.password)
    if (!passwordValidation.valid) {
      return json({ success: false, message: passwordValidation.message }, 400)
    }

    const passwordData = await hashPassword(user.password)

    const inserted = await env.DB.prepare(`
      INSERT INTO admin_users (
        name,
        email,
        role,
        active,
        password_hash,
        password_salt,
        password_iterations
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        user.name,
        user.email,
        user.role,
        user.active,
        passwordData.password_hash,
        passwordData.password_salt,
        passwordData.password_iterations,
      )
      .run()

    await logActivity(
      env,
      'create',
      inserted.meta.last_row_id,
      `Utente admin ${user.email} creato da ${currentAdmin.email}.`,
    )
    return json({ success: true, message: 'Utente creato.' })
  } catch {
    return json({ success: false, message: 'Errore creazione utente. Verifica che email e dati siano validi.' }, 500)
  }
}

export async function onRequestPut({ request, env, data }) {
  const currentAdmin = await requireUserManager(request, env, data)
  if (!currentAdmin) return forbidden()

  try {
    const user = normalizeUser(await readBody(request))

    if (!user.id || !user.name || !user.email || !user.email.includes('@')) {
      return json({ success: false, message: 'Dati utente non validi.' }, 400)
    }

    const existingUser = await getAdminUserById(env, user.id)
    if (!existingUser) {
      return json({ success: false, message: 'Utente non trovato.' }, 404)
    }

    if (await wouldRemoveLastOwner(env, existingUser, user)) {
      return json(
        {
          success: false,
          message: 'Non puoi disattivare o cambiare ruolo all\'ultimo owner attivo.',
        },
        400,
      )
    }

    if (user.password) {
      const passwordValidation = validatePassword(user.password)
      if (!passwordValidation.valid) {
        return json({ success: false, message: passwordValidation.message }, 400)
      }

      const passwordData = await hashPassword(user.password)

      await env.DB.prepare(`
        UPDATE admin_users
        SET
          name = ?,
          email = ?,
          role = ?,
          active = ?,
          password_hash = ?,
          password_salt = ?,
          password_iterations = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(
          user.name,
          user.email,
          user.role,
          user.active,
          passwordData.password_hash,
          passwordData.password_salt,
          passwordData.password_iterations,
          user.id,
        )
        .run()
    } else {
      await env.DB.prepare(`
        UPDATE admin_users
        SET name = ?, email = ?, role = ?, active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(user.name, user.email, user.role, user.active, user.id)
        .run()
    }

    if (existingUser.role !== user.role) {
      await logActivity(
        env,
        'role_change',
        user.id,
        `Ruolo utente admin ${user.email} cambiato da ${existingUser.role} a ${user.role} da ${currentAdmin.email}.`,
      )
    }

    if (Number(existingUser.active) !== 0 && Number(user.active) === 0) {
      await logActivity(
        env,
        'disable',
        user.id,
        `Utente admin ${user.email} disattivato da ${currentAdmin.email}.`,
      )
    } else {
      await logActivity(env, 'update', user.id, `Utente admin ${user.email} aggiornato da ${currentAdmin.email}.`)
    }

    return json({ success: true, message: 'Utente aggiornato.' })
  } catch {
    return json({ success: false, message: 'Errore aggiornamento utente. Verifica i dati e riprova.' }, 500)
  }
}

export async function onRequestDelete({ request, env, data }) {
  const currentAdmin = await requireUserManager(request, env, data)
  if (!currentAdmin) return forbidden()

  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID utente mancante.' }, 400)

    const existingUser = await getAdminUserById(env, id)
    if (!existingUser) {
      return json({ success: false, message: 'Utente non trovato.' }, 404)
    }

    if (await wouldRemoveLastOwner(env, existingUser, { role: existingUser.role, active: 0 })) {
      return json(
        {
          success: false,
          message: 'Non puoi disattivare l\'ultimo owner attivo.',
        },
        400,
      )
    }

    await env.DB.prepare('UPDATE admin_users SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, `Utente admin ${existingUser.email} disattivato da ${currentAdmin.email}.`)
    return json({ success: true, message: 'Utente disattivato.' })
  } catch {
    return json({ success: false, message: 'Errore disattivazione utente.' }, 500)
  }
}
