import express from 'express'
import { userController } from '~/controllers/userController.js'
import { authMiddlewares } from '~/middlewares/authMiddleware.js'
import { userValidation } from '~/validations/userValidation.js'
import { uploadRoute } from './uploadRoute'

const Router = express.Router()

Router.route('/auth/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/auth/')
  .post(userValidation.signIn, userController.signIn)

Router.route('/auth/refresh-token')
  .post(userValidation.refreshToken, userController.refreshToken)

Router.route('/auth/forgot-password')
  .post(userValidation.forgotPassword, userController.forgotPassword)

Router.route('/auth/confirm-code')
  .post(userValidation.confirmCode, userController.confirmCode)

Router.route('/auth/reset-password')
  .post(userValidation.resetPassword, userController.resetPassword)

Router.use('/upload', uploadRoute)

Router.route('/profile')
  .get(authMiddlewares.authentication, userController.getUserProfile)
  .put(authMiddlewares.authentication, userValidation.updateUser, userController.updateUserByUserId)

Router.route('/auth/logout')
  .delete(authMiddlewares.authentication, userController.logout)

Router.route('/')
  .get(authMiddlewares.authentication, userValidation.getAll, userController.getAll)

Router.route('/:id')
  .put(authMiddlewares.authentication, userValidation.updateUser, userController.updateUser)
  .get(authMiddlewares.authentication, userValidation.getUserById, userController.getUserById)
  .delete(authMiddlewares.authentication, userValidation.deleteAccount, userController.deleteAccount)

export const userRoute = Router