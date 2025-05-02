import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { productModel } from '~/models/productModel'
import slugify from 'slugify' // Import the slugify library

const getAll = async (queryParams) => {
  try {
    let { page, limit, search, sort, order, brand, minPrice, maxPrice } = queryParams

    // Chuyển đổi page và limit sang số, đảm bảo giá trị mặc định nếu không hợp lệ
    page = parseInt(page, 10) || 1
    limit = parseInt(limit, 10) || 10

    // Chuyển đổi minPrice và maxPrice sang số nếu chúng tồn tại
    minPrice = minPrice !== undefined ? parseFloat(minPrice) : undefined
    maxPrice = maxPrice !== undefined ? parseFloat(maxPrice) : undefined

    // Tính toán skip
    const skip = (page - 1) * limit

    // Xây dựng bộ lọc
    const filter = { isDeleted: false } // Lọc các sản phẩm chưa bị xóa
    if (search) {
      filter.name = { $regex: search, $options: 'i' } // Tìm kiếm theo tên (không phân biệt hoa thường)
    }
    if (brand) {
      filter.brand = brand
    }
    if (minPrice !== undefined) {
      filter.price = { ...filter.price, $gte: minPrice }
    }
    if (maxPrice !== undefined) {
      filter.price = { ...filter.price, $lte: maxPrice }
    }

    // Xây dựng điều kiện sắp xếp
    const sortOptions = {}
    sortOptions[sort] = order === 'asc' ? 1 : -1

    // Gọi model để lấy dữ liệu
    const products = await productModel.getAllWithPagination({ filter, sort: sortOptions, skip, limit })

    // Tính tổng số bản ghi
    const totalCount = await productModel.countDocuments(filter)

    // Tính tổng số trang
    const totalPages = Math.ceil(totalCount / limit)

    return {
      products,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        totalPages,
        itemsPerPage: limit
      }
    }
  } catch (error) {
    throw error
  }
}


const createNew = async (reqBody) => {
  try {
    // Tạo slug từ tên sản phẩm
    const nameSlug = slugify(reqBody.name, { lower: true })

    // Kiểm tra xem sản phẩm đã tồn tại chưa (theo slug)
    const existingProduct = await productModel.findOneByNameSlug(nameSlug)
    if (existingProduct) {
      throw new ApiError(StatusCodes.CONFLICT, 'Product with this nameSlug already exists')
    }

    // Tạo sản phẩm mới
    const newProduct = {
      ...reqBody,
      nameSlug, // Sử dụng slug đã tạo
      createdAt: Date.now(),
      updatedAt: null,
      isDeleted: false,
      isPublish: false
    }
    const result = await productModel.createNew(newProduct)

    const createdProduct = await productModel.findOneById(result.insertedId)
    if (!createdProduct) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create product')
    }
    return createdProduct
  } catch (error) {
    throw error
  }
}

const getProductById = async (id) => {
  try {
    const product = await productModel.findOneById(id)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    return product
  } catch (error) {
    throw error
  }
}

const updateProduct = async (id, data) => {
  try {
    const checkExistProduct = await productModel.findOneById(id)
    if (!checkExistProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }

    const updatedData = {
      ...data,
      updatedAt: Date.now()
    }

    // Nếu có sự thay đổi ở trường 'name', tự động cập nhật 'nameSlug'
    if (data.name && data.name !== checkExistProduct.name) {
      updatedData.nameSlug = slugify(data.name, { lower: true })
    }

    const updatedProduct = await productModel.updateOneById(id, updatedData)

    if (!updatedProduct) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update product')
    }
    return updatedProduct
  } catch (error) {
    throw error
  }
}
const deleteProduct = async (id) => {
  try {
    const checkExistProduct = await productModel.findOneById(id)
    if (!checkExistProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    // Thay vì xóa hẳn, ta cập nhật trạng thái isDeleted
    const updatedData = {
      isDeleted: true,
      isPublish: false,
      updatedAt: Date.now()
    }
    const result = await productModel.updateOneById(id, updatedData)
    if (!result) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Product deletion failed'
      )
    }
    return { deleted: true }
  } catch (error) {
    throw error
  }
}

const getProductByNameSlug = async (nameSlug) => {
  try {
    const product = await productModel.findOneByNameSlug(nameSlug)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    return product
  } catch (error) {
    throw error
  }
}

const getPageProduct = async (queryParams) => {
  try {
    let { page, limit, name, minPrice, maxPrice, brand, specs, avgRating } = queryParams

    // Chuyển đổi page và limit sang số, đảm bảo giá trị mặc định nếu không hợp lệ
    page = parseInt(page, 10) || 1
    limit = parseInt(limit, 10) || 10

    // Chuyển đổi minPrice và maxPrice và avgRating sang số nếu chúng tồn tại
    minPrice = minPrice !== undefined ? parseFloat(minPrice) : undefined
    maxPrice = maxPrice !== undefined ? parseFloat(maxPrice) : undefined
    avgRating = avgRating !== undefined ? parseFloat(avgRating) : undefined

    const skip = (page - 1) * limit

    const filter = { isDeleted: false, isPublish: true }
    if (name) {
      filter.name = { $regex: name, $options: 'i' }
    }
    if (minPrice !== undefined) {
      filter.price = { ...filter.price, $gte: minPrice }
    }
    if (maxPrice !== undefined) {
      filter.price = { ...filter.price, $lte: maxPrice }
    }
    if (brand) {
      filter.brand = brand
    }
    if (specs && Array.isArray(specs) && specs.length > 0) {
      // Chuyển đổi mảng specs thành một truy vấn $elemMatch
      filter.specs = {
        $elemMatch: {
          $or: specs.map((spec) => ({
            $or: [
              { cpu: spec.cpu },
              { ram: spec.ram },
              { storage: spec.storage },
              { gpu: spec.gpu },
              { screen: spec.screen }
            ].filter(item => Object.values(item)[0] !== undefined) // Lọc bỏ các spec không có giá trị
          })).filter(item => Object.keys(item.$or).length > 0) // Lọc bỏ các $or rỗng
        }
      }
    }
    if (avgRating !== undefined) {
      filter.avgRating = { $gte: avgRating }
    }

    const products = await productModel.getAllWithPagination({
      filter,
      sort: { createdAt: -1 },
      skip,
      limit
    })

    const totalCount = await productModel.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)

    return {
      products,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        totalPages,
        itemsPerPage: limit
      }
    }
  } catch (error) {
    throw error
  }
}


export const productService = {
  getAll,
  createNew,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByNameSlug,
  getPageProduct
}
