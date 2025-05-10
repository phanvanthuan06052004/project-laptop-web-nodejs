/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { reviewModel } from '~/models/reviewModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const getAll = async (queryParams) => {
  try {
    const { page, limit, search, sort, order, productId } = queryParams

    const skip = (page - 1) * limit

    const filter = {}
    if (productId) {
      filter.productId = productId
    }
    if (search) {
      filter.content = { $regex: search, $options: 'i' }
    }
    filter.status = 'ACTIVE'

    const sortOptions = {}
    sortOptions[sort] = order === 'asc' ? 1 : -1

    const reviews = await reviewModel.getAllWithPagination({ filter, sort: sortOptions, skip, limit })
    const totalCount = await reviewModel.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)

    return {
      reviews,
      pagination: {
        totalItems: totalCount,
        currentPage: parseInt(page, 10),
        totalPages,
        itemsPerPage: parseInt(limit, 10)
      }
    }
  } catch (error) {
    throw error
  }
}

const createNew = async (reqBody, userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    if (!reqBody.productId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid productId!')
    }

    const newReview = {
      productId: reqBody.productId,
      user: {
        id: userId,
        displayName: user.displayname,
        avatar: user.avatar,
        role: user.role
      },
      parentId: reqBody.parentId || null,
      content: reqBody.content,
      images: reqBody.images || [],
      rating: reqBody.rating || null
    }

    const result = await reviewModel.createNew(newReview)
    const createdReview = await reviewModel.findOneById(result.insertedId)
    return createdReview
  } catch (error) {
    throw error
  }
}

const getReviewById = async (id) => {
  try {
    const result = await reviewModel.findOneById(id)
    if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found!')
    if (result.status !== 'ACTIVE') throw new ApiError(StatusCodes.FORBIDDEN, 'Review is not active!')
    return result
  } catch (error) {
    throw error
  }
}

const updateReview = async (id, data, userId) => {
  try {
    const review = await reviewModel.findOneById(id)
    if (!review) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found!')
    }

    if (review.user.id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to update this review!')
    }

    const updatedData = {
      ...data,
      updatedAt: Date.now()
    }

    const updatedReview = await reviewModel.updateReview(id, updatedData)
    return updatedReview
  } catch (error) {
    throw error
  }
}

const deleteReview = async (id, userId) => {
  try {
    const review = await reviewModel.findOneById(id)
    if (!review) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found!')
    }

    if (review.user.id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to delete this review!')
    }

    await reviewModel.updateReview(id, { status: 'DELETED', updatedAt: Date.now() })
    return { deletedResult: 'Review was deleted' }
  } catch (error) {
    throw error
  }
}

const likeReview = async (reviewId, userId) => {
  try {
    const review = await reviewModel.findOneById(reviewId)
    if (!review) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found!')
    }

    const likes = review.likes || []
    const hasLiked = likes.includes(userId)

    const updatedLikes = hasLiked
      ? likes.filter((id) => id !== userId)
      : [...likes, userId]

    const updatedReview = await reviewModel.updateReview(reviewId, {
      likes: updatedLikes,
      likesCount: updatedLikes.length,
      updatedAt: Date.now()
    })

    return updatedReview
  } catch (error) {
    throw error
  }
}

export const reviewService = {
  getAll,
  createNew,
  getReviewById,
  updateReview,
  deleteReview,
  likeReview
}
