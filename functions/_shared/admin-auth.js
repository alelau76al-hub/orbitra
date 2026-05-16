export const ADMIN_SESSION_COOKIE = 'orbitra_admin_session'

export const ADMIN_ROLES = new Set(['owner', 'admin', 'editor', 'viewer'])

const PASSWORD_ITERATIONS = 50000
const SESSION_TTL_SECONDS = 60 * 60 * 12

export class PasswordHashError extends Error {
  constructor(debugStep) {
    super('Password hash failed')
    this.name = 'PasswordHashError'
    this.debug_step = debugStep
  }
}

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

function getWebCrypto() {
  if (!globalThis.crypto?.subtle || typeof globalThis.crypto.getRandomValues !== 'function') {
    throw new Error('Web Crypto unavailable')
  }

  return globalThis.crypto
}

function randomBytes(length) {
  const bytes = new Uint8Array(length)
  getWebCrypto().getRandomValues(bytes)
  return bytes
}

async function digestHex(value) {
  const digest = await getWebCrypto().subtle.digest('SHA-256', stringToBytes(value))
  return bytesToHex(new Uint8Array(digest))
}

export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function hexToBytes(value = '') {
  const hex = String(value || '').trim().toLowerCase()

  if (!hex || hex.length % 2 !== 0 || !/^[0-9a-f]+$/.test(hex)) {
    throw new Error('Invalid hex data')
  }

  const bytes = new Uint8Array(hex.length / 2)

  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16)
  }

  return bytes
}

export function stringToBytes(value = '') {
  return new TextEncoder().encode(String(value))
}

export function concatBytes(...arrays) {
  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0

  arrays.forEach((array) => {
    result.set(array, offset)
    offset += array.length
  })

  return result
}

async function digestBytes(bytes) {
  let webCrypto = null

  try {
    webCrypto = getWebCrypto()
  } catch {
    throw new PasswordHashError('HASH_UNAVAILABLE')
  }

  try {
    return new Uint8Array(await webCrypto.subtle.digest('SHA-256', bytes))
  } catch {
    throw new PasswordHashError('DIGEST_FAILED')
  }
}

async function derivePasswordHash(password, saltBytes, iterations = PASSWORD_ITERATIONS) {
  const normalizedIterations = Number(iterations || PASSWORD_ITERATIONS)
  const passwordBytes = stringToBytes(password)
  let hashBytes = new Uint8Array()
  let hashInput = concatBytes(passwordBytes, saltBytes)

  for (let index = 0; index < normalizedIterations; index += 1) {
    hashBytes = await digestBytes(hashInput)
    hashInput = concatBytes(hashBytes, passwordBytes, saltBytes)
  }

  return hashBytes
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

export async function createPasswordHash(password) {
  let webCrypto = null

  try {
    webCrypto = getWebCrypto()
  } catch {
    throw new PasswordHashError('HASH_UNAVAILABLE')
  }

  const iterations = PASSWORD_ITERATIONS
  const saltBytes = webCrypto.getRandomValues(new Uint8Array(16))
  const hashBytes = await derivePasswordHash(password, saltBytes, iterations)
  const passwordHash = bytesToHex(hashBytes)
  const passwordSalt = bytesToHex(saltBytes)

  if (passwordHash.length !== 64 || passwordSalt.length !== 32) {
    throw new PasswordHashError('HASH_RESULT_INVALID')
  }

  return {
    password_hash: passwordHash,
    password_salt: passwordSalt,
    password_iterations: iterations,
  }
}

export async function hashPassword(password) {
  return createPasswordHash(password)
}

export async function verifyPassword(password, saltHexOrUser, hashHex, iterations = PASSWORD_ITERATIONS) {
  const saltHex =
    typeof saltHexOrUser === 'object'
      ? saltHexOrUser?.password_salt
      : saltHexOrUser
  const expectedHashHex =
    typeof saltHexOrUser === 'object'
      ? saltHexOrUser?.password_hash
      : hashHex
  const passwordIterations =
    typeof saltHexOrUser === 'object'
      ? saltHexOrUser?.password_iterations
      : iterations

  if (!saltHex || !expectedHashHex) return false

  try {
    const saltBytes = hexToBytes(saltHex)
    const expectedHashBytes = hexToBytes(expectedHashHex)
    const actualHashBytes = await derivePasswordHash(
      password,
      saltBytes,
      Number(passwordIterations || PASSWORD_ITERATIONS),
    )

    if (actualHashBytes.length !== expectedHashBytes.length) return false

    let difference = 0
    for (let index = 0; index < actualHashBytes.length; index += 1) {
      difference |= actualHashBytes[index] ^ expectedHashBytes[index]
    }

    return difference === 0
  } catch {
    return false
  }
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
    await env.DB.prepare('SELECT id FROM admin_sessions LIMIT 1').first()

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

  const tokenHash = await digestHex(token)
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
  const token = bytesToHex(randomBytes(32))
  const tokenHash = await digestHex(token)
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

  const tokenHash = await digestHex(token)
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
