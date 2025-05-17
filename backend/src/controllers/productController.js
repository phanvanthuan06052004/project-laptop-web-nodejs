import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/productService/productService'

const getAll = async (req, res, next) => {
  try {
    const result = await productService.getAll(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const newProduct = await productService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newProduct)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const result = await productService.getProductById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body)
    console.log(result);
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getProductByNameSlug = async (req, res, next) => {
  try {
    const result = await productService.getProductByNameSlug(req.params.nameSlug)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getPageProduct = async (req, res, next) => {
  try {
    const result = await productService.getPageProduct(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getPageProductIdAndName = async (req, res, next) => {
  try {
    const result = await productService.getPageProductIdAndName(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


export const productController = {
  getAll,
  createNew,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByNameSlug,
  getPageProduct,
  getPageProductIdAndName
}
