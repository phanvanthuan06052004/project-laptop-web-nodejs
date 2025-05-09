import { orderService } from '~/services/orderService'
import { paymentModel } from '~/models/paymentModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import crypto from 'crypto'
import { env } from '~/config/environment'

const generateMomoSignature = (data) => {
  const sortedData = Object.keys(data)
    .sort()
    .reduce((acc, key) => {
      acc[key] = data[key]
      return acc
    }, {})

  const dataString = Object.entries(sortedData)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return crypto
    .createHmac('sha256', env.MOMO_SECRET_KEY)
    .update(dataString)
    .digest('hex')
}

export const paymentController = {
  // Xử lý IPN callback từ MOMO
  handleMomoIPN: async (req, res) => {
    try {
      const { orderId, requestId, amount, resultCode, message, signature } = req.body

      // Verify signature
      const calculatedSignature = generateMomoSignature({
        orderId,
        requestId,
        amount,
        resultCode,
        message
      })

      if (calculatedSignature !== signature) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid signature')
      }

      // Update payment status
      if (resultCode === 0) {
        await orderService.updatePaymentStatus(orderId, 'Paid', {
          paymentId: requestId,
          completedAt: new Date(),
          paymentDetails: {
            resultCode,
            message,
            transId: req.body.transId,
            payType: req.body.payType,
            responseTime: new Date()
          }
        })
      } else {
        await orderService.updatePaymentStatus(orderId, 'Failed', {
          paymentId: requestId,
          reason: message,
          paymentDetails: {
            resultCode,
            message,
            responseTime: new Date()
          }
        })
      }

      res.status(204).send()
    } catch (error) {
      console.error('Momo IPN error:', error)
      res.status(500).json({ error: error.message })
    }
  },

  // Xử lý redirect từ MOMO
  handleMomoReturn: async (req, res) => {
    try {
      const { orderId, resultCode } = req.query

      if (resultCode === '0') {
        res.redirect(`${env.FRONTEND_URL}/payment/success?orderId=${orderId}`)
      } else {
        res.redirect(`${env.FRONTEND_URL}/payment/failed?orderId=${orderId}`)
      }
    } catch (error) {
      console.error('Momo return error:', error)
      res.redirect(`${env.FRONTEND_URL}/payment/failed`)
    }
  },

  // Xử lý webhook từ PayOS
  handlePaymentWebhook: async (req, res) => {
    try {
      const { orderId, status, paymentId, signature } = req.body

      // Verify signature
      const calculatedSignature = crypto
        .createHmac('sha256', env.PAYOS_CHECKSUM_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex')

      if (calculatedSignature !== signature) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid signature')
      }

      switch (status) {
      case 'success':
        await orderService.updatePaymentStatus(orderId, 'Paid', {
          paymentId,
          completedAt: new Date(),
          paymentDetails: {
            status,
            paymentId,
            responseTime: new Date()
          }
        })
        break

      case 'failed':
        await orderService.updatePaymentStatus(orderId, 'Failed', {
          paymentId,
          reason: req.body.message || 'Payment failed',
          paymentDetails: {
            status,
            paymentId,
            message: req.body.message,
            responseTime: new Date()
          }
        })
        break

      default:
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid payment status')
      }

      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Payment webhook error:', error)
      res.status(500).json({ error: error.message })
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (req, res) => {
    try {
      const { orderId } = req.params

      const order = await orderService.getOrderById(orderId)
      if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
      }

      const payment = order.paymentId ? await paymentModel.findOneById(order.paymentId) : null

      res.status(200).json({
        orderStatus: order.paymentStatus,
        paymentStatus: payment?.status,
        paymentDetails: payment?.paymentDetails
      })
    } catch (error) {
      console.error('Check payment status error:', error)
      res.status(500).json({ error: error.message })
    }
  }
}