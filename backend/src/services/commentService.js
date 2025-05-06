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

const updateComment = async (id, updateData) => {
  try {
    const existingComment = await commentModel.findOneById(id)
    if (!existingComment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found')
    }

    const validUpdateData = {}
    if (updateData.content !== undefined) {
      validUpdateData.content = updateData.content
    }

    if (Object.keys(validUpdateData).length === 0) {
      return existingComment
    }

    const updatedData = {
      ...validUpdateData,
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
    const existingComment = await commentModel.findOneById(id)
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

const deleteNestedById = async (productId, commentId) => {
  try {
    const existingComment = await commentModel.findOneById(commentId)
    if (!existingComment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found')
    }
    return await commentModel.deleteNestedById(productId, commentId)
  } catch (error) {
    throw error
  }
}

export const commentService = {
  createNew,
  updateComment,
  getCommentByParentId,
  deleteComment,
  deleteNestedById
}