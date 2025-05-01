import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'
import { mailRoute } from './mailRoute'
import { productRoute } from './productRoute'

const Router = express.Router()

// check status v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API v1 is working' })
})


// user APIs
Router.use('/users', userRoute)

Router.use('/products', productRoute)

Router.use('/mail', mailRoute)

export const APIs_V1 = Router
