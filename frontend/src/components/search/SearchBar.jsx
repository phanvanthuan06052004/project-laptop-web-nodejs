/* eslint-disable no-console */
import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import { toast } from "react-toastify"

import { useLazySearchProductsQuery } from "~/store/apis/productSlice"
import useDebounce from "~/hooks/useDebounce"
import { useLazyGetBrandsQuery } from "~/store/apis/brandSlice"
import { useLazyGetTypesQuery } from "~/store/apis/typeSlice"
import SearchResults from "./SearchResults"
import { extractBrandName, extractTypeName } from "~/utils/searchUtils"

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [brandMap, setBrandMap] = useState({})
  const [typeMap, setTypeMap] = useState({})

  const inputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const navigate = useNavigate()

  const debouncedQuery = useDebounce(query, 300)

  const [searchProducts, { isFetching }] = useLazySearchProductsQuery()
  const [getBrands] = useLazyGetBrandsQuery()
  const [getTypes] = useLazyGetTypesQuery()

  // Load brands và types
  const loadBrandsAndTypes = useCallback(async () => {
    try {
      const [brandsResult, typesResult] = await Promise.all([
        getBrands({ limit: 100 }).unwrap(),
        getTypes({ limit: 100 }).unwrap()
      ])

      if (brandsResult?.brands) {
        const newBrandMap = {}
        brandsResult.brands.forEach((brand) => {
          newBrandMap[brand._id] = brand.name
        })
        setBrandMap(newBrandMap)
      }

      if (typesResult?.types) {
        const newTypeMap = {}
        typesResult.types.forEach((type) => {
          newTypeMap[type._id] = type.name
        })
        setTypeMap(newTypeMap)
      }
    } catch (error) {
      console.error("Error loading reference data:", error)
    }
  }, [getBrands, getTypes])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target) && showResults) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showResults])

  // Xử lý overflow khi hiển thị kết quả tìm kiếm
  useEffect(() => {
    if (showResults && searchResults.length > 0) {
      // Sử dụng position: fixed cho body thay vì overflow: hidden để tránh giật trên mobile
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.top = `-${window.scrollY}px`
    } else {
      // Khôi phục scroll position khi đóng kết quả tìm kiếm
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.top = ""
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1)
      }
    }

    // Cleanup khi component unmount
    return () => {
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.top = ""
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1)
      }
    }
  }, [showResults, searchResults.length])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Xử lý tìm kiếm khi query thay đổi
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      return
    }

    // Tránh tìm kiếm lặp lại với cùng một query
    const fetchData = async () => {
      setIsSearching(true)
      try {
        // Chỉ load brands và types một lần khi cần
        if (Object.keys(brandMap).length === 0 || Object.keys(typeMap).length === 0) {
          await loadBrandsAndTypes()
        }

        const result = await searchProducts(debouncedQuery.trim()).unwrap()

        if (result?.products?.length > 0) {
          // Format data for SearchResults component
          const formattedResults = result.products.map((product) => ({
            id: product._id,
            name: product.name,
            slug: product.nameSlug,
            brand: extractBrandName(product, brandMap),
            category: extractTypeName(product, typeMap),
            price: product.price,
            rating: product.avgRating || 0,
            image: product.mainImg || "/images/laptop-placeholder.webp"
          }))

          setSearchResults(formattedResults)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error("Search error:", error)
        toast.error("Lỗi khi tìm kiếm sản phẩm")
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    fetchData()

    // Chỉ phụ thuộc vào debouncedQuery để tránh vòng lặp
  }, [debouncedQuery, searchProducts, loadBrandsAndTypes, brandMap, typeMap])

  const handleChange = (e) => {
    const value = e.target.value
    if (value === "" || !value.startsWith(" ")) {
      setQuery(value)
      setShowResults(value.trim().length > 0)
    }
  }

  const handleSearch = useCallback(() => {
    if (!query.trim()) return

    if (searchResults.length === 0) {
      toast.error(`Không tìm thấy bất kì sản phẩm nào phù hợp với "${query}"`)
      return
    }

    if (searchResults.length === 1) {
      navigate(`/product/slug/${searchResults[0].slug}`)
      onClose()
    } else {
      navigate(`/products?search=${encodeURIComponent(query)}`)
      onClose()
    }
  }, [query, searchResults, navigate, onClose])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose()
      }
      if (e.key === "Enter" && query.trim()) {
        handleSearch()
      }
    },
    [query, onClose, handleSearch]
  )
  const handleClearSearch = () => {
    setQuery("")
    setSearchResults([])
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search
            size={20}
            className={`${isSearching || isFetching ? "text-primary animate-pulse" : "text-gray-400 dark:text-gray-500"}`}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm laptop, thương hiệu, hoặc thông số kỹ thuật..."
          className="w-full py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {(isSearching || isFetching) && (
            <div className="w-4 h-4 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          )}
          {query && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Search Dropdown */}
      {showResults && query.trim().length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-xl overflow-hidden">
          {searchResults.length > 0 ? (
            <SearchResults results={searchResults} query={query} onResultClick={onClose} />
          ) : (
            !isSearching && (
              <div className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                Không tìm thấy sản phẩm nào phù hợp với "{query}"
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
