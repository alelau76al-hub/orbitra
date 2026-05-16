import { requireAdminSession } from '../../_shared/admin-auth.js'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS' || url.pathname.startsWith('/api/admin/auth/')) {
    return context.next()
  }

  const auth = await requireAdminSession(context)
  if (auth instanceof Response) return auth

  return context.next()
}
