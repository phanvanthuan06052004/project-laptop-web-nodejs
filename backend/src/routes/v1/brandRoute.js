import express from 'express'
import { brandController } from '~/controllers/brandController.js'
import { brandValidation } from '~/validations/brandValidation.js'
import { authMiddlewares } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(brandValidation.getAll, brandController.getAll)
  .post(authMiddlewares.authentication, brandValidation.createNew, brandController.createNew)

Router.route('/:id')
  .get(authMiddlewares.authentication, brandValidation.getBrandById, brandController.getBrandById)
  .put(authMiddlewares.authentication, brandValidation.updateBrand, brandController.updateBrand)
  .delete(authMiddlewares.authentication, brandValidation.deleteBrand, brandController.deleteBrand)

export const brandRoute = Router