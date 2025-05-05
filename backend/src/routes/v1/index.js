import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'
import { mailRoute } from './mailRoute'
import { productRoute } from './productRoute'
import { brandRoute } from './brandRoute'
import { typeRoute } from './typeRoute'
import { cartRoute } from './cartRoute'
import { commentRoute } from './commentRoute'

const Router = express.Router()

// check status v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API v1 is working' })
})


// user APIs
Router.use('/users', userRoute)

Router.use('/products', productRoute)

Router.use('/brand', brandRoute)

Router.use('/type', typeRoute)

Router.use('/mail', mailRoute)

Router.use('/cart', cartRoute)

Router.use('/comment', commentRoute)

export const APIs_V1 = Router
