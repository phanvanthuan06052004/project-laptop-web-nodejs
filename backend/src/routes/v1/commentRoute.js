import express from 'express'
import { commentController } from '~/controllers/commentController.js'
import { authMiddlewares } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddlewares.authentication, commentController.createNew)
  .get(commentController.getCommentsByParentId)
  .delete(commentController.deleteNestedById)


Router.route('/:id')
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment)

export const commentRoute = Router