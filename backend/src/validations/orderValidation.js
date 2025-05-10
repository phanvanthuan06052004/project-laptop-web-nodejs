import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const orderValidation = {
  createNew: async (req, res, next) => {
    const createSchema = Joi.object({
      userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
      paymentMethod: Joi.string().valid('COD', 'MOMO', 'BANK').required(),
      shippingMethod: Joi.string().valid('standard', 'express').required(),
      shippingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address: Joi.string().required(),
        ward: Joi.string().required(),
        district: Joi.string().required(),
        province: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().allow(null)
      }).required(),
      items: Joi.array()
        .items(
          Joi.object({
            productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
            productName: Joi.string().required(),
            quantity: Joi.number().min(1).required(),
            price: Joi.number().min(0).required(),
          })
        )
        .required(),
      couponCodes: Joi.array().items(Joi.string()).default([]),
      shippingCost: Joi.number().min(0).default(30000),
      totalAmount: Joi.number().min(0).required()
    })

    try {
      const validatedData = await createSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true });
      req.body = validatedData;
      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
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
      shippingMethod: Joi.string().valid('standard', 'express').allow(null),
      shippingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address: Joi.string().required(),
        ward: Joi.string().required(),
        district: Joi.string().required(),
        province: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().allow(null)
      }).required(),
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
      shippingMethod: Joi.string().valid('standard', 'express').allow('')
    })

    try {
      await getAllSchema.validateAsync(req.query, { abortEarly: false, allowUnknown: true })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  }
}