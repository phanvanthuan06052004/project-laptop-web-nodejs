import { StatusCodes } from 'http-status-codes'

const proxyMiddleware = (controller) => {
  const checkRoleAccess = (req, allowedRoles) => {
    if (!req.userRole) {
      return false
    }
    return allowedRoles.includes(req.userRole)
  }

  const wrapMethod = (method, allowedRoles = ['admin']) => async (req, res, next) => {
    // Kiểm tra quyền truy cập dựa trên vai trò
    if (allowedRoles.length === 0 || checkRoleAccess(req, allowedRoles)) {
      try {
        return await method(req, res, next)
      } catch (error) {
        next(error)
      }
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' })
    }
  }

  const proxiedController = {}
  for (const [key, method] of Object.entries(controller)) {
    const { proxyConfig = {} } = method
    const { allowedRoles = ['admin'] } = proxyConfig
    proxiedController[key] = wrapMethod(method.handler, allowedRoles)
  }

  return proxiedController
}

export default proxyMiddleware