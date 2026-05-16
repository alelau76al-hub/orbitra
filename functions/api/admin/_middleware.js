import {
  canManageOrders,
  canManageUsers,
  canViewSensitiveSettings,
  canWriteAdminArea,
  canWriteCommerce,
  canWriteContent,
  isReadMethod,
  logAdminActivity,
  permissionDeniedResponse,
  requireAdminSession,
} from '../../_shared/admin-auth.js'

const sensitiveReadPaths = new Set([
  '/api/admin/activity',
  '/api/admin/payments',
  '/api/admin/settings',
  '/api/admin/users',
])

const usersPaths = new Set(['/api/admin/users'])
const settingsPaths = new Set(['/api/admin/settings', '/api/admin/payments'])
const orderPaths = new Set(['/api/admin/orders'])
const commercePaths = new Set([
  '/api/admin/products',
  '/api/admin/collections',
])
const contentPaths = new Set([
  '/api/admin/media',
  '/api/admin/pages',
  '/api/admin/section',
  '/api/admin/menus',
])

function pathMatches(pathname, paths) {
  return [...paths].some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function canAccessAdminPath(user, request) {
  const { method } = request
  const pathname = new URL(request.url).pathname
  const readOnly = isReadMethod(method)

  if (readOnly) {
    if (pathMatches(pathname, sensitiveReadPaths)) {
      return canViewSensitiveSettings(user)
    }

    return true
  }

  if (pathMatches(pathname, usersPaths)) return canManageUsers(user)
  if (pathMatches(pathname, settingsPaths)) return canViewSensitiveSettings(user)
  if (pathMatches(pathname, orderPaths)) return canManageOrders(user)
  if (pathMatches(pathname, commercePaths)) return canWriteCommerce(user)
  if (pathMatches(pathname, contentPaths)) return canWriteContent(user)

  return canWriteAdminArea(user)
}

async function logPermissionDenied(env, user, request) {
  try {
    const pathname = new URL(request.url).pathname
    await logAdminActivity(
      env,
      'permission_denied',
      'admin_api',
      user?.id,
      `Permesso negato: ${request.method} ${pathname} per ${user?.email || 'admin'} (${user?.role || 'unknown'}).`,
    )
  } catch {}
}

export async function onRequest(context) {
  const { env, request } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS' || url.pathname.startsWith('/api/admin/auth/')) {
    return context.next()
  }

  const auth = await requireAdminSession(context)
  if (auth instanceof Response) return auth

  if (!canAccessAdminPath(auth.user, request)) {
    await logPermissionDenied(env, auth.user, request)
    return permissionDeniedResponse()
  }

  context.data = {
    ...(context.data || {}),
    adminUser: auth.user,
  }

  return context.next()
}
