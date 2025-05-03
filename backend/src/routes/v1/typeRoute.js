// ~/routes/typeRoute.js
import express from 'express'
import { typeController } from '~/controllers/typeController.js'
import { typeValidation } from '~/validations/typeValidation.js'
// import { authMiddlewares } from '~/middlewares/authMiddleware'; // Nếu cần bảo vệ route

const Router = express.Router()

// Route to get all types with pagination, filtering, and sorting
Router.route('/')
  .get(typeValidation.getAll, typeController.getAll)
  .post(typeValidation.createNew, typeController.createNew) // Route to create a new type

// Route to get a type by ID
Router.route('/:id')
  .get(typeValidation.getTypeById, typeController.getTypeById)
  .put(typeValidation.updateType, typeController.updateType) // Route to update a type by ID
  .delete(typeValidation.deleteType, typeController.deleteType) // Route to delete a type by ID

export const typeRoute = Router
