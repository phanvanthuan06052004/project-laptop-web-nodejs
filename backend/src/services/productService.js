import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { productModel } from '~/models/productModel'
import slugify from 'slugify'
import { brandModel } from '~/models/brandModel'
import { typeModel } from '~/models/typeModel'

/**
 * Lấy danh sách sản phẩm dựa trên các tham số truy vấn.
 * @param {Object} queryParams - Các tham số truy vấn bao gồm page, limit, search, sort, order, brand, minPrice, maxPrice.
 * @returns {Promise<Object>} - Một đối tượng chứa danh sách sản phẩm và thông tin phân trang.
 * @throws {Error} - Nếu có lỗi xảy ra trong quá trình truy vấn.
 */
const getAll = async (queryParams) => {
  try {
    let { page, limit, search, sort, order, brand, minPrice, maxPrice } =
      queryParams

    // Chuyển đổi page và limit sang số nguyên, sử dụng giá trị mặc định nếu không hợp lệ
    page = parseInt(page, 10) || 1
    limit = parseInt(limit, 10) || 10

    // Chuyển đổi minPrice và maxPrice sang số nếu chúng được cung cấp
    minPrice = minPrice !== undefined ? parseFloat(minPrice) : undefined
    maxPrice = maxPrice !== undefined ? parseFloat(maxPrice) : undefined

    // Tính toán vị trí bắt đầu lấy dữ liệu dựa trên số trang và giới hạn
    const skip = (page - 1) * limit

    // Xây dựng bộ lọc truy vấn
    const filter = { isDeleted: false } // Chỉ lấy các sản phẩm chưa bị xóa
    if (search) {
      filter.name = { $regex: search, $options: 'i' } // Tìm kiếm không phân biệt hoa thường
    }
    if (brand) {
      filter.brand = brand
    }
    if (minPrice !== undefined) {
      filter.price = { ...filter.price, $gte: minPrice } // Lọc theo giá tối thiểu
    }
    if (maxPrice !== undefined) {
      filter.price = { ...filter.price, $lte: maxPrice } // Lọc theo giá tối đa
    }

    // Xây dựng tùy chọn sắp xếp
    const sortOptions = {}
    sortOptions[sort] = order === 'asc' ? 1 : -1 // Sắp xếp tăng dần hoặc giảm dần

    // Lấy dữ liệu sản phẩm từ database
    const products = await productModel.getAllWithPagination({
      filter,
      sort: sortOptions,
      skip,
      limit
    })

    // Đếm tổng số sản phẩm phù hợp với bộ lọc
    const totalCount = await productModel.countDocuments(filter)

    // Tính tổng số trang
    const totalPages = Math.ceil(totalCount / limit)

    // Trả về kết quả bao gồm danh sách sản phẩm và thông tin phân trang
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
    // Xử lý lỗi bằng cách ném lại để controller xử lý
    throw error
  }
}

/**
 * Tạo một sản phẩm mới.
 * @param {Object} reqBody - Dữ liệu của sản phẩm mới cần tạo.
 * @returns {Promise<Object>} - Sản phẩm đã được tạo.
 * @throws {Error} - Nếu có lỗi xảy ra trong quá trình tạo sản phẩm.
 */
const createNew = async (reqBody) => {
  try {
    // Tạo slug từ tên sản phẩm để sử dụng làm định danh duy nhất
    const nameSlug = slugify(reqBody.name, { lower: true })

    // Kiểm tra xem sản phẩm với slug này đã tồn tại chưa
    const existingProduct = await productModel.findOneByNameSlug(nameSlug)
    if (existingProduct) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Product with this nameSlug already exists'
      )
    }

    // Tạo đối tượng sản phẩm mới
    const newProduct = {
      ...reqBody,
      nameSlug, // Sử dụng slug đã tạo
      createdAt: Date.now(),
      updatedAt: null,
      isDeleted: false,
      isPublish: false
    }
    // Gọi model để thêm mới sản phẩm vào database
    const result = await productModel.createNew(newProduct)
    // Kiểm tra xem sản phẩm đã được tạo thành công chưa
    const createdProduct = await productModel.findOneById(result.insertedId)
    if (!createdProduct) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create product'
      )
    }
    return createdProduct
  } catch (error) {
    // Xử lý lỗi bằng cách ném lại để controller xử lý
    throw error
  }
}

/**
 * Lấy thông tin chi tiết của một sản phẩm theo ID.
 * @param {string} id - ID của sản phẩm cần lấy.
 * @returns {Promise<Object>} - Thông tin chi tiết của sản phẩm.
 * @throws {Error} - Nếu không tìm thấy sản phẩm hoặc có lỗi xảy ra.
 */
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

/**
 * Cập nhật thông tin của một sản phẩm theo ID.
 * @param {string} id - ID của sản phẩm cần cập nhật.
 * @param {Object} data - Dữ liệu mới để cập nhật sản phẩm.
 * @returns {Promise<Object>} - Kết quả cập nhật.
 * @throws {Error} - Nếu không tìm thấy sản phẩm hoặc có lỗi xảy ra trong quá trình cập nhật.
 */
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

    // Nếu tên sản phẩm thay đổi, cập nhật cả slug
    if (data.name && data.name !== checkExistProduct.name) {
      updatedData.nameSlug = slugify(data.name, { lower: true })
    }
    // Gọi hàm updateOneById của model để cập nhật
    const updatedProduct = await productModel.updateOneById(id, updatedData)

    if (!updatedProduct) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update product'
      )
    }
    return updatedProduct
  } catch (error) {
    throw error
  }
}

