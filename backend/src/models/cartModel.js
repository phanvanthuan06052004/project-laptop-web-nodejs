import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators'

const CART_COLLECTION_NAME = 'Carts'
const CART_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null).allow(null)
})

const INVALID_DATA_UPDATE = ['_id', 'createdAt', 'userId']

const validationBeforeCreate = async (data) => {
  return await CART_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (userId) => {
  try {
    const data = {
      userId: userId,
      createdAt: new Date(),
    };
    const validation = await validationBeforeCreate(data);

    const newCart = {
      ...validation, 
      updatedAt: new Date(),
    };

    const result = await GET_DB()
      .collection(CART_COLLECTION_NAME)
      .insertOne(newCart);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};


const getAllWithPagination = async ({ skip, limit }) => {
  try {
    return await GET_DB()
      .collection(CART_COLLECTION_NAME)
      .find()
      .skip(skip)
      .limit(limit)
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const countDocuments = async () => {
  try {
    return await GET_DB().collection(CART_COLLECTION_NAME).countDocuments()
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByUserId = async (userId) => {
  try {
    return await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId })
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
      .collection(CART_COLLECTION_NAME)
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
      .collection(CART_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

export const cartModel = {
  CART_COLLECTION_NAME,
  CART_COLLECTION_SCHEMA,
  createNew,
  getAllWithPagination,
  countDocuments,
  findOneByUserId,
  updateOneById,
  deleteOneById
}
