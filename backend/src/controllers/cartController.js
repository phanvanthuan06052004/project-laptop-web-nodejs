import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cartService'

const getAll = async (req, res, next) => {
  try {
    const result = await cartService.getAll(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getByUserId = async (req, res, next) => {
  try {
    const result = await cartService.getByUserId(req.params.userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createOrUpdate = async (req, res, next) => {
  try {
    const result = await cartService.createOrUpdate(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const addItem = async (req, res, next) => {
  try {
    const result = await cartService.addItem(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const updateQuantity = async (req, res, next) => {
  try {
    const result = await cartService.updateQuantity(req.params.cartItemId, req.body.quantity)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    const result = await cartService.deleteItem(req.params.cartItemId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteCart = async (req, res, next) => {
  try {
    const result = await cartService.deleteCart(req.params.userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const countItemCart = async (req, res, next) => {
  try {
    const result = await cartService.countItemCart(req.userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


export const cartController = {
  getAll,
  getByUserId,
  createOrUpdate,
  addItem,
  updateQuantity,
  deleteItem,
  deleteCart,
  countItemCart
}