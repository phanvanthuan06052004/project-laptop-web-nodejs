import axios from 'axios'
import { paymentModel } from '~/models/paymentModel'



const updateStatus = async (paymentId, data) => {
  const paymentUpdate = {
    status: data,
    updatedAt: new Date()
  }
  await paymentModel.updateOneByPaymentId(paymentId, paymentUpdate)
}

export const paymentService = {
  updateStatus
}