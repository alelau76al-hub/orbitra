import {
  createAdminSession,
  getAdminAuthSetupState,
  hashPassword,
  json,
  logAdminActivity,
  normalizeEmail,
  readBody,
  validatePassword,
} from '../../../../_shared/admin-auth.js'

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function onRequestPost({ request, env }) {
  const setup = await getAdminAuthSetupState(env)

  if (!setup.schema_ready) {
    return json(
      {
        success: false,
        migration_required: true,
        message: setup.message,
      },
      503,
    )
  }

  if (!setup.bootstrap_required) {
    return json(
      {
        success: false,
        message: 'Bootstrap gia completato. Effettua il login.',
      },
      409,
    )
  }

  const body = await readBody(request)
  const name = String(body.name || '').trim()
  const email = normalizeEmail(body.email)
  const password = String(body.password || '')
  const passwordValidation = validatePassword(password)

  if (!name || !email || !email.includes('@')) {
    return json({ success: false, message: 'Nome ed email valida sono obbligatori.' }, 400)
  }

  if (!passwordValidation.valid) {
    return json({ success: false, message: passwordValidation.message }, 400)
  }

  const passwordData = await hashPassword(password)
  const existing = await env.DB.prepare(`
    SELECT id
    FROM admin_users
    WHERE email = ?
    LIMIT 1
  `)
    .bind(email)
    .first()

  let userId = existing?.id

  if (userId) {
    await env.DB.prepare(`
      UPDATE admin_users
      SET
        name = ?,
        role = 'owner',
        active = 1,
        password_hash = ?,
        password_salt = ?,
        password_iterations = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        name,
        passwordData.password_hash,
        passwordData.password_salt,
        passwordData.password_iterations,
        userId,
      )
      .run()
  } else {
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
      VALUES (?, ?, 'owner', 1, ?, ?, ?)
    `)
      .bind(
        name,
        email,
        passwordData.password_hash,
        passwordData.password_salt,
        passwordData.password_iterations,
      )
      .run()

    userId = inserted.meta.last_row_id
  }

  await env.DB.prepare(`
    UPDATE admin_users
    SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
    .bind(userId)
    .run()

  const user = {
    id: userId,
    name,
    email,
    role: 'owner',
  }
  const session = await createAdminSession(env, userId, request)

  await logAdminActivity(
    env,
    'bootstrap_owner',
    'admin_user',
    userId,
    `Primo owner autenticabile ${email} creato.`,
  )

  return json(
    {
      success: true,
      authenticated: true,
      user: publicUser(user),
      expires_at: session.expires_at,
      message: 'Owner creato. Admin protetto attivo.',
    },
    201,
    {
      'Set-Cookie': session.cookie,
    },
  )
}
