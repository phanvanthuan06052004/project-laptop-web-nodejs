import axios from 'axios'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { MOMO_CONFIG } from '~/config/momo'
import { orderModel } from '~/models/orderModel'
import { paymentModel } from '~/models/paymentModel'

class MomoPaymentService {
  createSignature(rawSignature) {
    return crypto
      .createHmac('sha256', MOMO_CONFIG.SECRET_KEY)
      .update(rawSignature)
      .digest('hex')
  }

  async createPaymentRequest(order) {
    try {
      const requestId = uuidv4()
      const orderId = `${order._id}_${Date.now()}`
      const orderInfo = `Thanh toan cho don hang ${order.orderCode}`
      
      // Tạo raw signature
      const rawSignature = [
        'accessKey=' + MOMO_CONFIG.ACCESS_KEY,
        'amount=' + order.totalAmount,
        'extraData=',
        'ipnUrl=' + MOMO_CONFIG.IPN_URL,
        'orderId=' + orderId,
        'orderInfo=' + orderInfo,
        'partnerCode=' + MOMO_CONFIG.PARTNER_CODE,
        'redirectUrl=' + MOMO_CONFIG.REDIRECT_URL,
        'requestId=' + requestId,
        'requestType=captureWallet'
      ].join('&')

      const signature = this.createSignature(rawSignature)

      // Tạo payment record
      const paymentData = {
        orderId: order._id,
        provider: 'MOMO',
        amount: order.totalAmount,
        status: 'PENDING',
        paymentDetails: {
          partnerCode: MOMO_CONFIG.PARTNER_CODE,
          orderId,
          requestId,
          amount: order.totalAmount,
          orderInfo,
          orderType: 'captureWallet',
          extraData: '',
          responseTime: new Date()
        }
      }

      const payment = await paymentModel.createNew(paymentData)

      // Update order với paymentId
      await orderModel.updateOneById(order._id, {
        paymentId: payment.insertedId.toString()
      })

      // Gọi API MOMO
      const response = await axios.post(
        `${MOMO_CONFIG.API_ENDPOINT}/create`,
        {
          partnerCode: MOMO_CONFIG.PARTNER_CODE,
          accessKey: MOMO_CONFIG.ACCESS_KEY,
          requestId,
          amount: order.totalAmount,
          orderId,
          orderInfo,
          redirectUrl: MOMO_CONFIG.REDIRECT_URL,
          ipnUrl: MOMO_CONFIG.IPN_URL,
          requestType: 'captureWallet',
          extraData: '',
          signature
        }
      )

      return {
        payUrl: response.data.payUrl,
        paymentId: payment.insertedId.toString()
      }
    } catch (error) {
      throw new Error('Failed to create MOMO payment: ' + error.message)
    }
  }
}

export const momoPaymentService = new MomoPaymentService()