import Joi from 'joi'
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Validation middleware
export const productValidation = {
  createNew: async (req, res, next) => {
    const correctCondition = Joi.object({
      name: Joi.string().required().trim().strict(),
      nameSlug: Joi.string().required().trim().strict(),
      brand: Joi.string().required().trim().strict(),
      description: Joi.string().required().trim().strict(),
      purchasePrice: Joi.number().min(0).default(0),
      price: Joi.number().min(0).default(0),
      quantity: Joi.number().min(0).default(0),
      images: Joi.array().items(Joi.string()).default([]),
      specs: Joi.array().items(
        Joi.object({
          cpu: Joi.string().trim().strict(),
          ram: Joi.string().trim().strict(),
          storage: Joi.string().trim().strict(),
          gpu: Joi.string().trim().strict(),
          screen: Joi.string().trim().strict()
        }).default({})
      ).default([]),
      avgRating: Joi.number().min(0).max(5).default(0),
      numberRating: Joi.number().min(0).default(0),
      isPublish: Joi.boolean().default(false),
      isDeleted: Joi.boolean().default(false),
      category: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE) // Added category
    })
    try {
      await correctCondition.validateAsync(req.body, {
        abortEarly: false,
        allowUnknown: true
      })
      next()
    } catch (error) {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
      )
    }
  },

  getProductById: async (req, res, next) => {
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

  updateProduct: async (req, res, next) => {
    const updateSchema = Joi.object({
      name: Joi.string().trim().strict(),
      brand: Joi.string().trim().strict(),
      description: Joi.string().trim().strict(),
      purchasePrice: Joi.number().min(0),
      price: Joi.number().min(0),
      quantity: Joi.number().min(0),
      images: Joi.array().items(Joi.string()),
      specs: Joi.array().items(
        Joi.object({
          cpu: Joi.string().trim().strict(),
          ram: Joi.string().trim().strict(),
          storage: Joi.string().trim().strict(),
          gpu: Joi.string().trim().strict(),
          screen: Joi.string().trim().strict()
        })
      ),
      isPublish: Joi.boolean(),
      isDeleted: Joi.boolean(),
      category: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE) // Added category
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

  deleteProduct: async (req, res, next) => {
    const correctCondition = Joi.object({
      id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
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
      search: Joi.string().trim().allow(''),
      sort: Joi.string().valid('name', 'price', 'createdAt', 'updatedAt').default('createdAt'), // Add fields you want to sort by
      order: Joi.string().valid('asc', 'desc').default('desc'),
      // Add any product-specific filtering options here
      brand: Joi.string().trim().allow(''),
      minPrice: Joi.number().min(0),
      maxPrice: Joi.number().min(0),
      category: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).allow('') // Added category
    })

    try {
      const validatedValue = await correctCondition.validateAsync(req.query, { abortEarly: false })
      req.query = validatedValue // Chuẩn hóa dữ liệu
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
  },
  getByNameSlug: async (req, res, next) => {
    const correctCondition = Joi.object({
      nameSlug: Joi.string().required().trim().strict()
    })
    try {
      await correctCondition.validateAsync(req.params, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
  },
  getPageProduct: async (req, res, next) => {
    const correctCondition = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(1000).default(10),
      name: Joi.string().trim().allow(''),
      minPrice: Joi.number().min(0),
      maxPrice: Joi.number().min(0),
      brand: Joi.string().trim().allow(''),
      specs: Joi.array().items(
        Joi.object({
          cpu: Joi.string().trim().strict(),
          ram: Joi.string().trim().strict(),
          storage: Joi.string().trim().strict(),
          gpu: Joi.string().trim().strict(),
          screen: Joi.string().trim().strict()
        }).default({})
      ).default([]),
      avgRating: Joi.number().min(0).max(5),
      category: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).allow('') // Added category
    })
    try {
      await correctCondition.validateAsync(req.query, { abortEarly: false })
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
  },

  getPageProductIdAndName: async (req, res, next) => {
    const correctCondition = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(1000).default(10),
      name: Joi.string().trim().allow(''),
      brand: Joi.string().trim().allow(''),
      type: Joi.string().trim().allow('')
    })

    try {
      const validatedValue = await correctCondition.validateAsync(req.query, { abortEarly: false })
      req.query = validatedValue // Chuẩn hóa dữ liệu
      next()
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
  }
}
