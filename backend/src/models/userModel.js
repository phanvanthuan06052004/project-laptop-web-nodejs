import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PHONE_RULE,
  PHONE_RULE_MESSAGE
} from '~/utils/validators'

const USER_ROLE = {
  MEMBER: 'member',
  STAFF: 'staff',
  ADMIN: 'admin'
}

const GENDER_OPTION = {
  MEN: 'men',
  WOMAN: 'woman',
  OTHER: 'other'
}
// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'User'
const USER_COLLECTION_SCHEMA = Joi.object({
  displayname: Joi.string().required().trim().strict(),
  gender: Joi.string().valid(GENDER_OPTION.MEN, GENDER_OPTION.WOMAN, GENDER_OPTION.OTHER).default(GENDER_OPTION.OTHER),
  role: Joi.string()
    .valid(USER_ROLE.STAFF, USER_ROLE.ADMIN, USER_ROLE.MEMBER)
    .default(USER_ROLE.MEMBER),

  dateOfBirth: Joi.date().default(null),
  avatar: Joi.string().default(null),
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE), // unique
  password: Joi.string().required(),
  phone: Joi.string().pattern(PHONE_RULE).message(PHONE_RULE_MESSAGE),

  addresses: Joi.array().items(Joi.object({
    label: Joi.string().required(),
    fullName: Joi.string().required(),
    phone: Joi.string().pattern(PHONE_RULE).message(PHONE_RULE_MESSAGE),
    street: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    isDefault: Joi.boolean().default(false)
  })).default([]),

  codeVerify: Joi.string(),
  codeExpiry: Joi.date().default(null),
  isVerified: Joi.boolean().default(false),
  resetPasswordToken: Joi.string().allow(null).default(null),
  resetPasswordExpires: Joi.date().allow(null).default(null),

  isActive: Joi.boolean().default(true),

  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

// chỉ định những trường ko nên update
const INVALID_DATA_UPDATE = ['_id', 'createAt']

// hàm validate của Joi
const validationBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

// tạo user
const createNew = async (data) => {
  try {
    const validation = await validationBeforeCreate(data)
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validation)
  } catch (error) {
    throw new Error(error)
  }
}


// Lấy danh sách user với phân trang
const getAllWithPagination = async ({ filter, sort, skip, limit }) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find(filter) // Áp dụng bộ lọc
      .sort(sort) // Sắp xếp
      .skip(skip) // Bỏ qua số bản ghi
      .limit(limit) // Giới hạn số bản ghi
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

// Đếm tổng số bản ghi phù hợp với bộ lọc
const countDocuments = async (filter) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .countDocuments(filter)
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm user bằng userId
const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm user bằng email
const findOneByEmail = async (emailValue) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: emailValue
    })
  } catch (error) {
    throw new Error(error)
  }
}

// update thông tin user
const updateUser = async (id, data) => {
  try {
    // lọc những field ko cho phép update
    Object.keys(data).forEach((key) => {
      if (INVALID_DATA_UPDATE.includes(key)) {
        delete data[key]
      }
    })

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' } // trả về kết quả mới sau khi update
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

// xóa user
const deleteOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  getAllWithPagination,
  countDocuments,
  findOneById,
  findOneByEmail,
  updateUser,
  deleteOneById
}
