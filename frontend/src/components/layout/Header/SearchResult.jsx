import { Link } from "react-router-dom"
import { Star } from "lucide-react"

import { highlightMatch } from "~/utils/searchUtils.jsx"

const SearchResults = ({ results, query, onResultClick }) => {
  if (results.length === 0) {
    return (
      <div className="py-4 px-4 text-center text-gray-500">
        No products found matching "{query}"
      </div>
    )
  }

  const limitedResults = results.slice(0, 3)

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      {limitedResults.map((product) => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
          onClick={onResultClick}
        >
          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="font-medium text-sm mb-1 line-clamp-1">
              {highlightMatch(product.name, query)}
            </h4>
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <span className="mr-2">{highlightMatch(product.brand, query)}</span>
              <span>{highlightMatch(product.category, query)}</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={`${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
              </div>
              <span className="text-xs ml-1">{product.rating}</span>
              <span className="text-sm font-medium ml-auto">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </Link>
      ))}

      {results.length > 3 && (
        <div className="p-3 text-center border-t border-gray-100">
          <Link
            to={`/products?search=${encodeURIComponent(query)}`}
            className="text-sm text-primary hover:underline"
            onClick={onResultClick}
          >
            View all {results.length} results
          </Link>
        </div>
      )}
    </div>
  )
}

export default SearchResults
