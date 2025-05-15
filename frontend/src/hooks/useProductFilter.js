"use client"

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { setPage, setFilters, setSort, resetFilters } from "~/store/slices/productSlice"

/**
 * Custom hook to handle product filtering logic
 */
export const useProductFilter = () => {
  const dispatch = useDispatch()
  const { page, filters, sort: sortBy } = useSelector((state) => state.product)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")

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
    [dispatch, filters],
  )

  /**
   * Change sort order
   */
  const handleSortChange = useCallback(
    (value) => {
      dispatch(setSort(value))
      dispatch(setPage(1))
    },
    [dispatch],
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
      // If we're fetching all products for client-side filtering,
      // use a large limit and skip pagination
      if (forAllProducts) {
        const params = {
          limit: 300, // Fetch a large number of products
        }

        // Still apply price filters on the server to reduce data
        if (filters.price && filters.price.length > 0) {
          const priceRanges = {
            "under-15000000": { min: 0, max: 15000000 },
            "15000000-25000000": { min: 15000000, max: 25000000 },
            "25000000-35000000": { min: 25000000, max: 35000000 },
            "35000000-50000000": { min: 35000000, max: 50000000 },
            "over-50000000": { min: 50000000, max: null },
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

        // Add search query if present
        if (searchQuery) {
          params.name = searchQuery
        }

        return params
      }

      // Regular query params for standard API calls
      const params = {
        page,
        limit: 9,
      }

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
          "over-50000000": { min: 50000000, max: null },
        }

        // Find min and max from selected price ranges
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
      if (filters.brands && filters.brands.length === 1) {
        params.brand = filters.brands[0]
      }

      return params
    },
    [filters, page, searchQuery, sortBy],
  )

  /**
   * Filter products client-side based on specs and other criteria
   */
  const filterProductsClientSide = useCallback(
    (products) => {
      if (!products || !products.length) return []

      let filteredProducts = [...products]

      // Filter by brands
      if (filters.brands && filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          const brandAttribute = product.attributeGroup?.find((attr) => attr.name === "Thương hiệu")
          const brandName = brandAttribute?.values || ""
          return filters.brands.some((brand) => brandName === brand)
        })
      }

      // Filter by RAM
      if (filters.ram && filters.ram.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.specs || !product.specs.length) return false
          const ramInfo = product.specs[0].ram?.toLowerCase() || ""

          return filters.ram.some((ram) => {
            if (ram === "32gb") {
              // Check for 32GB total RAM
              if (ramInfo.includes("32gb")) return true
              if (ramInfo.includes("2 x 16gb")) return true
              if (ramInfo.includes("4 x 8gb")) return true
              return false
            }
            if (ram === "16gb") {
              // Check for 16GB total RAM
              if (ramInfo.includes("16gb") && !ramInfo.includes("2 x 16gb")) return true
              if (ramInfo.includes("2 x 8gb")) return true
              return false
            }
            if (ram === "8gb") {
              // Check for 8GB total RAM
              if (ramInfo.includes("8gb") && !ramInfo.includes("2 x 8gb")) return true
              return false
            }
            return false
          })
        })
      }

      // Filter by CPU
      if (filters.cpu && filters.cpu.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.specs || !product.specs.length) return false
          const cpuInfo = product.specs[0].cpu?.toLowerCase() || ""

          return filters.cpu.some((cpu) => {
            if (cpu === "intel-core-ultra") return cpuInfo.includes("ultra")
            if (cpu === "intel-core-i7") return cpuInfo.includes("i7")
            if (cpu === "intel-core-i5") return cpuInfo.includes("i5")
            if (cpu === "amd-ryzen") return cpuInfo.includes("ryzen")
            return false
          })
        })
      }

      // Filter by Storage
      if (filters.storage && filters.storage.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.specs || !product.specs.length) return false
          const storageInfo = product.specs[0].storage?.toLowerCase() || ""

          return filters.storage.some((storage) => {
            if (storage === "1tb") return storageInfo.includes("1tb")
            if (storage === "512gb") return storageInfo.includes("512gb")
            return false
          })
        })
      }

      return filteredProducts
    },
    [filters],
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
    [sortBy],
  )

  // Format display values for active filters
  const getDisplayValue = useCallback((category, value) => {
    if (category === "cpu") {
      if (value === "intel-core-ultra") return "Intel Core Ultra"
      if (value === "intel-core-i7") return "Intel Core i7"
      if (value === "intel-core-i5") return "Intel Core i5"
      if (value === "amd-ryzen") return "AMD Ryzen"
    }

    if (category === "ram") {
      if (value === "32gb") return "32GB"
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
    needsClientFiltering,
  }
}
