import express from 'express'
import { commentController } from '~/controllers/commentController.js'
import { commentValidation } from '~/validations/commentValidation.js'

const Router = express.Router()

Router.route('/')
  .post(commentValidation.createNew, commentController.createNew)
  .get(commentValidation.getCommentByParentId, commentController.getCommentsByParentId)


export const commentRoute = Router