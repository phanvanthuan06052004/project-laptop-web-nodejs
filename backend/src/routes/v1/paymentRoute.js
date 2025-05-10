import express from 'express'
import { paymentController } from '~/controllers/paymentController'

const Router = express.Router()

// cancel transaction
Router.post('/cancel-transaction', paymentController.cancelTransaction)

// webhook routes
Router.post('/webhook/payos', paymentController.handlePaymentWebhook)

export const paymentRoute = Router