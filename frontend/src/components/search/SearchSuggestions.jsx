import { Search } from "lucide-react"
import { highlightMatch } from "~/utils/searchUtils"

const SearchSuggestions = ({ suggestions, query, onSuggestionClick }) => {
  if (!suggestions.length) return null

  return (
    <div className="border-b border-gray-200">
      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Gợi ý</div>
      <ul className="max-h-[25vh] sm:max-h-[35vh] overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        {suggestions.map((suggestion, index) => (
          <li key={`suggestion-${index}`}>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <Search size={14} className="text-gray-400 mr-2 shrink-0" />
              <span className="min-w-0">{highlightMatch(suggestion, query)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchSuggestions
