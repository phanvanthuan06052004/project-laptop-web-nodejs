import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService.js'
import proxyMiddleware from '~/middlewares/proxyMiddleware.js'
import ms from 'ms'

const originalController = {
  createNew: {
    proxyConfig: { allowedRoles: [] }, // Public access
    async handler(req, res, next) {
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
    async handler(req, res, next) {
      try {
        const newUser = await userService.signIn(req.body, res)
        res.status(StatusCodes.OK).json(newUser)
      } catch (error) {
        next(error)
      }
    }
  },

  refreshToken: {
    proxyConfig: { allowedRoles: ['admin', 'member', 'staff'] }, // Authenticated users
    async handler(req, res) {
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Please login again' })
      }
    }
  },

  logout: {
    proxyConfig: { allowedRoles: ['admin', 'member', 'staff'] },
    async handler(req, res) {
      try {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
      }
    }
  },

  getUserProfile: {
    proxyConfig: { allowedRoles: ['admin', 'member', 'staff'] },
    async handler(req, res, next) {
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
    async handler(req, res, next) {
      try {
        const result = await userService.updateUser(req.userId, req.body)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },

  getAll: {
    proxyConfig: { allowedRoles: ['admin'] },
    async handler(req, res, next) {
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
    async handler(req, res, next) {
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
    async handler(req, res, next) {
      try {
        const result = await userService.updateUser(req.params.id, req.body)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },

  deleteAccount: {
    proxyConfig: { allowedRoles: ['admin'] },
    async handler(req, res, next) {
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
    async handler(req, res, next) {
      try {
        const result = await userService.forgotPassword(req.body.email)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },

  resetPassword: {
    proxyConfig: { allowedRoles: [] }, // Public access
    async handler(req, res, next) {
      try {
        const { email, code, newPassword } = req.body
        const result = await userService.resetPassword(email, code, newPassword)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  }
}

export const userController = proxyMiddleware(originalController)