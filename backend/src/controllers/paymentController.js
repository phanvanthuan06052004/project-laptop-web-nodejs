import { orderService } from '~/services/orderService'
import { paymentModel } from '~/models/paymentModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import crypto from 'crypto'
import { env } from '~/config/environment'
import { payosService } from '~/services/payosService'
import { paymentService } from '~/services/paymentService'

const cancelTransaction = async (req, res, next) => {
  try {
    const { paymentLinkId } = req.body
    // 1. gửi yêu cầu payos hủy giao dịch
    const payosResponse = await payosService.cancelTransaction(paymentLinkId)

    // 2. cập nhật payment status
    await paymentService.updateStatus(paymentLinkId, 'CANCELLED')

    // 3. cập nhật order status
    console.log('cancel payment', payosResponse.data)
    await orderService.updatePaymentStatusByOrderCode(payosResponse.data.orderCode, payosResponse.data)

    res.status(StatusCodes.OK).json({ message: 'Transaction cancelled successfully' })
  } catch (error) {
    next(error)
  }
}

const handlePaymentWebhook = async (req, res) => {
  try {
    const { orderCode, status, paymentLinkId, signature } = req.body

    // Verify signature
    const calculatedSignature = crypto
      .createHmac('sha256', env.PAYOS_CHECKSUM_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (calculatedSignature !== signature) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid signature')
    }

    // Find payment record by orderCode
    const payment = await paymentModel.findOneByOrderCode(orderCode)
    if (!payment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Payment record not found')
    }

    // Update payment and order status based on PayOS response
    switch (status) {
    case 'success':
      // Cập nhật order status (sẽ tự động cập nhật payment status)
      await orderService.updatePaymentStatus(payment.orderId, 'Paid')
      break
    case 'failed':
      // Cập nhật order status (sẽ tự động cập nhật payment status)
      await orderService.updatePaymentStatus(payment.orderId, 'Failed')
      break
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid payment status')
    }

    res.status(StatusCodes.OK).json({
      message: 'Payment status updated successfully'
    })
  } catch (error) {
    console.error('Error in handlePaymentWebhook:', error)
    throw error
  }
}

// Kiểm tra trạng thái thanh toán
const checkPaymentStatus = async (req, res) => {
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

export const paymentController = {
  cancelTransaction,
  handlePaymentWebhook,
  checkPaymentStatus
}
