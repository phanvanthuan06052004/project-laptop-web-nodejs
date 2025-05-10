import express from 'express'
import { orderController } from '~/controllers/orderController.js'
import { orderValidation } from '~/validations/orderValidation.js'

const router = express.Router()

router.post('/', orderValidation.createNew, orderController.createNew)
router.get('/:id', orderValidation.getById, orderController.getOrderById)
router.get('/user/:id', orderValidation.getById, orderController.getByUserId)
router.get('/', orderValidation.getAll, orderController.getAllOrders)
router.put('/:id', orderValidation.update, orderController.updateOrder)
router.delete('/:id', orderValidation.delete, orderController.deleteOrder)

export const orderRoute = router