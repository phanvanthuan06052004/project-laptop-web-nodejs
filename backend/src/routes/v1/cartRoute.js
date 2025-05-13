import express from 'express'
import { cartController } from '~/controllers/cartController'
import { authMiddlewares } from '~/middlewares/authMiddleware'
import { cartValidation } from '~/validations/cartValidation'

const Router = express.Router()


Router.use(authMiddlewares.authentication)

// Lấy tất cả giỏ hàng của người dùng
Router.route('/').get(cartValidation.getAll, cartController.getAll)
Router.route('/all').get(cartController.countItemCart)


// Lấy chi tiết giỏ hàng bằng userId
// Xóa toàn bộ giỏ hàng
Router.route('/:userId')
  .get(cartController.getByUserId)
  .delete(cartController.deleteCart)

// Thêm hoặc cập nhật sản phẩm trong giỏ hàng
Router.route('/items').post(cartController.addItem)

// Cập nhật số lượng sản phẩm trong giỏ hàng
// Xóa sản phẩm khỏi giỏ hàng
Router.route('/items/:cartItemId')
  .put(cartController.updateQuantity)
  .delete(cartController.deleteItem)


export const cartRoute = Router
