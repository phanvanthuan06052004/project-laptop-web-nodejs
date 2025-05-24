import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setPage, setFilters, setSort, resetFilters } from "~/store/slices/productSlice"
import { createCompositeFilter } from "~/strategies/filters/createFilter"

/**
 * Custom hook to handle product filtering logic
 */
export const useProductFilter = () => {
  const dispatch = useDispatch()
  const { page, filters, sort: sortBy } = useSelector((state) => state.product)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")

  // Tạo composite filter và memoize nó
  const compositeFilter = useMemo(() => createCompositeFilter(), [])

  /**
   * Toggle a filter value
   */
  const toggleFilter = useCallback(
    (category, value) => {
      const newFilters = { ...filters }
      const current = newFilters[category] || []

      newFilters[category] = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]

      dispatch(setFilters(newFilters))
      // Reset to page 1 when changing filters
      dispatch(setPage(1))
    },
    [dispatch, filters]
  )

  /**
   * Change sort order
   */
  const handleSortChange = useCallback(
    (value) => {
      dispatch(setSort(value))
      dispatch(setPage(1))
    },
    [dispatch]
  )

  /**
   * Clear all active filters
   */
  const clearAllFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  /**
   * Check if we need client-side filtering
   */
  const needsClientFiltering = useCallback(() => {
    return (
      (filters.brands && filters.brands.length > 0) || // Any brand filter
      (filters.cpu && filters.cpu.length > 0) || // Any CPU filter
      (filters.ram && filters.ram.length > 0) || // Any RAM filter
      (filters.storage && filters.storage.length > 0) // Any storage filter
    )
  }, [filters])

  /**
   * Build query parameters for API call
   */
  const buildQueryParams = useCallback(
    (forAllProducts = false) => {
      const params = forAllProducts ? { limit: 300 } : { page, limit: 9 }

      // Handle sorting
      if (sortBy === "price-low") {
        params.sort = "price"
        params.order = "asc"
      } else if (sortBy === "price-high") {
        params.sort = "price"
        params.order = "desc"
      }

      // Add search query if present
      if (searchQuery) {
        params.name = searchQuery
      }

      // Handle price range filters
      if (filters.price && filters.price.length > 0) {
        const priceRanges = {
          "under-15000000": { min: 0, max: 15000000 },
          "15000000-25000000": { min: 15000000, max: 25000000 },
          "25000000-35000000": { min: 25000000, max: 35000000 },
          "35000000-50000000": { min: 35000000, max: 50000000 },
          "over-50000000": { min: 50000000, max: null }
        }

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

      // Handle brand filters - only for regular API calls
      if (!forAllProducts && filters.brands && filters.brands.length === 1) {
        params.brand = filters.brands[0]
      }

      return params
    },
    [filters, page, searchQuery, sortBy]
  )

  /**
   * Filter products client-side based on specs and other criteria
   */
  const filterProductsClientSide = useCallback(
    (products) => {
      if (!products || !products.length) return []
      return compositeFilter.filter(products, filters)
    },
    [filters, compositeFilter]
  )

  /**
   * Apply pagination to filtered products
   */
  const paginateProducts = useCallback((products, currentPage, itemsPerPage = 9) => {
    if (!products || products.length === 0) return []

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return products.slice(startIndex, endIndex)
  }, [])

  /**
   * Sort products client-side
   */
  const sortProducts = useCallback(
    (products) => {
      if (!products || !products.length) return products

      const sortedProducts = [...products]

      if (sortBy === "price-low") {
        sortedProducts.sort((a, b) => a.price - b.price)
      } else if (sortBy === "price-high") {
        sortedProducts.sort((a, b) => b.price - a.price)
      }

      return sortedProducts
    },
    [sortBy]
  )

  // Format display values for active filters
  const getDisplayValue = useCallback((category, value) => {
    if (category === "cpu") {
      if (value === "intel-core-ultra") return "Intel Core Ultra"
      if (value === "intel-core-i9") return "Intel Core i9"
      if (value === "intel-core-i7") return "Intel Core i7"
      if (value === "intel-core-i5") return "Intel Core i5"
      if (value === "amd-ryzen") return "AMD Ryzen"
    }

    if (category === "ram") {
      if (value === "32gb") return "32GB"
      if (value === "24gb") return "24GB"
      if (value === "16gb") return "16GB"
      if (value === "8gb") return "8GB"
    }

    if (category === "storage") {
      if (value === "1tb") return "1TB SSD"
      if (value === "512gb") return "512GB SSD"
    }

    if (category === "price") {
      if (value === "under-15000000") return "Under 15M₫"
      if (value === "15000000-25000000") return "15M₫ - 25M₫"
      if (value === "25000000-35000000") return "25M₫ - 35M₫"
      if (value === "35000000-50000000") return "35M₫ - 50M₫"
      if (value === "over-50000000") return "Over 50M₫"
    }

    return value
  }, [])

  return {
    filters,
    sortBy,
    page,
    searchQuery,
    toggleFilter,
    handleSortChange,
    clearAllFilters,
    buildQueryParams,
    filterProductsClientSide,
    paginateProducts,
    sortProducts,
    getDisplayValue,
    needsClientFiltering
  }
}
