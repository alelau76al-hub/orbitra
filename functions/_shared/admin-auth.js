export const ADMIN_SESSION_COOKIE = 'orbitra_admin_session'

export const ADMIN_ROLES = new Set(['owner', 'admin', 'editor', 'viewer'])

const PASSWORD_ITERATIONS = 150000
const SESSION_TTL_SECONDS = 60 * 60 * 12

export function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers,
  })
}

export function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase()
}

export function normalizeRole(value = 'viewer') {
  return ADMIN_ROLES.has(value) ? value : 'viewer'
}

export async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function bytesToBase64(bytes) {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function base64ToBytes(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function bytesToBase64Url(bytes) {
  return bytesToBase64(bytes)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function randomBytes(length) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

async function digestBase64(value) {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return bytesToBase64(new Uint8Array(digest))
}

async function importPasswordKey(password) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
}

async function derivePasswordHash(password, saltBase64, iterations = PASSWORD_ITERATIONS) {
  const key = await importPasswordKey(password)
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: base64ToBytes(saltBase64),
      iterations,
    },
    key,
    256,
  )
  return bytesToBase64(new Uint8Array(derived))
}

function safeEqual(left = '', right = '') {
  if (left.length !== right.length) return false

  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return difference === 0
}

export function validatePassword(password = '') {
  if (String(password).length < 8) {
    return {
      valid: false,
      message: 'La password deve contenere almeno 8 caratteri.',
    }
  }

  return {
    valid: true,
  }
}

export async function hashPassword(password) {
  const salt = bytesToBase64(randomBytes(16))
  const hash = await derivePasswordHash(password, salt, PASSWORD_ITERATIONS)

  return {
    password_hash: hash,
    password_salt: salt,
    password_iterations: PASSWORD_ITERATIONS,
  }
}

export async function verifyPassword(password, user) {
  if (!user?.password_hash || !user?.password_salt) return false

  const iterations = Number(user.password_iterations || PASSWORD_ITERATIONS)
  const hash = await derivePasswordHash(password, user.password_salt, iterations)
  return safeEqual(hash, user.password_hash)
}

export function getSessionToken(request) {
  const cookie = request.headers.get('Cookie') || ''
  const pairs = cookie.split(';').map((part) => part.trim())

  for (const pair of pairs) {
    const [name, ...valueParts] = pair.split('=')
    if (name === ADMIN_SESSION_COOKIE) {
      return valueParts.join('=')
    }
  }

  return ''
}

function shouldUseSecureCookie(request) {
  try {
    return new URL(request.url).protocol === 'https:'
  } catch {
    return true
  }
}

export function sessionCookie(token, request, maxAge = SESSION_TTL_SECONDS) {
  const secure = shouldUseSecureCookie(request) ? '; Secure' : ''
  return `${ADMIN_SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`
}

export function expiredSessionCookie(request) {
  return sessionCookie('', request, 0)
}

export async function getAdminAuthSetupState(env) {
  try {
    const row = await env.DB.prepare(`
      SELECT
        COUNT(*) AS active_count,
        SUM(CASE WHEN password_hash IS NOT NULL AND password_hash != '' THEN 1 ELSE 0 END) AS auth_user_count
      FROM admin_users
      WHERE active = 1
    `).first()

    const activeCount = Number(row?.active_count || 0)
    const authUserCount = Number(row?.auth_user_count || 0)

    return {
      schema_ready: true,
      active_count: activeCount,
      auth_user_count: authUserCount,
      bootstrap_required: authUserCount === 0,
      legacy_users_without_password: activeCount > 0 && authUserCount === 0,
    }
  } catch (error) {
    return {
      schema_ready: false,
      active_count: 0,
      auth_user_count: 0,
      bootstrap_required: false,
      legacy_users_without_password: false,
      message: 'Schema autenticazione admin non pronto. Applica la migration 0011.',
      error: error.message,
    }
  }
}

export async function getAdminSession(request, env) {
  const setup = await getAdminAuthSetupState(env)

  if (!setup.schema_ready) {
    return {
      authenticated: false,
      migration_required: true,
      setup,
    }
  }

  if (setup.bootstrap_required) {
    return {
      authenticated: false,
      bootstrap_required: true,
      setup,
    }
  }

  const token = getSessionToken(request)
  if (!token) {
    return {
      authenticated: false,
      setup,
    }
  }

  const tokenHash = await digestBase64(token)
  let session = null

  try {
    session = await env.DB.prepare(`
      SELECT
        admin_sessions.id AS session_id,
        admin_sessions.expires_at,
        admin_users.id,
        admin_users.name,
        admin_users.email,
        admin_users.role,
        admin_users.active
      FROM admin_sessions
      INNER JOIN admin_users ON admin_users.id = admin_sessions.admin_user_id
      WHERE admin_sessions.session_token_hash = ?
        AND admin_sessions.revoked_at IS NULL
        AND admin_users.active = 1
        AND admin_users.password_hash IS NOT NULL
      LIMIT 1
    `)
      .bind(tokenHash)
      .first()
  } catch (error) {
    return {
      authenticated: false,
      migration_required: true,
      setup: {
        ...setup,
        message: 'Schema sessioni admin non pronto. Applica la migration 0011.',
        error: error.message,
      },
    }
  }

  if (!session || new Date(session.expires_at).getTime() <= Date.now()) {
    return {
      authenticated: false,
      expired: Boolean(session),
      setup,
    }
  }

  try {
    await env.DB.prepare(`
      UPDATE admin_sessions
      SET last_seen_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(session.session_id)
      .run()
  } catch {}

  return {
    authenticated: true,
    setup,
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      active: session.active,
    },
    session_id: session.session_id,
  }
}

export async function requireAdminSession({ request, env }) {
  const session = await getAdminSession(request, env)

  if (session.authenticated) return session

  if (session.migration_required) {
    return json(
      {
        success: false,
        authenticated: false,
        migration_required: true,
        message: 'Autenticazione admin non configurata. Applica la migration 0011.',
      },
      503,
    )
  }

  if (session.bootstrap_required) {
    return json(
      {
        success: false,
        authenticated: false,
        bootstrap_required: true,
        legacy_users_without_password: session.setup?.legacy_users_without_password || false,
        message: 'Configura il primo owner per proteggere il CMS.',
      },
      401,
    )
  }

  return json(
    {
      success: false,
      authenticated: false,
      message: session.expired
        ? 'Sessione admin scaduta. Effettua di nuovo il login.'
        : 'Login admin richiesto.',
    },
    401,
  )
}

export async function createAdminSession(env, userId, request) {
  const token = bytesToBase64Url(randomBytes(32))
  const tokenHash = await digestBase64(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString()

  await env.DB.prepare(`
    INSERT INTO admin_sessions (
      admin_user_id,
      session_token_hash,
      expires_at,
      last_seen_at
    )
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `)
    .bind(userId, tokenHash, expiresAt)
    .run()

  return {
    token,
    expires_at: expiresAt,
    cookie: sessionCookie(token, request),
  }
}

export async function revokeAdminSession(env, token) {
  if (!token) return

  const tokenHash = await digestBase64(token)
  await env.DB.prepare(`
    UPDATE admin_sessions
    SET revoked_at = CURRENT_TIMESTAMP
    WHERE session_token_hash = ?
  `)
    .bind(tokenHash)
    .run()
}

export async function logAdminActivity(env, action, entityType, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, ?, ?, ?)
    `)
      .bind(action, entityType, String(entityId || ''), description)
      .run()
  } catch {}
}
