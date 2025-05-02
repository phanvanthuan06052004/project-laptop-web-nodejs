import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import { toast } from "react-toastify"

import { products } from "~/data/product"
import { getSearchResults, generateSearchSuggestions, highlightMatch } from "~/utils/searchUtils.jsx"
import SearchResults from "./SearchResult"

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        showResults
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showResults])

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      const results = getSearchResults(products, query)
      setSearchResults(results)
      const newSuggestions = generateSearchSuggestions(query, results)
      setSuggestions(newSuggestions)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setShowResults(value.trim().length > 0)
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    const results = getSearchResults(products, suggestion)
    setSearchResults(results)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose()
    }
    if (e.key === "Enter" && query.trim()) {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (!query.trim()) return

    if (searchResults.length === 0) {
      toast.error( `Không tìm thấy bất kì sản phẩm nào phù hợp với "${query}"`)
      return
    }

    if (searchResults.length === 1) {
      navigate(`/product/${searchResults[0].id}`)
      onClose()
    } else {
      navigate(`/products?search=${encodeURIComponent(query)}`)
      onClose()
    }
  }

  const handleResultClick = () => {
    onClose()
  }

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search
            size={20}
            className={`${isSearching ? "text-primary animate-pulse" : "text-gray-400"}`}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for laptops, brands, or specifications..."
          className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {isSearching && (
            <div className="w-4 h-4 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          )}
          {query && (
            <button
              onClick={() => {
                setQuery("")
                setSuggestions([])
                setSearchResults([])
                inputRef.current?.focus()
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Search Dropdown */}
      {showResults && query.trim().length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl overflow-hidden">
          {suggestions.length > 0 && (
            <div className="border-b border-gray-200">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                Suggestions
              </div>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={`suggestion-${index}`}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search size={14} className="text-gray-400 mr-2" />
                      <span>{highlightMatch(suggestion, query)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Results Section */}
          <div>
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase flex justify-between items-center">
              <span>Products</span>
              <span className="text-xs text-gray-500">{searchResults.length} found</span>
            </div>
            <SearchResults
              results={searchResults}
              query={query}
              onResultClick={handleResultClick}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
