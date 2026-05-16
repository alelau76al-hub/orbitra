import { getAdminAuthSetupState, getAdminSession, json } from '../../../../_shared/admin-auth.js'

function isAdminAuditMode(env) {
  return String(env.ADMIN_AUDIT_MODE || '').toLowerCase() === 'true'
}

async function handleMe({ request, env }) {
  if (isAdminAuditMode(env)) {
    return json({
      success: true,
      authenticated: true,
      user: {
        name: 'Audit Viewer',
        email: 'audit@orbitra.local',
        role: 'viewer',
        audit_mode: true,
      },
    })
  }

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
    return json({
      success: true,
      authenticated: false,
      bootstrap_required: true,
      legacy_users_without_password: setup.legacy_users_without_password,
      message: setup.legacy_users_without_password
        ? 'Utenti admin legacy rilevati senza password. Crea il primo owner autenticabile.'
        : 'Crea il primo owner per proteggere il CMS.',
    })
  }

  const session = await getAdminSession(request, env)

  if (!session.authenticated) {
    return json({
      success: true,
      authenticated: false,
      expired: session.expired || false,
      message: session.expired
        ? 'Sessione scaduta. Effettua di nuovo il login.'
        : 'Login admin richiesto.',
    })
  }

  return json({
    success: true,
    authenticated: true,
    user: session.user,
  })
}

export async function onRequestGet(context) {
  try {
    return await handleMe(context)
  } catch {
    return json(
      {
        success: false,
        authenticated: false,
        message: 'Sessione admin non verificabile. Riprova tra poco.',
      },
      500,
    )
  }
}
