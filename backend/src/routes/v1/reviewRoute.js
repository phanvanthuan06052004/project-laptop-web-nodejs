import express from 'express'
import path from 'path'
import multer from 'multer'
import { reviewController } from '~/controllers/reviewController'
import { authMiddlewares } from '~/middlewares/authMiddleware'
import { reviewValidation } from '~/validations/reviewValidation'
import { env } from '~/config/environment'
import fs from 'fs'

const Router = express.Router()
const __dirname = path.resolve()

// Configure multer storage for review images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'Uploads/reviews')
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${Date.now()}${extname}`)
  }
})

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|gif|bmp|tiff/
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|image\/gif|image\/bmp|image\/tiff/

  const extname = path.extname(file.originalname).toLowerCase()
  const mimetype = file.mimetype

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Images only'), false)
  }
}

const upload = multer({ storage, fileFilter })
const uploadMultipleImages = upload.array('images', 5) // Limit to 5 images

// Get all reviews (with pagination and filtering)
Router.route('/')
  .get(reviewValidation.getAll, reviewController.getAll)

// Create a new review with image upload
Router.route('/')
  .post(
    authMiddlewares.authentication,
    uploadMultipleImages,
    (req, res, next) => {
      if (req.files && req.files.length > 0) {
        req.body.images = req.files.map(file =>
          `http://${env.LOCAL_APP_HOST}:${env.LOCAL_APP_PORT}/Uploads/reviews/${file.filename}`
        )
      } else {
        req.body.images = []
      }
      next()
    },
    reviewValidation.createNew,
    reviewController.createNew
  )

// Get, update, delete, and like a review by ID
Router.route('/:id')
  .get(reviewValidation.getReviewById, reviewController.getReviewById)
  .put(authMiddlewares.authentication, reviewValidation.updateReview, reviewController.updateReview)
  .delete(authMiddlewares.authentication, reviewValidation.deleteReview, reviewController.deleteReview)

// Like or unlike a review
Router.route('/:id/like')
  .post(authMiddlewares.authentication, reviewValidation.likeReview, reviewController.likeReview)

export const reviewRoute = Router
