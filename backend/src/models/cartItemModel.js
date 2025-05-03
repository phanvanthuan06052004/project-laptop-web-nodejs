import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators'

const CARTITEM_COLLECTION_NAME = 'CartItems'
const CARTITEM_COLLECTION_SCHEMA = Joi.object({
  cartId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  laptopId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  quantity: Joi.number().min(1).default(1),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null).allow(null)
})

const INVALID_DATA_UPDATE = ['_id', 'createdAt', 'cartId', 'laptopId']

const validationBeforeCreate = async (data) => {
  return await CARTITEM_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validation = await validationBeforeCreate(data)
    return await GET_DB().collection(CARTITEM_COLLECTION_NAME).insertOne(validation)
  } catch (error) {
    throw new Error(error)
  }
}

const getByCartId = async (cartId) => {
  try {
    return await GET_DB()
      .collection(CARTITEM_COLLECTION_NAME)
      .find({ cartId })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByCartAndLaptop = async (cartId, laptopId) => {
  try {
    // Kiểm tra xem cartId và laptopId có phải ObjectId hợp lệ không
    if (!ObjectId.isValid(cartId) || !ObjectId.isValid(laptopId)) {
      throw new Error('Invalid cartId or laptopId: Must be a valid ObjectId')
    }

    const result = await GET_DB()
      .collection(CARTITEM_COLLECTION_NAME)
      .findOne({ cartId, laptopId })
    return result // findOne trả về document hoặc null nếu không tìm thấy
  } catch (error) {
    throw new Error(`Error finding cart item: ${error.message}`)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(CARTITEM_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneById = async (id, data) => {
  try {
    Object.keys(data).forEach((key) => {
      if (INVALID_DATA_UPDATE.includes(key)) delete data[key]
    })
    return await GET_DB()
      .collection(CARTITEM_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' }
      )
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(CARTITEM_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByCartId = async (cartId) => {
  try {
    return await GET_DB()
      .collection(CARTITEM_COLLECTION_NAME)
      .deleteMany({ cartId })
  } catch (error) {
    throw new Error(error)
  }
}

export const cartItemModel = {
  CARTITEM_COLLECTION_NAME,
  CARTITEM_COLLECTION_SCHEMA,
  createNew,
  getByCartId,
  findOneByCartAndLaptop,
  findOneById,
  updateOneById,
  deleteOneById,
  deleteManyByCartId
}