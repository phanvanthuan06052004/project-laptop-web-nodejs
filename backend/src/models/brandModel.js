import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// =================== BRAND MODEL ===================
// Define Collection Name
const BRAND_COLLECTION_NAME = 'Brand'

// Define Joi Schema for Validation
const BRAND_COLLECTION_SCHEMA = Joi.object({
  _id: Joi.object({}).keys({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  }),
  name: Joi.string().required().trim().strict(), // Tên thương hiệu, unique
  slug: Joi.string().trim().strict(), // Đường dẫn thân thiện (ví dụ: apple, samsung)
  description: Joi.string().trim().strict().allow(''), // Mô tả
  logo: Joi.string().trim().strict().allow(''), // Đường dẫn logo
  is_active: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null).allow(null)
})

// Những trường không được phép cập nhật
const INVALID_BRAND_UPDATE_FIELDS = ['_id', 'slug', 'createdAt']

const validateBeforeCreateBrand = async (data) => {
  return await BRAND_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNewBrand = async (data) => {
  try {
    const validatedData = await validateBeforeCreateBrand(data)
    return await GET_DB().collection(BRAND_COLLECTION_NAME).insertOne(validatedData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneBrandByName = async (name) => {
  try {
    return await GET_DB().collection(BRAND_COLLECTION_NAME).findOne({ name })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneBrandBySlug = async (slug) => {
  try {
    return await GET_DB().collection(BRAND_COLLECTION_NAME).findOne({ slug })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneBrandById = async (id) => {
  try {
    return await GET_DB().collection(BRAND_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const getAllBrandsWithPagination = async ({ filter, sort, skip, limit }) => {
  try {
    return await GET_DB().collection(BRAND_COLLECTION_NAME)
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const countBrandDocuments = async (filter) => {
  try {
    return await GET_DB().collection(BRAND_COLLECTION_NAME).countDocuments(filter)
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneBrandById = async (id, data) => {
  try {
    Object.keys(data).forEach(key => {
      if (INVALID_BRAND_UPDATE_FIELDS.includes(key)) {
        delete data[key]
      }
    })
    const result = await GET_DB().collection(BRAND_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneBrandById = async (id) => {
  try {
    const result = await GET_DB().collection(BRAND_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const brandModel = {
  BRAND_COLLECTION_NAME,
  BRAND_COLLECTION_SCHEMA,
  createNew: createNewBrand,
  findOneByName: findOneBrandByName,
  findOneBySlug: findOneBrandBySlug,
  findOneById: findOneBrandById,
  getAllWithPagination: getAllBrandsWithPagination,
  countDocuments: countBrandDocuments,
  updateOneById: updateOneBrandById,
  deleteOneById: deleteOneBrandById
}