import { StatusCodes } from 'http-status-codes'
import { couponService } from '~/services/couponService/couponService'
import proxyMiddleware from '~/middlewares/proxyMiddleware.js'

const originalController = {
  createNew: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const newCoupon = await couponService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(newCoupon)
      } catch (error) {
        next(error)
      }
    }
  },
  getAll: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const result = await couponService.getAllWithPagination(req.query)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  getAllAdmin: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const result = await couponService.getAllAdmin(req.query)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  getCouponById: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const result = await couponService.findOneById(req.params.id)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  getCouponByCode: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const result = await couponService.findOneByCode(req.params.code)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  updateCoupon: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const result = await couponService.updateOneById(req.params.id, req.body)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  deleteCoupon: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const result = await couponService.deleteOneById(req.params.id)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  applyCoupon: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const { couponCode, userId, orderTotal, shippingCost } = req.body
        const result = await couponService.applyCoupon(couponCode, userId, orderTotal, shippingCost)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  cancelCoupon: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const { couponCode, userId } = req.body
        const result = await couponService.cancelCoupon(couponCode, userId)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  }
}

export const couponController = proxyMiddleware(originalController)