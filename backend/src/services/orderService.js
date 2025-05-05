import { orderModel } from '~/models/orderModel'
import { productService } from '~/services/productService'
import { couponService } from '~/services/couponService/couponService'
import { couponModel } from '~/models/couponModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'

const createNewOrder = async (orderData) => {
  try {
    let totalAmount = 0 + orderData.shippingCost

    // 1. Lấy thông tin sản phẩm và tính tổng tiền
    for (const item of orderData.items) {
      const product = await productService.getProductById(item.productId)
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Sản phẩm với id ${item.productId} không tồn tại`)
      }
      item.productName = product.displayName
      item.price = product.purchasePrice
      totalAmount += product.purchasePrice * item.quantity
    }

    // 2. Kiểm tra và áp dụng coupon (tối đa 3, mỗi loại chỉ 1)
    let totalDiscount = 0
    const appliedCouponCodes = []
    const appliedCoupons = [] // Lưu danh sách coupon hợp lệ để tăng uses_count sau
    const appliedCouponTypes = new Set()
    const couponResults = []
    const MAX_COUPONS = 3
    const ALLOWED_COUPON_TYPES = ['PRODUCT', 'FREESHIPPING', 'ORDER']
    const now = new Date()

    if (orderData.couponCodes && Array.isArray(orderData.couponCodes)) {
      for (const couponCode of orderData.couponCodes) {
        if (appliedCouponCodes.length >= MAX_COUPONS) {
          couponResults.push({
            code: couponCode,
            status: 'rejected',
            reason: `Đã đạt giới hạn ${MAX_COUPONS} coupon`,
          })
          continue
        }

        try {
          const coupon = await couponService.findOneByCode(couponCode)
          if (!coupon) {
            couponResults.push({
              code: couponCode,
              status: 'rejected',
              reason: 'Không tìm thấy coupon',
            })
            continue
          }

          // Kiểm tra điều kiện áp dụng coupon
          // a. Trạng thái is_active
          if (!coupon.is_active) {
            couponResults.push({
              code: couponCode,
              status: 'rejected',
              reason: 'Coupon không hoạt động',
            })
            continue
          }

          // b. Ngày hợp lệ
          const startDay = new Date(coupon.start_day)
          const endDay = new Date(coupon.end_day)
          if (now < startDay || now > endDay) {
            couponResults.push({
              code: couponCode,
              status: 'rejected',
              reason: 'Coupon không trong thời gian hiệu lực',
            })
            continue
          }

          // c. Giới hạn tổng số lần sử dụng
          if (coupon.uses_count >= coupon.max_uses) {
            couponResults.push({
              code: couponCode,
              status: 'rejected',
              reason: 'Coupon đã hết lượt sử dụng',
            })
            continue
          }

          // d. Giới hạn số lần sử dụng mỗi người dùng
          const userUsed = coupon.user_uses.find((user) => user.user_id === orderData.userId)
          if (userUsed && userUsed.count >= coupon.max_uses_per_user) {
            couponResults.push({
              code: couponCode,
              status: 'rejected',
              reason: 'Người dùng đã sử dụng coupon tối đa số lần',
            })
            continue
          }

          // e. Giá trị đơn hàng tối thiểu
          if (totalAmount < coupon.min_value) {
            couponResults.push({
              code: couponCode,
              status: 'rejected',
              reason: `Coupon yêu cầu đơn hàng tối thiểu ${coupon.min_value}`,
            })
            continue
          }

          // f. Kiểm tra loại coupon và đảm bảo chưa có coupon cùng loại
          if (
            ALLOWED_COUPON_TYPES.includes(coupon.target_type) &&
            !appliedCouponTypes.has(coupon.target_type)
          ) {
            const { discount } = await couponService.applyCoupon(
              couponCode,
              orderData.userId,
              totalAmount,
              orderData.shippingCost
            )
            totalDiscount += discount
            appliedCouponCodes.push(couponCode)
            appliedCouponTypes.add(coupon.target_type)
            couponResults.push({
              code: couponCode,
              status: 'applied',
              discount,
            })

            // Lưu coupon hợp lệ để tăng uses_count sau
            appliedCoupons.push({ id: coupon._id, userId: orderData.userId })
          } else {
            couponResults.push({
              code: couponCode,
              status: 'rejected',
              reason: `Loại ${coupon.target_type} đã được áp dụng hoặc không hợp lệ`,
            })
            continue
          }
        } catch (error) {
          couponResults.push({
            code: couponCode,
            status: 'rejected',
            reason: `Lỗi: ${error.message}`,
          })
        }
      }

      console.log('Coupon Results before validation:', couponResults) // Debug
      // Kiểm tra nếu có coupon không hợp lệ
      const hasRejectedCoupons = couponResults.some((result) => result.status === 'rejected')
      console.log('Has rejected coupons:', hasRejectedCoupons) // Debug
      if (hasRejectedCoupons) {
        console.log('Ném lỗi với couponResults:', couponResults)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Một hoặc nhiều coupon không hợp lệ', { couponResults })
      }

      console.log('All coupons valid, proceeding to increase uses_count') // Debug
      // Tăng số lần sử dụng cho các coupon hợp lệ
      for (const { id, userId } of appliedCoupons) {
        console.log(`Increasing uses_count for coupon ${id} and user ${userId}`) // Debug
        await couponModel.increaseUsesCount(id, userId)
      }
    }

    // 3. Tính tổng tiền sau giảm giá
    totalAmount -= totalDiscount
    if (totalAmount < 0) {
      totalAmount = 0
    }

    // 4. Chuẩn bị dữ liệu đơn hàng
    const newOrderData = {
      ...orderData,
      orderCode: orderData.orderCode || uuidv4().slice(0, 8).toUpperCase(),
      totalAmount,
      couponCodes: appliedCouponCodes,
    }

    // 5. Tạo đơn hàng
    const createdOrder = await orderModel.createNew(newOrderData)
    if (!createdOrder || !createdOrder.insertedId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không thể tạo đơn hàng')
    }

    // 6. Tạo mã QR
    const qrData = `Order Code: ${newOrderData.orderCode}\nTotal Amount: ${newOrderData.totalAmount} VND`
    let qrCode
    try {
      qrCode = await QRCode.toDataURL(qrData, { width: 300 })
    } catch (error) {
      console.error('Lỗi tạo mã QR:', error)
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không thể tạo mã QR')
    }

    // 7. Cập nhật số lượng sản phẩm
    for (const item of orderData.items) {
      const product = await productService.getProductById(item.productId)
      const newQuantity = product.quantity - item.quantity
      if (newQuantity < 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Không đủ hàng cho sản phẩm ${product.displayName}`)
      }
      await productService.updateProduct(item.productId, { quantity: newQuantity })
    }

    return {
      order: createdOrder,
      qrCode,
      couponResults,
    }
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error)
    throw error
  }
}

const getOrderById = async (id) => {
  try {
    const order = await orderModel.findOneById(id)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại')
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
    const totalCount = orders.totalCount
    const totalPages = Math.ceil(totalCount / limit)

    return {
      orders: orders.result,
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại')
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại')
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
  deleteOrder,
}