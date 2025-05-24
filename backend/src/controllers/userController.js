import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService.js'
import proxyMiddleware from '~/middlewares/proxyMiddleware.js'
import ms from 'ms'

const originalController = {
  createNew: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const newUser = await userService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(newUser)
      } catch (error) {
        next(error)
      }
    }
  },
  signIn: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const newUser = await userService.signIn(req.body, res)
        res.status(StatusCodes.OK).json(newUser)
      } catch (error) {
        next(error)
      }
    }
  },
  refreshToken: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const newAccessToken = await userService.refreshToken(req.cookies['refreshToken'])
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: ms('14 days')
        })
        res.status(StatusCodes.OK).json({
          message: 'Access Token generated again',
          accessToken: newAccessToken
        })
      } catch (error) {
        next(error)
      }
    }
  },
  logout: {
    proxyConfig: { allowedRoles: ['admin', 'member', 'staff'] },
    handler: async (req, res, next) => {
      try {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(StatusCodes.OK).json({ message: 'Logout successful' })
      } catch (error) {
        next(error)
      }
    }
  },
  getUserProfile: {
    proxyConfig: { allowedRoles: ['admin', 'member', 'staff'] },
    handler: async (req, res, next) => {
      try {
        const result = await userService.getUserById(req.userId)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  updateUser: {
    proxyConfig: { allowedRoles: ['admin', 'member', 'staff'] },
    handler: async (req, res, next) => {
      try {
        const result = await userService.updateUser(req.params.id, req.body)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  getAll: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const result = await userService.getAll(req.query)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  getUserById: {
    proxyConfig: { allowedRoles: ['admin', 'member', 'staff'] },
    handler: async (req, res, next) => {
      try {
        const result = await userService.getUserById(req.params.id)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  updateUserByUserId: {
    proxyConfig: { allowedRoles: ['admin', 'member', 'staff'] },
    handler: async (req, res, next) => {
      try {
        const result = await userService.updateUser(req.userId, req.body)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  deleteAccount: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const result = await userService.deleteAccount(req.params.id)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  forgotPassword: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const result = await userService.forgotPassword(req.body.email)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  confirmCode: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const result = await userService.confirmCode(req.body.email, req.body.code)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  resetPassword: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const { email, newPassword } = req.body
        const result = await userService.resetPassword(email, newPassword)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  }
}

export const userController = proxyMiddleware(originalController)