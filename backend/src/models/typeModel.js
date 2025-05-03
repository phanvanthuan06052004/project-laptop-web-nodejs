// ~/models/typeModel.js
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection Name
const TYPE_COLLECTION_NAME = 'Type'

// Define Joi Schema for Validation
const TYPE_COLLECTION_SCHEMA = Joi.object({
  _id: Joi.object({}).keys({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  }),
  name: Joi.string().required().trim().strict(), // Tên kiểu sản phẩm, unique
  slug: Joi.string().trim().strict(), // Đường dẫn thân thiện
  description: Joi.string().trim().strict().allow(''), // Mô tả
  image: Joi.string().trim().strict().allow(''), // Đường dẫn ảnh
  is_active: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null).allow(null)
})

// Những trường không được phép cập nhật
const INVALID_TYPE_UPDATE_FIELDS = ['_id', 'slug', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await TYPE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    return await GET_DB().collection(TYPE_COLLECTION_NAME).insertOne(validatedData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByName = async (name) => {
  try {
    return await GET_DB().collection(TYPE_COLLECTION_NAME).findOne({ name })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneBySlug = async (slug) => {
  try {
    return await GET_DB().collection(TYPE_COLLECTION_NAME).findOne({ slug })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(TYPE_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const getAllWithPagination = async ({ filter, sort, skip, limit }) => {
  try {
    return await GET_DB().collection(TYPE_COLLECTION_NAME)
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
    return await GET_DB().collection(TYPE_COLLECTION_NAME).countDocuments(filter)
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async (id, data) => {
  try {
    Object.keys(data).forEach(key => {
      if (INVALID_TYPE_UPDATE_FIELDS.includes(key)) {
        delete data[key]
      }
    })
    const result = await GET_DB().collection(TYPE_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (id) => {
  try {
    const result = await GET_DB().collection(TYPE_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const typeModel = {
  TYPE_COLLECTION_NAME,
  TYPE_COLLECTION_SCHEMA,
  createNew,
  findOneByName,
  findOneBySlug,
  findOneById,
  getAllWithPagination,
  countDocuments,
  updateOneById,
  deleteOneById
}
