import { StatusCodes } from 'http-status-codes'
import { commentService } from '~/services/commentService'

const createNew = async (req, res, next) => {
  try {
    const newComment = await commentService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newComment)
  } catch (error) {
    next(error)
  }
}

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { content } = req.body

    const result = await commentService.updateComment(id, { content })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getCommentsByParentId = async (req, res, next) => {
  try {
    const { parentId, productId } = req.query
    const result = await commentService.getCommentByParentId(parentId, productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteComment = async (req, res, next) => {
  try {
    const userId = req.body
    const result = await commentService.deleteComment(req.params.id, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteNestedById = async (req, res, next) => {
  try {
    const result = await commentService.deleteNestedById(req.query.productId, req.query.commentId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


export const commentController = {
  createNew,
  updateComment,
  getCommentsByParentId,
  deleteComment,
  deleteNestedById
}