// ~/routes/couponRoute.js
import express from 'express'
import { couponController } from '~/controllers/couponController'
import { couponValidation } from '../../validations/couponValidation'
import { authMiddlewares } from '~/middlewares/authMiddleware'
// import { authMiddlewares } from '~/middlewares/authMiddleware'; // Nếu cần bảo vệ route

const Router = express.Router()

// Route to get all coupons with pagination, filtering, and sorting
Router.route('/')
  .get(couponValidation.getAll, couponController.getAll)

Router.route('/admin')
  .get(authMiddlewares.authentication, authMiddlewares.authorization, couponValidation.getAll, couponController.getAllAdmin)

// Route to create a new coupon
Router.route('/')
  .post(couponValidation.createNew, couponController.createNew)

// Route to get a coupon by ID
Router.route('/:id')
  .get(couponValidation.getCouponById, couponController.getCouponById)

// Route to update a coupon by ID
Router.route('/:id')
  .put(couponValidation.updateCoupon, couponController.updateCoupon)

// Route to delete a coupon by ID
Router.route('/:id')
  .delete(couponValidation.deleteCoupon, couponController.deleteCoupon)

// Route to get a coupon by code
Router.route('/code/:code')
  .get(couponValidation.getCouponByCode, couponController.getCouponByCode)

// Route to apply a coupon
Router.route('/apply')
  .post(couponValidation.applyCoupon, couponController.applyCoupon)

// Route to cancel a coupon
Router.route('/cancel')
  .post(couponValidation.cancelCoupon, couponController.cancelCoupon)

export const couponRoute = Router