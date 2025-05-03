// ~/services/typeService.js
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { typeModel } from '~/models/typeModel'
import slugify from 'slugify'

const getAll = async (queryParams) => {
  try {
    let { page, limit, search, sort, order } = queryParams

    page = parseInt(page, 10) || 1
    limit = parseInt(limit, 10) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    const sortOptions = {}
    sortOptions[sort] = order === 'asc' ? 1 : -1

    const types = await typeModel.getAllWithPagination({ filter, sort: sortOptions, skip, limit })
    const totalCount = await typeModel.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)

    return {
      types,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        totalPages,
        itemsPerPage: limit
      }
    }
  } catch (error) {
    throw error
  }
}

const createNew = async (reqBody) => {
  try {
    const slug = slugify(reqBody.name, { lower: true })
    const existingType = await typeModel.findOneBySlug(slug)
    if (existingType) {
      throw new ApiError(StatusCodes.CONFLICT, 'Type with this name already exists')
    }

    const newType = {
      ...reqBody,
      slug,
      createdAt: Date.now(),
      updatedAt: null
    }
    const result = await typeModel.createNew(newType)
    const createdType = await typeModel.findOneById(result.insertedId)
    if (!createdType) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create type')
    }
    return createdType
  } catch (error) {
    throw error
  }
}

const getTypeById = async (id) => {
  try {
    const type = await typeModel.findOneById(id)
    if (!type) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Type not found')
    }
    return type
  } catch (error) {
    throw error
  }
}

const updateType = async (id, data) => {
  try {
    const existingType = await typeModel.findOneById(id)
    if (!existingType) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Type not found')
    }

    const updatedData = {
      ...data,
      updatedAt: Date.now()
    }

    if (data.name && data.name !== existingType.name) {
      updatedData.slug = slugify(data.name, { lower: true })
      const existingSlug = await typeModel.findOneBySlug(updatedData.slug)
      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new ApiError(StatusCodes.CONFLICT, 'Type with this name already exists')
      }
    }

    const updatedType = await typeModel.updateOneById(id, updatedData)
    if (!updatedType) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update type')
    }
    return updatedType
  } catch (error) {
    throw error
  }
}

const deleteType = async (id) => {
  try {
    const existingType = await typeModel.findOneById(id)
    if (!existingType) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Type not found')
    }
    const result = await typeModel.deleteOneById(id)
    if (!result) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete type')
    }
    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const typeService = {
  getAll,
  createNew,
  getTypeById,
  updateType,
  deleteType
}
