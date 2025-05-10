import express from 'express'
import { commentController } from '~/controllers/commentController.js'
import { authMiddlewares } from '~/middlewares/authMiddleware'
import { commentValidation } from '~/validations/commentValidation.js'

const Router = express.Router()

Router.route('/')
  .post(authMiddlewares.authentication, commentValidation.createNew, commentController.createNew)
  .get(commentValidation.getCommentByParentId, commentController.getCommentsByParentId)
  .delete(commentValidation.deleteNestedById, commentController.deleteNesstedById)


Router.route('/:id')
  .patch(commentValidation.updateComment, commentController.updateComment)
  .delete(commentValidation.deleteComment, commentController.deleteComment)

export const commentRoute = Router