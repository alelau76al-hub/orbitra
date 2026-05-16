import {
  createAdminSession,
  getAdminAuthSetupState,
  json,
  logAdminActivity,
  normalizeEmail,
  readBody,
  verifyPassword,
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
        authenticated: false,
        migration_required: true,
        message: setup.message,
      },
      503,
    )
  }

  if (setup.bootstrap_required) {
    return json(
      {
        success: false,
        bootstrap_required: true,
        legacy_users_without_password: setup.legacy_users_without_password,
        message: 'Prima configura il primo owner.',
      },
      409,
    )
  }

  const body = await readBody(request)
  const email = normalizeEmail(body.email)
  const password = String(body.password || '')

  if (!email || !password) {
    return json({ success: false, message: 'Email e password sono obbligatorie.' }, 400)
  }

  const user = await env.DB.prepare(`
    SELECT
      id,
      name,
      email,
      role,
      active,
      password_hash,
      password_salt,
      password_iterations
    FROM admin_users
    WHERE email = ?
      AND active = 1
    LIMIT 1
  `)
    .bind(email)
    .first()

  if (!user || !(await verifyPassword(password, user))) {
    return json({ success: false, message: 'Credenziali non valide.' }, 401)
  }

  await env.DB.prepare(`
    UPDATE admin_users
    SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
    .bind(user.id)
    .run()

  const session = await createAdminSession(env, user.id, request)
  await logAdminActivity(env, 'login', 'admin_user', user.id, `Login admin ${user.email}.`)

  return json(
    {
      success: true,
      authenticated: true,
      user: publicUser(user),
      expires_at: session.expires_at,
      message: 'Login effettuato.',
    },
    200,
    {
      'Set-Cookie': session.cookie,
    },
  )
}
