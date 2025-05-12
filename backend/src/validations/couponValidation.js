// ~/validations/couponValidation.js
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const couponValidation = {
  createNew: async (req, res, next) => {
    const correctCondition = Joi.object({
      name: Joi.string().required().trim().strict(),
      description: Joi.string().trim().strict().allow(''),
      code: Joi.string().required().trim().strict().uppercase(),
      start_day: Joi.date().timestamp('javascript').required(),
      end_day: Joi.date().timestamp('javascript').required(),
      type: Joi.string().valid('PERCENT', 'AMOUNT').required().default('AMOUNT'),
      value: Joi.number().min(0).required(),
      max_value: Joi.number().min(0).allow(null),
      min_value: Joi.number().min(0).default(0),
      max_uses: Joi.number().min(0).required(),
      max_uses_per_user: Joi.number().min(1).default(1),
      target_type: Joi.string().valid('FREESHIPPING', 'PRODUCT', 'ORDER').required().default('PRODUCT'),
      target_ids: Joi.array()
        .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        .default([]),
      is_public: Joi.boolean().default(false),
      is_active: Joi.boolean().default(true)
    })

    try {
      await correctCondition.validateAsync(req.body, {
        abortEarly: false,
        allowUnknown: true
      })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
  },

  getCouponById: async (req, res, next) => {
    const correctCondition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    })

    try {
      await correctCondition.validateAsync(req.params, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },

  getCouponByCode: async (req, res, next) => {
    const correctCondition = Joi.object({
      code: Joi.string().required().trim().strict().uppercase()
    })

    try {
      await correctCondition.validateAsync(req.params, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },

  updateCoupon: async (req, res, next) => {
    const updateSchema = Joi.object({
      name: Joi.string().trim().strict(),
      description: Joi.string().trim().strict().allow(''),
      start_day: Joi.date().timestamp('javascript'),
      end_day: Joi.date().timestamp('javascript'),
      type: Joi.string().valid('PERCENT', 'AMOUNT', 'FREESHIPPING'),
      value: Joi.number().min(0),
      max_value: Joi.number().min(0).allow(null),
      min_value: Joi.number().min(0),
      max_uses: Joi.number().min(0),
      max_uses_per_user: Joi.number().min(1),
      target_type: Joi.string().valid('FREESHIPPING', 'PRODUCT', 'ORDER'),
      target_ids: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
      is_public: Joi.boolean(),
      is_active: Joi.boolean()
    })

    try {
      await updateSchema.validateAsync(req.body, {
        abortEarly: false,
        allowUnknown: true
      })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
    }
  },

  deleteCoupon: async (req, res, next) => {
    const correctCondition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    })

    try {
      await correctCondition.validateAsync(req.params, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },

  getAll: async (req, res, next) => {
    const correctCondition = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(5).max(1000).default(10),
      sort: Joi.string()
        .valid('name', 'code', 'createdAt', 'updatedAt')
        .default('createdAt'),
      order: Joi.string().valid('asc', 'desc').default('desc'),
      search: Joi.string().allow('').default('')
    })

    try {
      const validatedValue = await correctCondition.validateAsync(req.query, {
        abortEarly: false
      })
      req.query = validatedValue // Chuẩn hóa dữ liệu
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
  },

  applyCoupon: async (req, res, next) => {
    const correctCondition = Joi.object({
      couponCode: Joi.string().required().trim().strict().uppercase(),
      userId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      orderTotal: Joi.number().min(0).required(),
      shippingCost: Joi.number().min(0).default(0)
    })

    try {
      await correctCondition.validateAsync(req.body, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },

  cancelCoupon: async (req, res, next) => {
    const correctCondition = Joi.object({
      couponCode: Joi.string().required().trim().strict().uppercase(),
      userId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    })

    try {
      await correctCondition.validateAsync(req.body, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  }
}