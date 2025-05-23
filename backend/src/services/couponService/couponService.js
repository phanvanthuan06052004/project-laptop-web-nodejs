import { couponModel } from '~/models/couponModel'
import { DiscountContext } from '~/services/couponService/strategies/discountContext'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export class CouponService {
  constructor() {
    this.discountContext = new DiscountContext()
  }

  async createNew(data) {
    try {
      const existingCoupon = await couponModel.findOneByCode(data.code)
      if (existingCoupon) {
        throw new ApiError(StatusCodes.CONFLICT, 'Coupon code already exists')
      }
      const todayStart = new Date().setHours(0, 0, 0, 0) // Start of today
      if (!Number.isInteger(data.start_day)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'start_day must be a valid integer timestamp.')
      } else if (data.start_day < todayStart) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'start_day must not be earlier than today.')
      }
      if (!Number.isInteger(data.end_day)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'end_day must be a valid timestamp.')
      }
      if (data.end_day <= data.start_day) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'end_day must be after start_day.')
      }
      const value = parseFloat(data.value)
      const maxValue = parseFloat(data.max_value)
      const minValue = parseFloat(data.min_value)
      if (!isNaN(maxValue) && maxValue < 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'max_value must be a non-negative number.')
      }
      if (!isNaN(minValue) && minValue < 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'min_value must be a non-negative number.')
      }
      if (data.type === 'AMOUNT' && minValue < value) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'min_value must be greater than or equal to value for AMOUNT type.')
      }
      return await couponModel.createNew(data)
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
    }
  }

  async findOneByCode(code) {
    const coupon = await couponModel.findOneByCode(code)
    if (!coupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
    }
    return coupon
  }

  async findOneById(id) {
    const coupon = await couponModel.findOneById(id)
    if (!coupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
    }
    return coupon
  }

  async getAllWithPagination({ page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = null }) {
    try {
      const skip = (page - 1) * limit
      const sortOptions = { [sort]: order === 'asc' ? 1 : -1 }
      const filter = {}

      // Thêm điều kiện tìm kiếm nếu có giá trị search
      if (search) {
        const searchRegex = { $regex: search, $options: 'i' }
        filter.$or = [
          { code: searchRegex },
          { name: searchRegex }
        ]
      }

      const [coupons, totalCount] = await Promise.all([
        couponModel.getAllWithPagination({ filter, sort: sortOptions, skip, limit }),
        couponModel.countDocuments(filter)
      ])

      return {
        coupons,
        pagination: {
          totalItems: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          itemsPerPage: limit
        }
      }
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
  }

  async getAllAdmin({ page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = null }) {
    try {
      const skip = (page - 1) * limit
      const sortOptions = { [sort]: order === 'asc' ? 1 : -1 }
      const filter = {}

      // Thêm điều kiện tìm kiếm nếu có giá trị search
      if (search) {
        const searchRegex = { $regex: search, $options: 'i' }
        filter.$or = [
          { code: searchRegex },
          { name: searchRegex }
        ]
      }

      const [coupons, totalCount] = await Promise.all([
        couponModel.getAllWithPagination({ filter, sort: sortOptions, skip, limit }),
        couponModel.countDocuments(filter)
      ])

      return {
        coupons,
        pagination: {
          totalItems: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          itemsPerPage: limit
        }
      }
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
  }


  async updateOneById(id, data) {
    try {
      const coupon = await couponModel.findOneById(id)
      if (!coupon) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
      }

      const updatedData = { ...data, updatedAt: Date.now() }
      const result = await couponModel.updateOneById(id, updatedData)
      return result
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
    }
  }

  async applyCoupon(couponCode, userId, orderTotal, shippingCost = 0) {
    try {
      const coupon = await this.findOneByCode(couponCode)
      if (!coupon.is_active || coupon.uses_count >= coupon.max_uses) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon is invalid or expired')
      }
      const userUsed = coupon.user_uses.find(user => user.user_id === userId)
      if (userUsed && userUsed.count >= coupon.max_uses_per_user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon usage limit reached for this user')
      }
      if (orderTotal < coupon.min_value) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Order total does not meet minimum requirement')
      }
      // Sử dụng Strategy Pattern để tính toán giảm giá
      this.discountContext.setStrategy(coupon.type)
      const discount = this.discountContext.calculateDiscount(orderTotal, coupon, shippingCost)
      return {
        discount,
        type: coupon.type,
        couponCode: coupon.code,
        value: coupon.value
      }
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
    }
  }

  async cancelCoupon(couponCode, userId) {
    try {
      const coupon = await this.findOneByCode(couponCode)
      const userUsed = coupon.user_uses.find(user => user.user_id === userId)
      if (!userUsed || userUsed.count <= 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Coupon has not been used by this user')
      }

      const updatedCoupon = await couponModel.decreaseUsesCount(coupon._id, userId)
      return updatedCoupon
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
    }
  }

  async deleteOneById(id) {
    try {
      const result = await couponModel.deleteOneById(id)
      if (result.deletedCount === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Coupon not found')
      }
      return { deleted: true }
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
    }
  }
}

export const couponService = new CouponService()