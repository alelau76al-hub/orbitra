import {
  expiredSessionCookie,
  getAdminSession,
  getSessionToken,
  json,
  logAdminActivity,
  revokeAdminSession,
} from '../../../../_shared/admin-auth.js'

async function handleLogout({ request, env }) {
  const token = getSessionToken(request)
  const session = await getAdminSession(request, env)

  try {
    await revokeAdminSession(env, token)

    if (session.authenticated) {
      await logAdminActivity(
        env,
        'logout',
        'admin_user',
        session.user.id,
        `Logout admin ${session.user.email}.`,
      )
    }
  } catch {}

  return json(
    {
      success: true,
      authenticated: false,
      message: 'Logout effettuato.',
    },
    200,
    {
      'Set-Cookie': expiredSessionCookie(request),
    },
  )
}

export async function onRequestPost(context) {
  try {
    return await handleLogout(context)
  } catch {
    return json(
      {
        success: false,
        authenticated: false,
        message: 'Logout non riuscito. Riprova tra poco.',
      },
      500,
    )
  }
}
