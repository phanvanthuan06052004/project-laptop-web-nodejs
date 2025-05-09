import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const createNew = async (req, res, next) => {
  try {
    const { order, qrCode, couponResults } = await orderService.createNewOrder(req.body)
    res.status(StatusCodes.CREATED).json({ order, qrCode, couponResults })
  } catch (error) {
    console.log('Error object:', error) // Debug: Kiểm tra toàn bộ error
    console.log('Error details:', error.details) // Debug: Kiểm tra details
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      details: error.details || {},
    })
  }
}

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id)
    res.status(StatusCodes.OK).json(order)
  } catch (error) {
    next(error)
  }
}

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders(req.query)
    res.status(StatusCodes.OK).json(orders)
  } catch (error) {
    next(error)
  }
}

const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await orderService.updateOrder(req.params.id, req.body)
    res.status(StatusCodes.OK).json(updatedOrder)
  } catch (error) {
    next(error)
  }
}

const deleteOrder = async (req, res, next) => {
  try {
    await orderService.deleteOrder(req.params.id)
    res.status(StatusCodes.OK).json({ message: 'Đơn hàng đã được xóa' })
  } catch (error) {
    next(error)
  }
}

const getByUserId = async (req, res, next) => {
  try {
    const orders = await orderService.getByUserId(req.params.id)
    res.status(StatusCodes.OK).json(orders)
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  createNew,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getByUserId
}