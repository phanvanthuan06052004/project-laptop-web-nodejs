import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import crypto from 'crypto'
import { env } from '~/config/environment'

const PAYOS_API_URL = env.PAYOS_API_URL
const PAYOS_CLIENT_ID = env.PAYOS_CLIENT_ID
const PAYOS_API_KEY = env.PAYOS_API_KEY
const PAYOS_CHECKSUM_KEY = env.PAYOS_CHECKSUM_KEY

const generateChecksum = (data) => {
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
    .createHmac('sha256', PAYOS_CHECKSUM_KEY)
    .update(dataString)
    .digest('hex')
}

const createPaymentRequest = async ({
  orderId,
  orderCode,
  amount,
  description,
  returnUrl,
  cancelUrl
}) => {
  try {
    const paymentData = {
      orderCode,
      amount,
      description,
      cancelUrl,
      returnUrl,
      expiredAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      signature: generateChecksum({
        orderCode,
        amount,
        description,
        cancelUrl,
        returnUrl
      })
    }

    const response = await axios.post(
      `${PAYOS_API_URL}/v2/payment-requests`,
      paymentData,
      {
        headers: {
          'x-client-id': PAYOS_CLIENT_ID,
          'x-api-key': PAYOS_API_KEY
        }
      }
    )

    if (!response.data || response.data.code !== 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        response.data?.message || 'Lỗi khi tạo yêu cầu thanh toán'
      )
    }

    return {
      paymentId: response.data.data.paymentId,
      paymentUrl: response.data.data.paymentUrl,
      bankAccounts: response.data.data.bankAccounts
    }
  } catch (error) {
    console.error('PayOS payment error:', error)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Không thể tạo yêu cầu thanh toán'
    )
  }
}

const verifyPayment = async (paymentId) => {
  try {
    const response = await axios.get(
      `${PAYOS_API_URL}/v2/payment-requests/${paymentId}`,
      {
        headers: {
          'x-client-id': PAYOS_CLIENT_ID,
          'x-api-key': PAYOS_API_KEY
        }
      }
    )

    if (!response.data || response.data.code !== 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        response.data?.message || 'Lỗi khi xác thực thanh toán'
      )
    }

    return {
      status: response.data.data.status,
      amount: response.data.data.amount,
      orderCode: response.data.data.orderCode,
      paymentId: response.data.data.paymentId
    }
  } catch (error) {
    console.error('PayOS verification error:', error)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Không thể xác thực thanh toán'
    )
  }
}

export const payosService = {
  createPaymentRequest,
  verifyPayment
} 