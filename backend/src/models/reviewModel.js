import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { OBJECT_ID_RULE } from '~/utils/validators'


const REVIEW_COLLECTION_NAME = 'Review'

const REVIEW_COLLECTION_SCHEMA = Joi.object({
  productId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE), // ID của sản phẩm được bình luận

  user: Joi.object({
    id: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE), // ID người bình luận
    displayName: Joi.string().required().trim().strict(), // Tên hiển thị
    avatar: Joi.string().uri().allow(null).default(null), // Ảnh đại diện
    role: Joi.string().valid('member', 'staff').required() // Phân biệt người mua hay nhân viên phản hồi
  }).required(),

  content: Joi.string().required().trim().strict(), // Nội dung bình luận

  rating: Joi.number().min(1).max(5).when('user.role', {
    is: 'member',
    then: Joi.required(),
    otherwise: Joi.forbidden() // Chỉ customer được đánh giá
  }),

  parentId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .allow(null)
    .default(null), // Nếu là phản hồi thì sẽ có parentId

  likes: Joi.array()
    .items(
      Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    )
    .default([]), // Người đã like

  likesCount: Joi.number().default(0), // Số lượt thích

  images: Joi.array().items(Joi.string().uri()).default([]), // Hình ảnh đính kèm

  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'DELETED')
    .default('ACTIVE'), // Trạng thái

  createdAt: Joi.date().timestamp('javascript').default(Date.now), // Ngày tạo
  updatedAt: Joi.date().timestamp('javascript').default(null) // Ngày cập nhật
})


// Chỉ định những trường không nên update
const INVALID_DATA_UPDATE = ['_id', 'createdAt', 'productId', 'user']

// Hàm validate của Joi
const validationBeforeCreate = async (data) => {
  return await REVIEW_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

// Tạo comment mới
const createNew = async (data) => {
  try {
    const validation = await validationBeforeCreate(data)
    return await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
      .insertOne(validation)
  } catch (error) {
    throw new Error(error)
  }
}

// Lấy danh sách comment với phân trang
const getAllWithPagination = async ({ filter, sort, skip, limit }) => {
  try {
    return await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
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
      .collection(REVIEW_COLLECTION_NAME)
      .countDocuments(filter)
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm comment bằng commentId
const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
  } catch (error) {
    throw new Error(error)
  }
}

// Cập nhật thông tin comment
const updateComment = async (id, data) => {
  try {
    // Lọc những field không cho phép update
    Object.keys(data).forEach((key) => {
      if (INVALID_DATA_UPDATE.includes(key)) {
        delete data[key]
      }
    })

    const result = await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' } // Trả về kết quả mới sau khi update
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Xóa comment
const deleteOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(REVIEW_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const reviewModel = {
  REVIEW_COLLECTION_NAME,
  REVIEW_COLLECTION_SCHEMA,
  createNew,
  getAllWithPagination,
  countDocuments,
  findOneById,
  updateComment,
  deleteOneById
}