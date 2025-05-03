import express from 'express'
import { cartController } from '~/controllers/cartController'
import { cartValidation } from '~/validations/cartValidation'

const Router = express.Router()

// Lấy tất cả giỏ hàng của người dùng
Router.route('/')
  .get(cartValidation.getAll, cartController.getAll)

// Lấy chi tiết giỏ hàng bằng userId
// Xóa toàn bộ giỏ hàng
Router.route('/:userId')
  .get(cartValidation.getByUserId, cartController.getByUserId)
  .delete(cartValidation.deleteCart, cartController.deleteCart)


// Thêm hoặc cập nhật sản phẩm trong giỏ hàng
Router.route('/items')
  .post(cartValidation.addItem, cartController.addItem)

// Cập nhật số lượng sản phẩm trong giỏ hàng
// Xóa sản phẩm khỏi giỏ hàng
Router.route('/items/:cartItemId')
  .put(cartValidation.updateQuantity, cartController.updateQuantity)
  .delete(cartValidation.deleteItem, cartController.deleteItem)

export const cartRoute = Router