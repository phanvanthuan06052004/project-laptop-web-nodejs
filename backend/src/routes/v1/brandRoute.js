// ~/routes/brandRoute.js
import express from 'express'
import { brandController } from '~/controllers/brandController.js'
import { brandValidation } from '~/validations/brandValidation.js'
import { authMiddlewares } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Route to get all brands with pagination, filtering, and sorting
Router.route('/')
  .get(brandValidation.getAll, brandController.getAll)
  .post(authMiddlewares.authentication, authMiddlewares.authorization, brandValidation.createNew, brandController.createNew) // Route to create a new brand

// Route to get a brand by ID
Router.route('/:id')
  .get(authMiddlewares.authentication, authMiddlewares.authorization, brandValidation.getBrandById, brandController.getBrandById)
  .put(authMiddlewares.authentication, authMiddlewares.authorization, brandValidation.updateBrand, brandController.updateBrand) // Route to update a brand by ID
  .delete(authMiddlewares.authentication, authMiddlewares.authorization, brandValidation.deleteBrand, brandController.deleteBrand) // Route to delete a brand by ID

export const brandRoute = Router