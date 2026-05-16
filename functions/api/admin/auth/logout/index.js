import {
  expiredSessionCookie,
  getAdminSession,
  getSessionToken,
  json,
  logAdminActivity,
  revokeAdminSession,
} from '../../../../_shared/admin-auth.js'

export async function onRequestPost({ request, env }) {
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
