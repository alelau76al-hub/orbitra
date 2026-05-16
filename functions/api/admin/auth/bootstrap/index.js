import {
  createAdminSession,
  createPasswordHash,
  getAdminAuthSetupState,
  json,
  logAdminActivity,
  normalizeEmail,
  PasswordHashError,
  readBody,
  validatePassword,
} from '../../../../_shared/admin-auth.js'

const BOOTSTRAP_ROLE = 'owner'
const BOOTSTRAP_ACTIVE = 1

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

async function handleBootstrap({ request, env }) {
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
        debug_code: 'BOOTSTRAP_ALREADY_CONFIGURED',
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
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_INVALID_INPUT',
        message: 'Nome ed email valida sono obbligatori.',
      },
      400,
    )
  }

  if (!passwordValidation.valid) {
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_INVALID_INPUT',
        message: passwordValidation.message,
      },
      400,
    )
  }

  let passwordData = null

  try {
    passwordData = await createPasswordHash(password)
  } catch (error) {
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_HASH_FAILED',
        debug_step: error instanceof PasswordHashError ? error.debug_step : 'HASH_RESULT_INVALID',
        message: 'Non e stato possibile preparare la password. Riprova tra poco.',
      },
      500,
    )
  }

  if (
    !passwordData?.password_hash ||
    !passwordData?.password_salt ||
    !/^[0-9a-f]{64}$/.test(passwordData.password_hash) ||
    !/^[0-9a-f]{32}$/.test(passwordData.password_salt) ||
    !Number.isFinite(Number(passwordData.password_iterations))
  ) {
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_HASH_FAILED',
        debug_step: 'HASH_RESULT_INVALID',
        message: 'Hash password non valido. Riprova tra poco.',
      },
      500,
    )
  }

  let existing = null

  try {
    existing = await env.DB.prepare(`
      SELECT id
      FROM admin_users
      WHERE email = ?
      LIMIT 1
    `)
      .bind(email)
      .first()
  } catch {
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_INSERT_FAILED',
        message: 'Non e stato possibile verificare gli utenti admin.',
      },
      500,
    )
  }

  let userId = existing?.id

  if (userId) {
    try {
      await env.DB.prepare(`
        UPDATE admin_users
        SET
          name = ?,
          role = ?,
          active = ?,
          password_hash = ?,
          password_salt = ?,
          password_iterations = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(
          name,
          BOOTSTRAP_ROLE,
          BOOTSTRAP_ACTIVE,
          passwordData.password_hash,
          passwordData.password_salt,
          Number(passwordData.password_iterations),
          userId,
        )
        .run()
    } catch {
      return json(
        {
          success: false,
          debug_code: 'BOOTSTRAP_INSERT_FAILED',
          message: 'Non e stato possibile aggiornare il primo owner.',
        },
        500,
      )
    }
  } else {
    try {
      const inserted = await env.DB.prepare(`
        INSERT INTO admin_users (
          name,
          email,
          role,
          active,
          password_hash,
          password_salt,
          password_iterations,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
        .bind(
          name,
          email,
          BOOTSTRAP_ROLE,
          BOOTSTRAP_ACTIVE,
          passwordData.password_hash,
          passwordData.password_salt,
          Number(passwordData.password_iterations),
        )
        .run()

      userId = inserted?.meta?.last_row_id

      if (!userId) {
        const created = await env.DB.prepare(`
          SELECT id
          FROM admin_users
          WHERE email = ?
          LIMIT 1
        `)
          .bind(email)
          .first()

        userId = created?.id
      }
    } catch {
      return json(
        {
          success: false,
          debug_code: 'BOOTSTRAP_INSERT_FAILED',
          message: 'Non e stato possibile creare il primo owner.',
        },
        500,
      )
    }
  }

  if (!userId) {
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_INSERT_FAILED',
        message: 'Owner non creato. Riprova tra poco.',
      },
      500,
    )
  }

  try {
    await env.DB.prepare(`
      UPDATE admin_users
      SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(userId)
      .run()
  } catch {
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_INSERT_FAILED',
        message: 'Owner creato ma aggiornamento login non riuscito.',
      },
      500,
    )
  }

  const user = {
    id: userId,
    name,
    email,
    role: BOOTSTRAP_ROLE,
  }
  let session = null

  try {
    session = await createAdminSession(env, userId, request)
  } catch {
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_SESSION_FAILED',
        message: 'Owner creato, ma sessione admin non creata. Prova a effettuare il login.',
      },
      500,
    )
  }

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
      debug_code: null,
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

export async function onRequestPost(context) {
  try {
    return await handleBootstrap(context)
  } catch {
    return json(
      {
        success: false,
        debug_code: 'BOOTSTRAP_INSERT_FAILED',
        message: 'Bootstrap non riuscito. Verifica la configurazione auth e riprova.',
      },
      500,
    )
  }
}
