import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const PRODUCT_COLLECTION_NAME = 'Product'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  _id: Joi.object({}).keys({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  }),
  name: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(), // Tên hiển thị
  type: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(), // Tham chiếu đến collection Type bằng _id
  nameSlug: Joi.string().required().trim().strict(),
  brand: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(), // Tham chiếu đến collection Brand bằng _id
  description: Joi.string().required().trim().strict(),
  purchasePrice: Joi.number().min(0).default(0), // Giá nhập
  discount: Joi.number().min(0).max(100).default(0), // Giảm giá
  price: Joi.number().min(0).default(0), // Giá bán
  quantity: Joi.number().min(0).default(0),
  mainImg: Joi.string().trim().strict().allow(''), // Đường dẫn ảnh chính
  images: Joi.array().items(Joi.string()).default([]),
  attributeGroup: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().strict(),
      values: Joi.string().trim().strict()
    }).default({})
  ).default([]),
  specs: Joi.array().items(
    Joi.object({
      cpu: Joi.string().trim().strict(),
      ram: Joi.string().trim().strict(),
      storage: Joi.string().trim().strict(),
      gpu: Joi.string().trim().strict(),
      screen: Joi.string().trim().strict()
    }).default({})
  ).default([]),
  options: Joi.array().items(
    Joi.object({}).default({})
  ).default([]),
  avgRating: Joi.number().min(0).max(5).default(0),
  numberRating: Joi.number().min(0).default(0),
  isPublish: Joi.boolean().default(false),
  isDeleted: Joi.boolean().default(false),
  comments: Joi.array().items(Joi.object()).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null).allow(null)
})

// Chỉ định những trường không nên update
const INVALID_DATA_UPDATE = ['_id', 'createdAt']

// Hàm validate của Joi
const validateBeforeCreate = async (data) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

// Tạo product mới
const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const insertResult = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .insertOne(validatedData)
    return insertResult.insertedId // Trả về ID của sản phẩm đã tạo
  } catch (error) {
    throw new Error(error)
  }
}

// Lấy danh sách product với phân trang
const getAllWithPagination = async ({ filter, sort, skip, limit, projection = {} }) => {
  try {
    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .find(filter) // Áp dụng bộ lọc
      .sort(sort) // Sắp xếp
      .skip(skip) // Bỏ qua số bản ghi
      .limit(limit) // Giới hạn số bản ghi
      .project(projection) // Sử dụng projection
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

// Đếm tổng số bản ghi phù hợp với bộ lọc
const countDocuments = async (filter) => {
  try {
    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .countDocuments(filter)
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm product bằng productId
const findOneById = async (id, projection = {}) => {
  try {
    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) }, { projection })
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm product bằng nameSlug
const findOneByNameSlug = async (nameSlugValue, projection = {}) => {
  try {
    return await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne(
      { nameSlug: nameSlugValue },
      { projection } // Thêm projection
    )
  } catch (error) {
    throw new Error(error)
  }
}

// Cập nhật thông tin product
const updateOneById = async (id, data) => {
  try {
    // Lọc những field không cho phép update
    Object.keys(data).forEach((key) => {
      if (INVALID_DATA_UPDATE.includes(key)) {
        delete data[key]
      }
    })

    const result = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' } // Trả về kết quả mới sau khi update
      )
    return result// Trả về product đã được cập nhật
  } catch (error) {
    throw new Error(error)
  }
}

// Xóa product bằng productId (soft delete)
const deleteOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true, isPublish: false, updatedAt: Date.now() } })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
  createNew,
  getAllWithPagination,
  countDocuments,
  findOneById,
  findOneByNameSlug,
  updateOneById,
  deleteOneById
}
