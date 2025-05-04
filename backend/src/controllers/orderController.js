import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const createNew = async (req, res, next) => {
  try {
    const newOrder = await orderService.createNewOrder(req.body)
    res.status(StatusCodes.CREATED).json(newOrder)
  } catch (error) {
    next(error)
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
    res.status(StatusCodes.OK).json({ message: 'Order deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  createNew,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder
}