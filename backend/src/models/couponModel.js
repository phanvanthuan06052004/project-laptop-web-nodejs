import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection Name
const COUPON_COLLECTION_NAME = 'Coupon'

// Define Joi Schema for Validation
const COUPON_COLLECTION_SCHEMA = Joi.object({
  _id: Joi.object({}).keys({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  }),
  name: Joi.string().required().trim().strict(),
  description: Joi.string().trim().strict().allow(''), // Cho phép rỗng
  code: Joi.string().required().trim().strict().uppercase(), // Mã coupon, unique
  start_day: Joi.date().timestamp('javascript').required(),
  end_day: Joi.date().timestamp('javascript').required(),
  type: Joi.string().valid('PERCENT', 'AMOUNT').required().default('AMOUNT'),
  value: Joi.number().min(0).required(),
  max_value: Joi.number().min(0).allow(null), // Giá trị giảm tối đa (cho loại PERCENT)
  min_value: Joi.number().min(0).default(0), // Giá trị đơn hàng tối thiểu để áp dụng
  max_uses: Joi.number().min(0).required(), // Tổng số lần sử dụng tối đa
  max_uses_per_user: Joi.number().min(1).default(1), // Số lần tối đa mỗi user có thể dùng
  target_type: Joi.string().valid('FREESHIPPING', 'PRODUCT', 'ORDER').required().default('PRODUCT'),
  uses_count: Joi.number().min(0).default(0), // Số lần đã sử dụng
  user_uses: Joi.array().items(
    Joi.object({
      user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
      count: Joi.number().min(1).default(1)
    })
  ).default([]),
  target_ids: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]), // Mảng ObjectId của sản phẩm hoặc order áp dụng
  is_public: Joi.boolean().default(false), // Hiển thị công khai
  is_active: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null).allow(null)
})

// Những trường không được phép cập nhật
const INVALID_UPDATE_FIELDS = ['_id', 'code', 'createdAt', 'uses_count', 'user_uses']

const validateBeforeCreate = async (data) => {
  return await COUPON_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    return await GET_DB().collection(COUPON_COLLECTION_NAME).insertOne(validatedData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByCode = async (code) => {
  try {
    return await GET_DB().collection(COUPON_COLLECTION_NAME).findOne({ code })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(COUPON_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const getAllWithPagination = async ({ filter, sort, skip, limit }) => {
  try {
    return await GET_DB().collection(COUPON_COLLECTION_NAME)
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const countDocuments = async (filter) => {
  try {
    return await GET_DB().collection(COUPON_COLLECTION_NAME).countDocuments(filter)
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async (id, data) => {
  try {
    Object.keys(data).forEach(key => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete data[key]
      }
    })
    const result = await GET_DB().collection(COUPON_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const increaseUsesCount = async (couponId, userId) => {
  try {
    const coupon = await findOneById(couponId)
    if (!coupon) {
      throw new Error('Coupon not found!')
    }

    const userUsed = coupon.user_uses.find(user => user.user_id === userId)

    const updateQuery = {}
    const arrayFilters = []
    if (userUsed) {
      updateQuery['$inc'] = {
        'user_uses.$[elem].count': 1,
        uses_count: 1
      }
      arrayFilters.push({ 'elem.user_id': userId })
    } else {
      updateQuery['$push'] = {
        user_uses: { user_id: userId, count: 1 }
      }
      updateQuery['$inc'] = {
        uses_count: 1
      }
    }

    const result = await GET_DB().collection(COUPON_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(couponId) },
      updateQuery,
      {
        arrayFilters: arrayFilters,
        returnDocument: 'after'
      }
    )

    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const decreaseUsesCount = async (couponId, userId) => {
  try {
    const coupon = await findOneById(couponId)
    if (!coupon) {
      throw new Error('Coupon not found!')
    }

    const userUsed = coupon.user_uses.find(user => user.user_id === userId)

    const updates = {}

    if (userUsed && userUsed.count > 0) {
      updates['user_uses.$[elem].count'] = userUsed.count - 1
    }
    updates['$inc'] = { uses_count: -1 }

    const result = await GET_DB().collection(COUPON_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(couponId) },
      updates,
      {
        arrayFilters: [{ 'elem.user_id': userId }],
        returnDocument: 'after'
      }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (id) => {
  try {
    const result = await GET_DB().collection(COUPON_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const couponModel = {
  COUPON_COLLECTION_NAME,
  COUPON_COLLECTION_SCHEMA,
  createNew,
  findOneByCode,
  findOneById,
  getAllWithPagination,
  countDocuments,
  updateOneById,
  increaseUsesCount,
  decreaseUsesCount,
  deleteOneById
}