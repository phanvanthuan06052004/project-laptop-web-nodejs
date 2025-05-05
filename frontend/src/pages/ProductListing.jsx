import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Filter, SlidersHorizontal, ChevronDown, X } from "lucide-react"

import { FilterOptions } from "~/components/products/FilterOptions"
import { ProductsGrid } from "~/components/products/ProductsGrid"
import { Pagination } from "~/components/ui/Pagination"
import { usePagination } from "~/hooks/usePagination"
import { useGetProductsQuery, useLazyGetProductsQuery } from "~/store/apis/productSlice"
import { setPage, setFilters, setSort } from "~/store/slices/productSlice"
import { useGetBrandsQuery } from "~/store/apis/brandSlice"
import MetaTags from "~/components/seo/MetaTags"

export default function ProductListing() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const filterRef = useRef(null)

  const dispatch = useDispatch()
  const { page, filters, sort: sortBy } = useSelector((state) => state.product)

  // Lấy danh sách thương hiệu để làm tuỳ chọn lọc
  const { data: brandsData } = useGetBrandsQuery({ limit: 100 })

  // Lấy toàn bộ sản phẩm để làm dữ liệu lọc (dùng limit lớn)
  const [fetchAllProducts, { data: allProductsData }] = useLazyGetProductsQuery()

  // Gọi API lấy toàn bộ sản phẩm khi component được mount
  useEffect(() => {
    fetchAllProducts({ limit: 100 }) // Lấy nhiều sản phẩm để có đầy đủ tuỳ chọn lọc
  }, [fetchAllProducts])

  // Cập nhật state allProducts khi có dữ liệu trả về
  useEffect(() => {
    if (allProductsData?.products) {
      setAllProducts(allProductsData.products)
    }
  }, [allProductsData])

  // Xoá tất cả các bộ lọc
  const clearAllFilters = () => {
    dispatch(
      setFilters({
        brands: [],
        price: [],
        ram: [],
        cpu: [],
        storage: []
      })
    )
    dispatch(setPage(1))
  }

  // Xây dựng query params để gọi API - sử dụng search parameter cho các bộ lọc
  const buildQueryParams = () => {
    const params = {
      page,
      limit: 9
    }

    // Xử lý sắp xếp
    if (sortBy === "price-low") {
      params.sort = "price"
      params.order = "asc"
    } else if (sortBy === "price-high") {
      params.sort = "price"
      params.order = "desc"
    }

    // Xử lý lọc theo khoảng giá
    if (filters.price && filters.price.length > 0) {
      const priceRanges = {
        "dưới-15000000": { min: 0, max: 15000000 },
        "15000000-25000000": { min: 15000000, max: 25000000 },
        "25000000-35000000": { min: 25000000, max: 35000000 },
        "35000000-50000000": { min: 35000000, max: 50000000 },
        "over-50000000": { min: 50000000, max: null }
      }

      // Tìm min và max price từ các bộ lọc được chọn
      let minPrice = Number.MAX_SAFE_INTEGER
      let maxPrice = 0

      filters.price.forEach((priceRange) => {
        const range = priceRanges[priceRange]
        if (range) {
          minPrice = Math.min(minPrice, range.min)
          if (range.max !== null) {
            maxPrice = Math.max(maxPrice, range.max)
          } else {
            maxPrice = Number.MAX_SAFE_INTEGER
          }
        }
      })

      if (minPrice !== Number.MAX_SAFE_INTEGER) {
        params.minPrice = minPrice
      }

      if (maxPrice !== Number.MAX_SAFE_INTEGER && maxPrice !== 0) {
        params.maxPrice = maxPrice
      }
    }

    // Xây dựng chuỗi tìm kiếm cho các bộ lọc (brand, CPU, RAM, storage)
    const searchTerms = []

    // Thêm tên thương hiệu vào searchTerms
    if (filters.brands && filters.brands.length > 0) {
      searchTerms.push(...filters.brands)
    }

    // Thêm các bộ lọc CPU
    if (filters.cpu && filters.cpu.length > 0) {
      const cpuTerms = filters.cpu.map((cpu) => {
        if (cpu === "intel-core-ultra") return "Ultra"
        if (cpu === "intel-core-i7") return "i7"
        if (cpu === "intel-core-i5") return "i5"
        return cpu
      })
      searchTerms.push(...cpuTerms)
    }

    // Thêm bộ lọc RAM - khớp với định dạng trong specs
    if (filters.ram && filters.ram.length > 0) {
      const ramTerms = filters.ram.map((ram) => {
        if (ram === "32gb") return "32GB"
        if (ram === "16gb") return "16GB"
        if (ram === "8gb") return "8GB"
        return ram
      })
      searchTerms.push(...ramTerms)
    }

    // Thêm bộ lọc Storage - khớp với định dạng trong specs
    if (filters.storage && filters.storage.length > 0) {
      const storageTerms = filters.storage.map((storage) => {
        if (storage === "1tb") return "1TB"
        if (storage === "512gb") return "512GB"
        return storage
      })
      searchTerms.push(...storageTerms)
    }

    // Thêm chuỗi search vào param nếu có từ khoá
    if (searchTerms.length > 0) {
      params.search = searchTerms.join(" ")
    }

    return params
  }

  const queryParams = buildQueryParams()
  const { data, isLoading, isFetching, error } = useGetProductsQuery(queryParams)

  // Lọc phía client để chính xác hơn
  const [filteredProducts, setFilteredProducts] = useState([])
  const [filteredPagination, setFilteredPagination] = useState(null)

  // Cập nhật kết quả lọc phía client
  useEffect(() => {
    if (data?.products) {
      let products = [...data.products]

      // Lọc theo RAM
      if (filters.ram && filters.ram.length > 0) {
        products = products.filter((product) => {
          if (!product.specs || !product.specs.length) return false
          const ramInfo = product.specs[0].ram?.toLowerCase() || ""
          return filters.ram.some((ram) => {
            if (ram === "32gb") return ramInfo.includes("32gb")
            if (ram === "16gb") return ramInfo.includes("16gb")
            if (ram === "8gb") return ramInfo.includes("8gb")
            return false
          })
        })
      }

      // Lọc theo CPU
      if (filters.cpu && filters.cpu.length > 0) {
        products = products.filter((product) => {
          if (!product.specs || !product.specs.length) return false
          const cpuInfo = product.specs[0].cpu?.toLowerCase() || ""
          return filters.cpu.some((cpu) => {
            if (cpu === "intel-core-ultra") return cpuInfo.includes("ultra")
            if (cpu === "intel-core-i7") return cpuInfo.includes("i7")
            if (cpu === "intel-core-i5") return cpuInfo.includes("i5")
            return false
          })
        })
      }

      // Lọc theo Storage
      if (filters.storage && filters.storage.length > 0) {
        products = products.filter((product) => {
          if (!product.specs || !product.specs.length) return false
          const storageInfo = product.specs[0].storage?.toLowerCase() || ""
          return filters.storage.some((storage) => {
            if (storage === "1tb") return storageInfo.includes("1tb")
            if (storage === "512gb") return storageInfo.includes("512gb")
            return false
          })
        })
      }

      setFilteredProducts(products)

      // Cập nhật lại pagination nếu danh sách đã bị lọc
      if (products.length !== data.products.length) {
        setFilteredPagination({
          ...data.pagination,
          totalItems: products.length,
          totalPages: Math.ceil(products.length / 9)
        })
      } else {
        setFilteredPagination(null)
      }
    }
  }, [data, filters])

  // Cấu hình phân trang
  const totalPages = filteredPagination?.totalPages || data?.pagination?.totalPages || 1
  const totalItems = filteredPagination?.totalItems || data?.pagination?.totalItems || 0
  const { handlePageChange, paginationButtons } = usePagination(totalPages, page, setPage)

  // Toggle bộ lọc
  const toggleFilter = (category, value) => {
    const newFilters = { ...filters }
    const current = newFilters[category] || []

    newFilters[category] = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]

    dispatch(setFilters(newFilters))
    // Reset về trang 1 khi thay đổi bộ lọc
    dispatch(setPage(1))
  }

  // Xử lý khi thay đổi sắp xếp
  const handleSortChange = (value) => {
    dispatch(setSort(value))
    dispatch(setPage(1))
  }

  // Làm filter sidebar "dính" khi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const headerHeight = 80 // Chiều cao gần đúng của header
        const scrollTop = window.scrollY

        if (scrollTop > headerHeight) {
          filterRef.current.style.top = "20px"
        } else {
          filterRef.current.style.top = `${headerHeight - scrollTop + 20}px`
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Thiết lập vị trí ban đầu

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [page])

  return (
    <>
      <MetaTags
        title="Bộ Sưu Tập Laptop - Tìm Chiếc Máy Hoàn Hảo Của Bạn"
        description="Khám phá bộ sưu tập laptop toàn diện của chúng tôi. Lọc theo thương hiệu, hiệu năng, giá cả và tìm chiếc laptop lý tưởng cho công việc, chơi game hoặc sử dụng cá nhân."
      />

      <div className="bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Mua Laptop</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Khám phá bộ sưu tập laptop đa dạng từ các thương hiệu hàng đầu
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:justify-center">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center justify-center space-x-2 w-full py-2 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4"
          >
            <Filter size={18} />
            <span>Filter Products</span>
          </button>

          <aside className={`lg:block lg:w-64 flex-shrink-0 ${isMobileFilterOpen ? "block" : "hidden"}`}>
            <div
              ref={filterRef}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <SlidersHorizontal size={18} className="mr-2" /> Filters
                </h2>
                {Object.values(filters).some((arr) => arr && arr.length > 0) && (
                  <button onClick={clearAllFilters} className="text-sm text-primary hover:underline">
                    Clear All
                  </button>
                )}
              </div>
              <FilterOptions
                activeFilters={filters}
                toggleFilter={toggleFilter}
                brands={brandsData?.brands || []}
                allProducts={allProducts}
              />
            </div>
          </aside>

          <div className="flex-grow lg:max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                Hiển thị <span className="font-semibold">{totalItems}</span> sản phẩm
              </p>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                >
                  <option value="featured">Nổi bật</option>
                  <option value="price-low">Giá: Thấp đến cao</option>
                  <option value="price-high">Giá: Cao đến thấp</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>

            <div className="mb-6">
              {Object.entries(filters).map(
                ([category, values]) =>
                  values &&
                  values.length > 0 && (
                    <div key={category} className="flex flex-wrap gap-2 mb-2">
                      {values.map((value) => {
                        // Format display values for filter types
                        let displayValue = value

                        if (category === "cpu") {
                          if (value === "intel-core-ultra") displayValue = "Intel Core Ultra"
                          if (value === "intel-core-i7") displayValue = "Intel Core i7"
                          if (value === "intel-core-i5") displayValue = "Intel Core i5"
                        }

                        if (category === "ram") {
                          if (value === "32gb") displayValue = "32GB"
                          if (value === "16gb") displayValue = "16GB"
                          if (value === "8gb") displayValue = "8GB"
                        }

                        if (category === "storage") {
                          if (value === "1tb") displayValue = "1TB SSD"
                          if (value === "512gb") displayValue = "512GB SSD"
                        }

                        if (category === "price") {
                          if (value === "under-15000000") displayValue = "Under 15M₫"
                          if (value === "15000000-25000000") displayValue = "15M₫ - 25M₫"
                          if (value === "25000000-35000000") displayValue = "25M₫ - 35M₫"
                          if (value === "35000000-50000000") displayValue = "35M₫ - 50M₫"
                          if (value === "over-50000000") displayValue = "Over 50M₫"
                        }

                        return (
                          <div
                            key={value}
                            className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            <span>{displayValue}</span>
                            <button
                              onClick={() => toggleFilter(category, value)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">Error loading products. Please try again later.</p>
                <p className="text-sm mt-2">{error.toString()}</p>
              </div>
            ) : (
              <>
                <ProductsGrid products={filteredProducts.length > 0 ? filteredProducts : data?.products || []} />

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  paginationButtons={paginationButtons}
                  handlePageChange={handlePageChange}
                  isLoading={isFetching}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
