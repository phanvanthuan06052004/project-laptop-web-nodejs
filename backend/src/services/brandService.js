// ~/services/brandService.js
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { brandModel } from '~/models/brandModel'
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

    const brands = await brandModel.getAllWithPagination({ filter, sort: sortOptions, skip, limit })
    const totalCount = await brandModel.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)

    return {
      brands,
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
    const existingBrand = await brandModel.findOneBySlug(slug)
    if (existingBrand) {
      throw new ApiError(StatusCodes.CONFLICT, 'Brand with this name already exists')
    }

    const newBrand = {
      ...reqBody,
      slug,
      createdAt: Date.now(),
      updatedAt: null
    }
    const result = await brandModel.createNew(newBrand)
    const createdBrand = await brandModel.findOneById(result.insertedId)
    if (!createdBrand) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create brand')
    }
    return createdBrand
  } catch (error) {
    throw error
  }
}

const getBrandById = async (id) => {
  try {
    const brand = await brandModel.findOneById(id)
    if (!brand) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Brand not found')
    }
    return brand
  } catch (error) {
    throw error
  }
}

const updateBrand = async (id, data) => {
  try {
    const existingBrand = await brandModel.findOneById(id)
    if (!existingBrand) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Brand not found')
    }

    const updatedData = {
      ...data,
      updatedAt: Date.now()
    }

    if (data.name && data.name !== existingBrand.name) {
      updatedData.slug = slugify(data.name, { lower: true })
      const existingSlug = await brandModel.findOneBySlug(updatedData.slug)
      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new ApiError(StatusCodes.CONFLICT, 'Brand with this name already exists')
      }
    }

    const updatedBrand = await brandModel.updateOneById(id, updatedData)
    if (!updatedBrand) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update brand')
    }
    return updatedBrand
  } catch (error) {
    throw error
  }
}

const deleteBrand = async (id) => {
  try {
    const existingBrand = await brandModel.findOneById(id)
    if (!existingBrand) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Brand not found')
    }
    const result = await brandModel.deleteOneById(id)
    if (!result) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete brand')
    }
    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const brandService = {
  getAll,
  createNew,
  getBrandById,
  updateBrand,
  deleteBrand
}