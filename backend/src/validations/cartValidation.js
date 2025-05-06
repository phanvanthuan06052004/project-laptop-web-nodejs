import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
const createOrUpdateSchema = Joi.object({
  userId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(null).allow(null)
})

const addItemSchema = Joi.object({
  userId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  laptopId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  quantity: Joi.number().min(1).default(1)
})

const updateQuantitySchema = Joi.object({
  cartItemId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  quantity: Joi.number().min(1).required()
})

const getAllQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be greater than or equal to 1'
  }),
  limit: Joi.number().integer().min(1).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be greater than or equal to 1'
  })
}).options({ abortEarly: false })

export const cartValidation = {
  getAll: async (req, res, next) => {
    try {
      const query = await getAllQuerySchema.validateAsync(req.query, {
        abortEarly: false
      })
      req.query = query
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },
  getByUserId: async (req, res, next) => {
    try {
      await Joi.object({
        userId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE)
          .required()
      }).validateAsync(req.params)
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },
  createOrUpdate: async (req, res, next) => {
    try {
      await createOrUpdateSchema.validateAsync(req.body)
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },
  addItem: async (req, res, next) => {
    try {
      await addItemSchema.validateAsync(req.body)
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },
  updateQuantity: async (req, res, next) => {
    try {
      await updateQuantitySchema.validateAsync({ ...req.params, ...req.body })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },
  deleteItem: async (req, res, next) => {
    try {
      await Joi.object({
        cartItemId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE)
          .required()
      }).validateAsync(req.params)
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  },
  deleteCart: async (req, res, next) => {
    try {
      await Joi.object({
        userId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE)
          .required()
      }).validateAsync(req.params)
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
    }
  }
}
