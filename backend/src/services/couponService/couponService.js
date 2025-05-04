// ~/services/couponService.js
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

  async getAllWithPagination({ page = 1, limit = 10, sort = 'createdAt', order = 'desc' }) {
    try {
      const skip = (page - 1) * limit
      const sortOptions = { [sort]: order === 'asc' ? 1 : -1 }
      const filter = { is_active: true }

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

      // Tăng số lần sử dụng
      const updatedCoupon = await couponModel.increaseUsesCount(coupon._id, userId)
      return {
        discount,
        updatedCoupon
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