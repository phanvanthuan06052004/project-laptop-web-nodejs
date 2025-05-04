import { useMemo } from "react"
import { Link } from "react-router-dom"
import { highlightMatch } from "~/utils/searchUtils"

const SearchResults = ({ results, query, onResultClick }) => {

  const limitedResults = useMemo(() => results.slice(0, 3), [results])
  const hasMoreResults = useMemo(() => results.length > 3, [results])

  return (
    <div>
      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase flex justify-between items-center">
        <span>Sản phẩm</span>
        <span className="text-xs text-gray-500">{results.length} kết quả</span>
      </div>
      <div className="max-h-[40vh] sm:max-h-[50vh] overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        {limitedResults.map((product) => (
          <Link
            to={`/product/slug/${product.slug}`}
            key={product.id}
            className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            onClick={onResultClick}
          >
            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              <img
                src={product.image || "/images/laptop-placeholder.webp"}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/images/laptop-placeholder.webp"
                }}
              />
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-medium text-sm mb-1 line-clamp-1">{highlightMatch(product.name, query)}</h4>
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <span className="mr-2">{highlightMatch(product.brand, query)}</span>
                <span>{highlightMatch(product.category, query)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium ml-auto">{product.price.toLocaleString()} ₫</span>
              </div>
            </div>
          </Link>
        ))}

        {/* "Xem tất cả kết quả" */}
        {hasMoreResults && (
          <div className="p-3 text-center border-t border-gray-100">
            <Link
              to={`/products?search=${encodeURIComponent(query)}`}
              className="text-sm text-primary hover:underline"
              onClick={onResultClick}
            >
              Xem tất cả {results.length} kết quả
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
