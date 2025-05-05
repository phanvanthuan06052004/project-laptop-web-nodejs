import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const orderValidation = {
  createNew: async (req, res, next) => {
    const createSchema = Joi.object({
      userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
      paymentMethod: Joi.string().valid('COD', 'Card', 'Bank').required(),
      shippingMethod: Joi.string().valid('Standard', 'Express').allow(null),
      shippingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        street: Joi.string().required(),
        ward: Joi.string().required(),
        district: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().allow(null)
      }).required(),
      billingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        street: Joi.string().required(),
        ward: Joi.string().required(),
        district: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().allow(null)
      }).allow(null),
      couponCodes: Joi.array().items(Joi.string()),
      shippingCost: Joi.number().min(0).default(30000),
      notes: Joi.string().allow(null),
      items: Joi.array().items(
        Joi.object({
          productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
          quantity: Joi.number().min(1).required()
        })
      ).required()
    })

    try {
      const correctCondition = await createSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
      req.body =correctCondition
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
  },

  getById: async (req, res, next) => {
    const getByIdSchema = Joi.object({
      id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
    })

    try {
      await getByIdSchema.validateAsync(req.params, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },

  update: async (req, res, next) => {
    const updateSchema = Joi.object({
      status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'),
      paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed'),
      shippingMethod: Joi.string().valid('Standard', 'Express').allow(null),
      shippingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        street: Joi.string().required(),
        ward: Joi.string().required(),
        district: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().allow(null)
      }).required(),
      billingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        street: Joi.string().required(),
        ward: Joi.string().required(),
        district: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().allow(null)
      }).allow(null),
      notes: Joi.string().allow(null),
      adminNotes: Joi.string().allow(null),
      cancellationReason: Joi.string().allow(null),
      refundReason: Joi.string().allow(null)
    })

    try {
      await updateSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
  },

  delete: async (req, res, next) => {
    const deleteSchema = Joi.object({
      id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
    })

    try {
      await deleteSchema.validateAsync(req.params, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },

  getAll: async (req, res, next) => {
    const getAllSchema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(1000).default(10),
      sort: Joi.string().valid('orderDate', 'totalAmount').default('orderDate'),
      order: Joi.string().valid('asc', 'desc').default('desc'),
      userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).allow(''),
      status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded').allow(''),
      paymentMethod: Joi.string().valid('COD', 'Card', 'Bank').allow(''),
      paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed').allow(''),
      shippingMethod: Joi.string().valid('Standard', 'Express').allow('')
    })

    try {
      await getAllSchema.validateAsync(req.query, { abortEarly: false, allowUnknown: true })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  }
}