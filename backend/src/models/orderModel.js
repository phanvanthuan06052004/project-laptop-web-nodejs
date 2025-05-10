import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const ORDER_COLLECTION_NAME = 'Order'

const ORDER_COLLECTION_SCHEMA = Joi.object({
  orderCode: Joi.number().required(),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  orderDate: Joi.date().timestamp('javascript').default(Date.now),
  status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded').default('Pending'),
  totalAmount: Joi.number().min(0).required(),
  paymentMethod: Joi.string().valid('COD', 'BANK').required(), // Đồng bộ với payment providers
  paymentId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).allow(null), // Reference tới Payment collection
  paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed').default('Pending'),
  shippingMethod: Joi.string().valid('standard', 'express').allow(null),
  shippingCost: Joi.number().min(0).default(30000),
  shippingAddress: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().allow(null),
    notes: Joi.string().allow(null)
  }).required(),
  couponCodes: Joi.array().items(Joi.string()).default([]),
  adminNotes: Joi.string().allow(null),
  cancellationReason: Joi.string().allow(null),
  refundReason: Joi.string().allow(null),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
      productName: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(0).required(),
      avatar: Joi.string().required()
    })
  ).required().min(1),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').allow(null)
})

const validateBeforeCreate = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    return await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(validatedData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByOrderCode = async (orderCode) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ orderCode })
  } catch (error) {
    throw new Error(error)
  }
}

const getAllWithPagination = async ({ filter = {}, sort = {}, skip = 0, limit = 10 }) => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).find(filter).sort(sort).skip(skip).limit(limit).toArray()
    return {
      result,
      totalCount: await GET_DB().collection(ORDER_COLLECTION_NAME).countDocuments()
    }
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async (id, data) => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (id) => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount
  } catch (error) {
    throw new Error(error)
  }
}

const getByUserId = async (userId) => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).find({ userId }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const orderModel = {
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA,
  validateBeforeCreate,
  createNew,
  findOneById,
  findOneByOrderCode,
  getAllWithPagination,
  updateOneById,
  deleteOneById,
  getByUserId
}