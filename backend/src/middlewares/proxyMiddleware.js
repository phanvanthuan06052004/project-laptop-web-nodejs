import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Middleware cho Route-level
const restrictTo = (allowedRoles = ['admin'], additionalConditions = {}) => {
  return async (req, res, next) => {
    const checkRoleAccess = (req, allowedRoles, conditions) => {
      if (!req.userRole) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'User role not found')
      }
      const isRoleAllowed = allowedRoles.includes(req.userRole)
      const isConditionMet = conditions.organizationId
        ? req.userOrganization === conditions.organizationId
        : true
      return isRoleAllowed && isConditionMet
    }

    if (allowedRoles.length === 0 || checkRoleAccess(req, allowedRoles, additionalConditions)) {
      return next()
    } else {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Access denied'))
    }
  }
}

// Proxy cho Controller-level
const proxyMiddleware = (controller) => {
  const wrapMethod = (method, allowedRoles = ['admin'], additionalConditions = {}) => async (req, res, next) => {
    const checkRoleAccess = (req, allowedRoles, conditions) => {
      if (!req.userRole) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'User role not found')
      }
      const isRoleAllowed = allowedRoles.includes(req.userRole)
      const isConditionMet = conditions.organizationId
        ? req.userOrganization === conditions.organizationId
        : true
      return isRoleAllowed && isConditionMet
    }

    if (allowedRoles.length === 0 || checkRoleAccess(req, allowedRoles, additionalConditions)) {
      try {
        return await method(req, res, next)
      } catch (error) {
        next(error)
      }
    } else {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Access denied'))
    }
  }

  const proxiedController = {}
  for (const [key, method] of Object.entries(controller)) {
    const { proxyConfig = {} } = method
    const { allowedRoles = ['admin'], additionalConditions = {} } = proxyConfig
    proxiedController[key] = wrapMethod(method.handler || method, allowedRoles, additionalConditions)
  }

  return proxiedController
}

export default proxyMiddleware
export { restrictTo }