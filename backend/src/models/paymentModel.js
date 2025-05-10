import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const PAYMENT_COLLECTION_NAME = 'Payment'

const PAYMENT_COLLECTION_SCHEMA = Joi.object({
  orderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),

  // Chỉ định phương thức thanh toán chung
  method: Joi.string().valid('COD', 'BANK').required(), // BANK_QR bao gồm cả MOMO và ngân hàng thông qua PayOS

  amount: Joi.number().min(0).required(),

  status: Joi.string().valid(
    'PENDING', // Chưa thanh toán
    'PROCESSING', // Đang xử lý tại PayOS
    'COMPLETED', // Thanh toán thành công
    'FAILED', // Thanh toán thất bại
    'CANCELLED', // Bị hủy
    'REFUNDED' // Đã hoàn tiền
  ).default('PENDING'),

  payosTransaction: Joi.object({
    checkoutUrl: Joi.string().uri(), // URL khách hàng dùng để thanh toán
    bin: Joi.string(), // Mã ngân hàng
    accountNumber: Joi.string(), // Mã tài khoản thụ hưởng
    description: Joi.string(), // Mô tả giao dịch
    transactionId: Joi.string(), // ID của PayOS (nếu có)
    expiredAt: Joi.date(), // Hạn của mã QR
    signedData: Joi.string(), // Chữ ký từ PayOS để xác thực
    paymentTime: Joi.date().allow(null) // Thời gian khách thanh toán
  }).default({}),

  refundDetails: Joi.object({
    amount: Joi.number(),
    reason: Joi.string(),
    status: Joi.string().valid('REQUESTED', 'COMPLETED', 'FAILED'),
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

const findOneByOrderCode = async (orderCode) => {
  try {
    return await GET_DB().collection(PAYMENT_COLLECTION_NAME).findOne({ 'payosTransaction.description': { $regex: orderCode.toString(), $options: 'i' } })
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
const updateOneByPaymentId = async (paymentId, data) => {
  try {
    const result = await GET_DB().collection(PAYMENT_COLLECTION_NAME).findOneAndUpdate(
      { 'payosTransaction.transactionId': paymentId },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result?.value
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
  findOneByOrderCode,
  getAllWithPagination,
  updateOneById,
  deleteOneById,
  updateOneByPaymentId
}