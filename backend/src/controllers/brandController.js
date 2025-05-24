import { StatusCodes } from 'http-status-codes'
import { brandService } from '~/services/brandService'
import proxyMiddleware from '~/middlewares/proxyMiddleware.js'

const originalController = {
  getAll: {
    proxyConfig: { allowedRoles: [] }, // Public access
    handler: async (req, res, next) => {
      try {
        const result = await brandService.getAll(req.query)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  createNew: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const newBrand = await brandService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(newBrand)
      } catch (error) {
        next(error)
      }
    }
  },
  getBrandById: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const result = await brandService.getBrandById(req.params.id)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  updateBrand: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const result = await brandService.updateBrand(req.params.id, req.body)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  },
  deleteBrand: {
    proxyConfig: { allowedRoles: ['admin'] },
    handler: async (req, res, next) => {
      try {
        const result = await brandService.deleteBrand(req.params.id)
        res.status(StatusCodes.OK).json(result)
      } catch (error) {
        next(error)
      }
    }
  }
}

export const brandController = proxyMiddleware(originalController)