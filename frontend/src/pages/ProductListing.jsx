import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"

import { ProductsGrid } from "~/components/products/ProductsGrid"
import { Pagination } from "~/components/ui/Pagination"
import { usePagination } from "~/hooks/usePagination"
import { useGetAllProductsQuery } from "~/store/apis/productSlice"
import { setPage, setSort } from "~/store/slices/productSlice"
import MetaTags from "~/components/seo/MetaTags"
import { ChevronDown } from "lucide-react"

export default function ProductListing() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")

  const dispatch = useDispatch()
  const { page, sort: sortBy } = useSelector((state) => state.product)

  // Xây dựng query params để gọi API - đã loại bỏ các bộ lọc
  const buildQueryParams = () => {
    const params = {
      page,
      limit: 9,
    }

    // Xử lý sắp xếp
    if (sortBy === "price-low") {
      params.sort = "price"
      params.order = "asc"
    } else if (sortBy === "price-high") {
      params.sort = "price"
      params.order = "desc"
    }

    // Thêm từ khóa tìm kiếm từ URL nếu có
    if (searchQuery) {
      params.search = searchQuery
    }

    return params
  }

  const queryParams = buildQueryParams()
  const { data, isLoading, isFetching, error } = useGetAllProductsQuery(queryParams)

  // Cấu hình phân trang
  const totalPages = data?.pagination?.totalPages || 1
  const totalItems = data?.pagination?.totalItems || 0
  const { handlePageChange, paginationButtons } = usePagination(totalPages, page, setPage)

  // Xử lý khi thay đổi sắp xếp
  const handleSortChange = (value) => {
    dispatch(setSort(value))
    dispatch(setPage(1))
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
                <ProductsGrid products={data?.products || []} />

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
