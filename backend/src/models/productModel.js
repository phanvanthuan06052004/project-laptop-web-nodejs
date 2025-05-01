import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators'

// Define Collection (name & schema)
const PRODUCT_COLLECTION_NAME = 'Product'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
    _id: Joi.object({}).keys({
        _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
    }),
    name: Joi.string().required().trim().strict(),
    nameSlug: Joi.string().required().trim().strict(),
    brand: Joi.string().required().trim().strict(),
    description: Joi.string().required().trim().strict(),
    purchasePrice: Joi.number().min(0).default(0), // Giá nhập
    price: Joi.number().min(0).default(0), // Giá bán
    quantity: Joi.number().min(0).default(0),
    images: Joi.array().items(Joi.string()).default([]),
    specs: Joi.array().items(
        Joi.object({
            cpu: Joi.string().trim().strict(),
            ram: Joi.string().trim().strict(),
            storage: Joi.string().trim().strict(),
            gpu: Joi.string().trim().strict(),
            screen: Joi.string().trim().strict()
        }).default({})
    ).default([]),
    rating: Joi.object({
        average: Joi.number().min(0).max(5).default(0),
        count: Joi.number().min(0).default(0)
    }).default({ average: 0, count: 0 }),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null)
})

// Chỉ định những trường không nên update
const INVALID_DATA_UPDATE = ['_id', 'createdAt']

// Hàm validate của Joi
const validationBeforeCreate = async (data) => {
    return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, {
        abortEarly: false
    })
}

// Tạo product mới
const createNew = async (data) => {
    try {
        const validation = await validationBeforeCreate(data)
        return await GET_DB()
            .collection(PRODUCT_COLLECTION_NAME)
            .insertOne(validation)
    } catch (error) {
        throw new Error(error)
    }
}

// Lấy danh sách product với phân trang
const getAllWithPagination = async ({ filter, sort, skip, limit }) => {
    try {
        return await GET_DB()
            .collection(PRODUCT_COLLECTION_NAME)
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
            .collection(PRODUCT_COLLECTION_NAME)
            .countDocuments(filter)
    } catch (error) {
        throw new Error(error)
    }
}

// Tìm product bằng productId
const findOneById = async (id) => {
    try {
        return await GET_DB()
            .collection(PRODUCT_COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(id)
            })
    } catch (error) {
        throw new Error(error)
    }
}

// Tìm product bằng nameSlug
const findOneByNameSlug = async (nameSlugValue) => {
    try {
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({
            nameSlug: nameSlugValue
        })
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

        return result
    } catch (error) {
        throw new Error(error)
    }
}

// Xóa product bằng productId
const deleteOneById = async (id) => {
    try {
        const result = await GET_DB()
            .collection(PRODUCT_COLLECTION_NAME)
            .deleteOne({ _id: new ObjectId(id) })
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
