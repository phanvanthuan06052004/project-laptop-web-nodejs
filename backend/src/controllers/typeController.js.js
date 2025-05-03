// ~/controllers/typeController.js
import { StatusCodes } from 'http-status-codes'
import { typeService } from '~/services/typeService'

const getAll = async (req, res, next) => {
  try {
    const result = await typeService.getAll(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const newType = await typeService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newType)
  } catch (error) {
    next(error)
  }
}

const getTypeById = async (req, res, next) => {
  try {
    const result = await typeService.getTypeById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateType = async (req, res, next) => {
  try {
    const result = await typeService.updateType(req.params.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteType = async (req, res, next) => {
  try {
    const result = await typeService.deleteType(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const typeController = {
  getAll,
  createNew,
  getTypeById,
  updateType,
  deleteType
}
