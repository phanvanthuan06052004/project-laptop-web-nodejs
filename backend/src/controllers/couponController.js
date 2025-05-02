// ~/controllers/couponController.js
import { StatusCodes } from 'http-status-codes'
import { couponService } from '~/services/couponService/couponService'

const createNew = async (req, res, next) => {
  try {
    const newCoupon = await couponService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newCoupon)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const result = await couponService.getAllWithPagination(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getCouponById = async (req, res, next) => {
  try {
    const result = await couponService.findOneById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getCouponByCode = async (req, res, next) => {
  try {
    const result = await couponService.findOneByCode(req.params.code)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateCoupon = async (req, res, next) => {
  try {
    const result = await couponService.updateOneById(req.params.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteCoupon = async (req, res, next) => {
  try {
    const result = await couponService.deleteOneById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const applyCoupon = async (req, res, next) => {
  try {
    const { couponCode, userId, orderTotal, shippingCost } = req.body
    const result = await couponService.applyCoupon(couponCode, userId, orderTotal, shippingCost)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const cancelCoupon = async (req, res, next) => {
  try {
    const { couponCode, userId } = req.body
    const result = await couponService.cancelCoupon(couponCode, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const couponController = {
  createNew,
  getAll,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  cancelCoupon
}