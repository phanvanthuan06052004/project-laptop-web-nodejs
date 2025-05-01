import express from 'express'
import { productController } from '~/controllers/productController.js'
import { productValidation } from '~/validations/productValidation.js'
// import { authMiddlewares } from '~/middlewares/authMiddleware'; // Nếu cần bảo vệ route

const Router = express.Router()

// Route to get all products with pagination, filtering, and sorting
Router.route('/')
    .get(productValidation.getAll, productController.getAll)

// Route to get products with pagination and filter
Router.route('/all')
    .get(productValidation.getPageProduct, productController.getPageProduct)

// Route to create a new product
Router.route('/')
    .post(productValidation.createNew, productController.createNew)

// Route to get a product by ID
Router.route('/:id')
    .get(productValidation.getProductById, productController.getProductById)

// Route to update a product by ID
Router.route('/:id')
    .put(productValidation.updateProduct, productController.updateProduct)

// Route to delete a product by ID (soft delete)
Router.route('/:id')
    .delete(productValidation.deleteProduct, productController.deleteProduct)

// Route to get product by name slug
Router.route('/slug/:nameSlug')
    .get(productValidation.getByNameSlug, productController.getProductByNameSlug)


export const productRoute = Router
