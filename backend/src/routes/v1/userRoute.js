import express from 'express'
import { userController } from '~/controllers/userController.js'
import { authMiddlewares } from '~/middlewares/authMiddleware.js'
import { userValidation } from '~/validations/userValidation.js'
import { uploadRoute } from './uploadRoute'

const Router = express.Router()

// API to register account
Router.route('/auth/register')
  .post(userValidation.createNew, userController.createNew)

// API to login
Router.route('/auth/')
  .post(userValidation.signIn, userController.signIn)

// API handle refresh token
Router.route('/auth/refresh-token')
  .post(userValidation.refreshToken, userController.refreshToken)

Router.route('/auth/forgot-password')
  .post(userValidation.forgotPassword, userController.forgotPassword)

Router.route('/auth/reset-password')
  .post(userValidation.resetPassword, userController.resetPassword)

Router.use('/upload', uploadRoute)

// API get user profile, update user profile
Router.route('/profile')
  .get(authMiddlewares.authentication, userController.getUserProfile)
  .put(authMiddlewares.authentication, userValidation.updateUser, userController.updateUser)

// API to logout
Router.route('/auth/logout')
  .delete(authMiddlewares.authentication, userController.logout)

// Get all users
Router.route('/')
  .get(authMiddlewares.authentication, userValidation.getAll, userController.getAll)

// Get detail, update, and delete user
Router.route('/:id')
  .put(userValidation.updateUserByUserId, userController.updateUserByUserId)
  .get(userValidation.getUserById, userController.getUserById)
  .delete(authMiddlewares.authentication, userValidation.deleteAccount, userController.deleteAccount)

export const userRoute = Router