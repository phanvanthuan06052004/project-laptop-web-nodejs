import express from 'express'
import { paymentController } from '~/controllers/paymentController'

const Router = express.Router()

Router.post('/momo-ipn', paymentController.handleMomoIPN)
Router.get('/momo-return', paymentController.handleMomoReturn)

// Public routes
Router.post('/webhook', paymentController.handlePaymentWebhook)
Router.get('/momo/ipn', paymentController.handleMomoIPN)
Router.get('/momo/return', paymentController.handleMomoReturn)

// Protected routes
Router.get('/status/:orderId', paymentController.checkPaymentStatus)

export const paymentRoute = Router