import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cartModel } from '~/models/cartModel'
import { cartItemModel } from '~/models/cartItemModel'
import { productModel } from '~/models/productModel'

const getAll = async (queryParams) => {
  try {
    const { page, limit } = queryParams
    const skip = (page - 1) * limit || 0
    const carts = await cartModel.getAllWithPagination({ skip, limit })
    const totalCount = await cartModel.countDocuments()
    const totalPages = Math.ceil(totalCount / limit)
    return {
      carts,
      pagination: { totalItems: totalCount, currentPage: page, totalPages, itemsPerPage: limit }
    }
  } catch (error) {
    throw error
  }
}

const getByUserId = async (userId) => {
  try {
    const cart = await cartModel.findOneByUserId(userId)
    if (!cart) throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
    const cartItems = await cartItemModel.getByCartId(cart._id.toString())
    return { ...cart, items: cartItems }
  } catch (error) {
    throw error
  }
}

const createOrUpdate = async (data) => {
  try {
    const { userId } = data
    const existingCart = await cartModel.findOneByUserId(userId)
    if (existingCart) {
      return await cartModel.updateOneById(existingCart._id.toString(), { updatedAt: Date.now() })
    }
    return await cartModel.createNew(data)
  } catch (error) {
    throw error
  }
}

const addItem = async (data) => {
  try {
    const { cartId, laptopId, quantity } = data

    // Kiểm tra tồn kho trước khi thêm
    const product = await productModel.findOneById(laptopId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Product with laptopId ${laptopId} not found`)
    }
    if (quantity <= 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Quantity must be greater than 0')
    }
    if (product.quantity < quantity) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Insufficient stock. Only ${product.stock} items available for laptop ${laptopId}`
      )
    }

    // Kiểm tra item tồn tại trong giỏ hàng
    const existingItem = await cartItemModel.findOneByCartAndLaptop(cartId, laptopId)
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      if (product.quantity < newQuantity) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock. Only ${product.stock} items available after adding ${quantity}`
        )
      }
      return await cartItemModel.updateOneById(existingItem._id.toString(), {
        quantity: newQuantity,
        updatedAt: Date.now()
      })
    }

    // Tạo mới item nếu không tồn tại
    return await cartItemModel.createNew({ cartId, laptopId, quantity })
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Failed to add item to cart: ${error.message}`)
  }
}

const updateQuantity = async (cartItemId, quantity) => {
  try {
    // Kiểm tra item tồn tại
    const cartItem = await cartItemModel.findOneById(cartItemId)
    if (!cartItem) throw new ApiError(StatusCodes.NOT_FOUND, 'Cart item not found')

    // Kiểm tra quantity hợp lệ
    if (quantity <= 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Quantity must be greater than 0')
    }

    // Kiểm tra tồn kho
    const product = await productModel.findOneById(cartItem.laptopId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Product with laptopId ${cartItem.laptopId} not found`)
    }
    if (product.quantity < quantity) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Insufficient stock. Only ${product.quantity} items available for laptop ${cartItem.laptopId}`
      )
    }

    // Cập nhật số lượng
    return await cartItemModel.updateOneById(cartItemId, { quantity, updatedAt: Date.now() })
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Failed to update quantity: ${error.message}`)
  }
}

const deleteItem = async (cartItemId) => {
  try {
    const cartItem = await cartItemModel.findOneById(cartItemId)
    if (!cartItem) throw new ApiError(StatusCodes.NOT_FOUND, 'Cart item not found')
    return await cartItemModel.deleteOneById(cartItemId)
  } catch (error) {
    throw error
  }
}

const deleteCart = async (userId) => {
  try {
    const cart = await cartModel.findOneByUserId(userId)
    if (!cart) throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
    return await cartItemModel.deleteManyByCartId(cart._id.toString())
  } catch (error) {
    throw error
  }
}

export const cartService = {
  getAll,
  getByUserId,
  createOrUpdate,
  addItem,
  updateQuantity,
  deleteItem,
  deleteCart
}