import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Filter, SlidersHorizontal, ChevronDown, X } from "lucide-react"

import { FilterOptions } from "~/components/products/FilterOptions"
import { ProductsGrid } from "~/components/products/ProductsGrid"
import { Pagination } from "~/components/ui/Pagination"
import { usePagination } from "~/hooks/usePagination"
import { useGetAllProductsQuery, useLazyGetAllProductsQuery } from "~/store/apis/productSlice"
import { useGetBrandsQuery } from "~/store/apis/brandSlice"
import { useProductFilter } from "~/hooks/useProductFilter"
import { setPage } from "~/store/slices/productSlice"
import MetaTags from "~/components/seo/MetaTags"

export default function ProductListing() {
  // Basic UI state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const filterRef = useRef(null)
  const dispatch = useDispatch()

  // Get filter state from Redux
  const { page, filters, sort: sortBy } = useSelector((state) => state.product)

  // Get brands for filter options
  const { data: brandsData } = useGetBrandsQuery({ limit: 10 })

  // Get filter methods from custom hook
  const {
    toggleFilter,
    handleSortChange,
    clearAllFilters,
    buildQueryParams,
    filterProductsClientSide,
    paginateProducts,
    sortProducts,
    getDisplayValue,
    needsClientFiltering
  } = useProductFilter()

  // Determine if we need client-side filtering
  const needsClientSideFiltering = needsClientFiltering()

  // API queries
  const [fetchAllProducts, { data: allProductsData, isLoading: isLoadingAll }] = useLazyGetAllProductsQuery()

  const {
    data: apiFilteredData,
    isLoading: isLoadingApi,
    isFetching,
    error
  } = useGetAllProductsQuery(buildQueryParams(), {
    skip: needsClientSideFiltering
  })

  // State for client-side filtered data
  const [clientFilteredProducts, setClientFilteredProducts] = useState([])
  const [clientPaginationInfo, setClientPaginationInfo] = useState(null)

  // Track if we've already fetched all products
  const hasInitiallyFetched = useRef(false)

  // Fetch all products for client-side filtering (only once)
  useEffect(() => {
    if (needsClientSideFiltering && !hasInitiallyFetched.current) {
      // console.log("Fetching all products for client filtering")
      fetchAllProducts(buildQueryParams(true))
      hasInitiallyFetched.current = true
    }
  }, [needsClientSideFiltering, fetchAllProducts, buildQueryParams])

  // Apply client-side filtering when data or filters change
  useEffect(() => {
    if (!needsClientSideFiltering || !allProductsData?.products) {
      return
    }

    // Apply filters
    const filtered = filterProductsClientSide(allProductsData.products)

    // Apply sorting
    const sorted = sortProducts(filtered)

    // Calculate pagination
    const itemsPerPage = 9
    const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage))

    // Get current page items
    const currentPageItems = paginateProducts(sorted, page, itemsPerPage)

    // Update state
    setClientFilteredProducts(currentPageItems)
    setClientPaginationInfo({
      totalItems: sorted.length,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage
    })

    // console.log(`Client filtering: ${sorted.length} total products, showing ${currentPageItems.length} on page ${page}`)
  }, [
    needsClientSideFiltering,
    allProductsData,
    filters,
    sortBy,
    page,
    filterProductsClientSide,
    sortProducts,
    paginateProducts
  ])

  // Determine which products to display
  const displayProducts = needsClientSideFiltering ? clientFilteredProducts : apiFilteredData?.products || []

  // Determine pagination info
  const totalPages = needsClientSideFiltering
    ? clientPaginationInfo?.totalPages || 1
    : apiFilteredData?.pagination?.totalPages || 1

  const totalItems = needsClientSideFiltering
    ? clientPaginationInfo?.totalItems || 0
    : apiFilteredData?.pagination?.totalItems || 0

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage))
  }

  // Setup pagination
  const { paginationButtons } = usePagination(totalPages, page, handlePageChange)

  // Determine loading state
  const isLoading = (needsClientSideFiltering && isLoadingAll) || (!needsClientSideFiltering && isLoadingApi)

  // Make filter sidebar sticky when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const headerHeight = 80
        const scrollTop = window.scrollY
        filterRef.current.style.top = scrollTop > headerHeight ? "20px" : `${headerHeight - scrollTop + 20}px`
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Scroll to top when page changes
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
            Khám phá bộ sưu tập Laptop đa dạng từ các thương hiệu hàng đầu
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
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky transition-all duration-200 max-h-[calc(100vh-120px)] overflow-y-auto"
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
              <FilterOptions activeFilters={filters} toggleFilter={toggleFilter} brands={brandsData?.brands || []} />
            </div>
          </aside>

          <div className="flex-grow lg:max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                Hiển thị <span className="font-semibold">{totalItems}</span> sản phẩm
                {needsClientSideFiltering && allProductsData?.products && (
                  <span className="ml-2 text-xs text-primary">
                    (Lọc từ {allProductsData.products.length || 0} sản phẩm)
                  </span>
                )}
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
                      {values.map((value) => (
                        <div
                          key={value}
                          className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{getDisplayValue(category, value)}</span>
                          <button
                            onClick={() => toggleFilter(category, value)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
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
                {error.data && (
                  <p className="text-sm mt-1 text-gray-600">
                    {typeof error.data === "object" ? JSON.stringify(error.data) : error.data}
                  </p>
                )}
              </div>
            ) : (
              <>
                <ProductsGrid products={displayProducts} />

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  paginationButtons={paginationButtons}
                  handlePageChange={handlePageChange}
                  isLoading={isFetching || isLoadingAll}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
