import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddeware'
import { userValidation } from '~/validations/userValidation'
import { uploadRoute } from './uploadRoute'


const Router = express.Router()

// API to register account
Router.route('/auth/register')
  .post(userValidation.createNew, userController.createNew)

// api to login
Router.route('/auth/')
  .post(userValidation.signIn, userController.signIn)

// api handle refresh token
Router.route('/auth/refresh-token')
  .post(userValidation.refreshToken, userController.refreshToken)

// api to upload image
Router.use('/upload', uploadRoute)

// api get user profile, update user profile
Router.route('/profile')
  .get(authMiddlewares.authentication, userController.getUserProfile)
  .put(authMiddlewares.authentication, userValidation.updateUser, userController.updateUser) // update by token in authentication

// api to logout
Router.route('/auth/logout')
  .delete(authMiddlewares.authentication, userController.logout)

// get all user
Router.route('/')
  .get(authMiddlewares.authentication, userValidation.getAll, userController.getAll)

// get detail, update, and delete user
Router.route('/:id')
  .put(userValidation.updateUserByUserId, userController.updateUserByUserId) // update by param id
  .get(userValidation.getUserById, userController.getUserById)
  .delete(authMiddlewares.authentication, authMiddlewares.authorization, userValidation.deleteAccount, userController.deleteAccount)


export const userRoute = Router
