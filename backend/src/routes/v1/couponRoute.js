import express from 'express'
import { couponController } from '~/controllers/couponController'
import { couponValidation } from '~/validations/couponValidation'
import { authMiddlewares } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(couponValidation.getAll, couponController.getAll)
  .post(authMiddlewares.authentication, couponValidation.createNew, couponController.createNew)

Router.route('/admin')
  .get(authMiddlewares.authentication, couponValidation.getAll, couponController.getAllAdmin)

Router.route('/:id')
  .get(couponValidation.getCouponById, couponController.getCouponById)
  .put(authMiddlewares.authentication, couponValidation.updateCoupon, couponController.updateCoupon)
  .delete(authMiddlewares.authentication, couponValidation.deleteCoupon, couponController.deleteCoupon)

Router.route('/code/:code')
  .get(couponValidation.getCouponByCode, couponController.getCouponByCode)

Router.route('/apply')
  .post(couponValidation.applyCoupon, couponController.applyCoupon)

Router.route('/cancel')
  .post(couponValidation.cancelCoupon, couponController.cancelCoupon)

export const couponRoute = Router