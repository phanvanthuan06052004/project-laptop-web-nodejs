import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const PAYMENT_COLLECTION_NAME = 'Payment'

const PAYMENT_COLLECTION_SCHEMA = Joi.object({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  orderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),

  // Chỉ cho phép 3 phương thức: MOMO, COD, BANK
  provider: Joi.string().valid('MOMO', 'COD', 'BANK').required(),

  amount: Joi.number().min(0).required(),

  currency: Joi.string().default('VND'),

  status: Joi.string().valid(
    'PENDING', // Chờ thanh toán
    'PROCESSING', // Đang xử lý
    'COMPLETED', // Hoàn thành
    'FAILED', // Thất bại
    'REFUNDED', // Hoàn tiền
    'CANCELLED' // Đã hủy
  ).default('PENDING'),

  paymentDetails: Joi.object({
    // Chỉ giữ lại thông tin của MOMO
    partnerCode: Joi.string(),
    orderId: Joi.string(), // Mã đơn hàng từ MOMO
    requestId: Joi.string(), // Request ID của giao dịch
    amount: Joi.number(), // Số tiền thanh toán
    orderInfo: Joi.string(), // Thông tin đơn hàng
    orderType: Joi.string(), // Loại thanh toán (ex: momo_wallet)
    transId: Joi.string(), // Mã giao dịch của MOMO
    resultCode: Joi.number(), // Mã kết quả giao dịch
    message: Joi.string(), // Thông báo kết quả
    payType: Joi.string(), // Phương thức thanh toán
    responseTime: Joi.date(), // Thời gian phản hồi
    extraData: Joi.string() // Data bổ sung nếu có
  }).default({}),

  refundDetails: Joi.object({
    amount: Joi.number(),
    reason: Joi.string(),
    requestId: Joi.string(),
    status: Joi.string(),
    transactionId: Joi.string(),
    refundedAt: Joi.date()
  }).allow(null),

  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().allow(null),
  completedAt: Joi.date().allow(null)
})

const validateBeforeCreate = async (data) => {
  return await PAYMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    return await GET_DB().collection(PAYMENT_COLLECTION_NAME).insertOne(validatedData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(PAYMENT_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const getAllWithPagination = async ({ filter = {}, sort = {}, skip = 0, limit = 10 }) => {
  try {
    const result = await GET_DB().collection(PAYMENT_COLLECTION_NAME).find(filter).sort(sort).skip(skip).limit(limit).toArray()
    return {
      result,
      totalCount: await GET_DB().collection(PAYMENT_COLLECTION_NAME).countDocuments()
    }
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async (id, data) => {
  try {
    const result = await GET_DB().collection(PAYMENT_COLLECTION_NAME).findOneAndUpdate(
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
    const result = await GET_DB().collection(PAYMENT_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount
  } catch (error) {
    throw new Error(error)
  }
}

export const paymentModel = {
  PAYMENT_COLLECTION_NAME,
  PAYMENT_COLLECTION_SCHEMA,
  validateBeforeCreate,
  createNew,
  findOneById,
  getAllWithPagination,
  updateOneById,
  deleteOneById
}