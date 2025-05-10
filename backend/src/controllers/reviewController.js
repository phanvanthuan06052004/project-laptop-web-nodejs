import { reviewService } from '~/services/reviewService'
import { StatusCodes } from 'http-status-codes'

const getAll = async (req, res, next) => {
  try {
    const result = await reviewService.getAll(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const newReview = await reviewService.createNew(req.body, req.userId)
    res.status(StatusCodes.CREATED).json(newReview)
  } catch (error) {
    next(error)
  }
}

const getReviewById = async (req, res, next) => {
  try {
    const result = await reviewService.getReviewById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateReview = async (req, res, next) => {
  try {
    const result = await reviewService.updateReview(req.params.id, req.body, req.userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteReview = async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.id, req.userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const likeReview = async (req, res, next) => {
  try {
    const result = await reviewService.likeReview(req.params.id, req.userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const reviewController = {
  getAll,
  createNew,
  getReviewById,
  updateReview,
  deleteReview,
  likeReview
}
