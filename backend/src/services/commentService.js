import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { commentModel } from '~/models/commentModel'

const createNew = async (reqBody) => {
  try {
    const newComment = {
      ...reqBody,
      createdAt: Date.now(),
      updatedAt: null
    }
    const createdComment = await commentModel.createNew(newComment)
    if (!createdComment) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create comment')
    }
    return createdComment
  } catch (error) {
    throw error
  }
}

const updateComment = async (id, data) => {
  try {
    const existingComment = await commentModel.getCommentByParentId(null, id)
    if (!existingComment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found')
    }

    const updatedData = {
      ...data,
      updatedAt: Date.now()
    }

    const updatedComment = await commentModel.updateOneById(id, updatedData)
    if (!updatedComment) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update comment')
    }
    return updatedComment
  } catch (error) {
    throw error
  }
}

const getCommentByParentId = async (parentId, productId) => {
  try {
    const comments = await commentModel.getCommentByParentId(parentId, productId)
    if (!comments) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Comments not found')
    }
    return comments
  } catch (error) {
    throw error
  }
}

const deleteComment = async (id) => {
  try {
    const existingComment = await commentModel.getCommentByParentId(null, id)
    if (!existingComment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found')
    }

    const updatedData = {
      isDeleted: true,
      updatedAt: Date.now()
    }

    const result = await commentModel.updateOneById(id, updatedData)
    if (!result) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete comment')
    }
    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const commentService = {
  createNew,
  updateComment,
  getCommentByParentId,
  deleteComment
}