/**
 * Xóa một sản phẩm theo ID (thực chất là cập nhật trạng thái xóa).
 * @param {string} id - ID của sản phẩm cần xóa.
 * @returns {Promise<Object>} - Kết quả xóa.
 * @throws {Error} - Nếu không tìm thấy sản phẩm hoặc có lỗi xảy ra trong quá trình xóa.
 */
const deleteProduct = async (id) => {
  try {
    const checkExistProduct = await productModel.findOneById(id)
    if (!checkExistProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    // Thay vì xóa vĩnh viễn, cập nhật trạng thái isDeleted
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

/**
 * Lấy thông tin chi tiết của một sản phẩm theo slug.
 * @param {string} nameSlug - Slug của sản phẩm cần lấy.
 * @returns {Promise<Object>} - Thông tin chi tiết của sản phẩm.
 * @throws {Error} - Nếu không tìm thấy sản phẩm.
 */
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

/**
 * Lấy danh sách sản phẩm theo trang với các tùy chọn lọc.
 * @param {Object} queryParams - Các tham số truy vấn để lọc và phân trang.
 * @returns {Promise<Object>} - Danh sách sản phẩm và thông tin phân trang.
 * @throws {Error} - Nếu có lỗi xảy ra trong quá trình truy vấn.
 */

const getPageProduct = async (queryParams) => {
  try {
    let { page, limit, name, minPrice, maxPrice, brand, type, specs, avgRating } = queryParams

    // Chuyển đổi các tham số
    page = parseInt(page, 10) || 1
    limit = parseInt(limit, 10) || 10
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

    // Lọc theo brand (dựa trên name)
    if (brand) {
      const brandDoc = await brandModel.findOneByName(brand)
      if (!brandDoc) {
        return {
          products: [],
          pagination: {
            totalItems: 0,
            currentPage: page,
            totalPages: 0,
            itemsPerPage: limit
          },
          message: `No brand found with name: ${brand}`
        }
      }
      filter['brand._id'] = brandDoc._id.toString() // Filter on brand._id
    }

    // Lọc theo type (dựa trên name)
    if (type) {
      const typeDoc = await typeModel.findOneByName(type)
      if (!typeDoc) {
        return {
          products: [],
          pagination: {
            totalItems: 0,
            currentPage: page,
            totalPages: 0,
            itemsPerPage: limit
          },
          message: `No type found with name: ${type}`
        }
      }
      filter['type._id'] = typeDoc._id.toString() // Filter on type._id
    }

    // Lọc theo specs
    if (specs && Array.isArray(specs) && specs.length > 0) {
      filter.specs = {
        $elemMatch: {
          $or: specs
            .map((spec) => {
              const specFilters = []
              if (spec.cpu) specFilters.push({ cpu: spec.cpu })
              if (spec.ram) specFilters.push({ ram: spec.ram })
              if (spec.storage) specFilters.push({ storage: spec.storage })
              if (spec.gpu) specFilters.push({ gpu: spec.gpu })
              if (spec.screen) specFilters.push({ screen: spec.screen })
              return { $or: specFilters }
            })
            .filter((orCondition) => orCondition.$or.length > 0)
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

const getPageProductIdAndName = async (queryParams) => {
  try {
    let { page, limit, name, brand, type } = queryParams

    // Chuyển đổi các tham số
    page = parseInt(page, 10) || 1
    limit = parseInt(limit, 10) || 10

    const skip = (page - 1) * limit

    const filter = { isDeleted: false, isPublish: true }

    if (name) {
      filter.name = { $regex: name, $options: 'i' }
    }

    // Lọc theo brand (dựa trên name)
    if (brand) {
      const brandDoc = await brandModel.findOneByName(brand)
      if (!brandDoc) {
        return {
          products: [],
          pagination: {
            totalItems: 0,
            currentPage: page,
            totalPages: 0,
            itemsPerPage: limit
          },
          message: `No brand found with name: ${brand}`
        }
      }
      filter['brand._id'] = brandDoc._id.toString() // Filter on brand._id
    }

    // Lọc theo type (dựa trên name)
    if (type) {
      const typeDoc = await typeModel.findOneByName(type)
      if (!typeDoc) {
        return {
          products: [],
          pagination: {
            totalItems: 0,
            currentPage: page,
            totalPages: 0,
            itemsPerPage: limit
          },
          message: `No type found with name: ${type}`
        }
      }
      filter['type._id'] = typeDoc._id.toString() // Filter on type._id
    }


    const products = await productModel.getAllWithPagination({
      filter,
      sort: { createdAt: -1 },
      skip,
      limit,
      projection: { _id: 1, name: 1 } // Chỉ lấy _id và name
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


export default getPageProduct
export const productService = {
  getAll,
  createNew,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByNameSlug,
  getPageProduct,
  getPageProductIdAndName
}
