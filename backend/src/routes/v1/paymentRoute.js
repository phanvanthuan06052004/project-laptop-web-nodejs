import express from 'express'
import { paymentController } from '~/controllers/paymentController'

const Router = express.Router()

Router.post('/momo-ipn', paymentController.handleMomoIPN)
Router.get('/momo-return', paymentController.handleMomoReturn)

export const paymentRoute = Router