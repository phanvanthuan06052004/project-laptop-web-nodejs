import { orderModel } from '~/models/orderModel'
import { productService } from '~/services/productService'
import { couponService } from '~/services/couponService/couponService'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNewOrder = async (orderData) => {
  try {
    //  1. Lấy thông tin chi tiết sản phẩm và tính tổng tiền hàng
    let totalAmount = 0

    for (const item of orderData.items) {
      const product = await productService.getProductById(item.productId)
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Product with id ${item.productId} not found`)
      }

      item.productName = product.displayName
      item.price = product.price
      totalAmount += product.price * item.quantity
    }

    //  2. Áp dụng các coupon (tối đa 3 loại)
    const appliedCoupons = []
    let totalDiscount = 0
    const allowedCouponTypes = ['PRODUCT', 'FREESHIPPING', 'ORDER']

    if (orderData.couponCodes && Array.isArray(orderData.couponCodes)) {
      for (const couponCode of orderData.couponCodes) {
        try {
          const coupon = await couponService.findOneByCode(couponCode)

          //  Kiểm tra loại coupon và xem đã có coupon cùng loại chưa
          if (allowedCouponTypes.includes(coupon.target_type) &&
              !appliedCoupons.some(c => c.type === coupon.target_type)) {

            const { discount } = await couponService.applyCoupon(couponCode, orderData.userId, totalAmount, orderData.shippingCost)
            totalDiscount += discount
            appliedCoupons.push({ code: couponCode, type: coupon.target_type, discount })
          } else {
            console.warn(`Coupon ${couponCode} of type ${coupon.target_type} is not allowed or already applied.`)
          }
        } catch (error) {
          console.warn(`Coupon ${couponCode} could not be applied: ${error.message}`)
        }
        if (appliedCoupons.length >= allowedCouponTypes.length) {
          break // Đã áp dụng đủ 3 loại coupon
        }
      }
    }

    //  3. Tính toán lại totalAmount sau khi áp dụng coupon
    totalAmount -= totalDiscount
    if (totalAmount < 0) {
      totalAmount = 0
    }

    //  4. Tạo đơn hàng
    const newOrderData = {
      ...orderData,
      totalAmount,
      coupons: appliedCoupons,
    }
    const createdOrder = await orderModel.createNew(newOrderData)
    if (!createdOrder || !createdOrder.insertedId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create order')
    }

    //  5. Cập nhật số lượng sản phẩm (tùy thuộc vào logic của bạn)
    for (const item of orderData.items) {
      const product = await productService.getProductById(item.productId)
      const newQuantity = product.quantity - item.quantity
      if (newQuantity < 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Not enough stock for product ${product.displayName}`)
      }
      await productService.updateProduct(item.productId, { quantity: newQuantity })
    }

    return { order: createdOrder }
  } catch (error) {
    throw error
  }
}

const getOrderById = async (id) => {
  try {
    const order = await orderModel.findOneById(id)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    return { order }
  } catch (error) {
    throw error
  }
}

const getAllOrders = async (queryParams) => {
  try {
    let { page, limit, sort, order } = queryParams
    page = parseInt(page, 10) || 1
    limit = parseInt(limit, 10) || 10
    const skip = (page - 1) * limit
    const sortOptions = { [sort]: order === 'asc' ? 1 : -1 }

    const orders = await orderModel.getAllWithPagination({ sort: sortOptions, skip, limit })
    const totalCount = await orderModel.countDocuments() //  Cần thêm hàm countDocuments vào orderModel
    const totalPages = Math.ceil(totalCount / limit)

    return {
      orders,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        totalPages,
        itemsPerPage: limit
      }
    }
  } catch (error) {
    throw error
  }
}

const updateOrder = async (id, data) => {
  try {
    const updatedOrder = await orderModel.updateOneById(id, data)
    if (!updatedOrder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    return updatedOrder
  } catch (error) {
    throw error
  }
}

const deleteOrder = async (id) => {
  try {
    const deletedOrder = await orderModel.deleteOneById(id)
    if (!deletedOrder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    return deletedOrder
  } catch (error) {
    throw error
  }
}

export const orderService = {
  createNewOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder
}