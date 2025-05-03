// ~/controllers/brandController.js
import { StatusCodes } from 'http-status-codes'
import { brandService } from '~/services/brandService'

const getAll = async (req, res, next) => {
  try {
    const result = await brandService.getAll(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const newBrand = await brandService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newBrand)
  } catch (error) {
    next(error)
  }
}

const getBrandById = async (req, res, next) => {
  try {
    const result = await brandService.getBrandById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateBrand = async (req, res, next) => {
  try {
    const result = await brandService.updateBrand(req.params.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteBrand = async (req, res, next) => {
  try {
    const result = await brandService.deleteBrand(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const brandController = {
  getAll,
  createNew,
  getBrandById,
  updateBrand,
  deleteBrand
}