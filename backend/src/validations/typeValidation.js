// ~/validations/typeValidation.js
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const typeValidation = {
  createNew: async (req, res, next) => {
    const correctCondition = Joi.object({
      name: Joi.string().required().trim().strict(),
      slug: Joi.string().trim().strict(),
      description: Joi.string().trim().strict().allow(''),
      image: Joi.string().trim().strict().allow(''),
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

  getTypeById: async (req, res, next) => {
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

  updateType: async (req, res, next) => {
    const updateSchema = Joi.object({
      name: Joi.string().trim().strict(),
      slug: Joi.string().trim().strict(),
      description: Joi.string().trim().strict().allow(''),
      image: Joi.string().trim().strict().allow(''),
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

  deleteType: async (req, res, next) => {
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
        .valid('name', 'slug', 'createdAt', 'updatedAt')
        .default('createdAt'),
      order: Joi.string().valid('asc', 'desc').default('desc')
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
  }
}
