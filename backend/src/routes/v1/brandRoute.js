// ~/routes/brandRoute.js
import express from 'express'
import { brandController } from '~/controllers/brandController.js'
import { brandValidation } from '~/validations/brandValidation.js'
// import { authMiddlewares } from '~/middlewares/authMiddleware'; // Nếu cần bảo vệ route

const Router = express.Router()

// Route to get all brands with pagination, filtering, and sorting
Router.route('/')
  .get(brandValidation.getAll, brandController.getAll)
  .post(brandValidation.createNew, brandController.createNew) // Route to create a new brand

// Route to get a brand by ID
Router.route('/:id')
  .get(brandValidation.getBrandById, brandController.getBrandById)
  .put(brandValidation.updateBrand, brandController.updateBrand) // Route to update a brand by ID
  .delete(brandValidation.deleteBrand, brandController.deleteBrand) // Route to delete a brand by ID

export const brandRoute = Router