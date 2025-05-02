// Kiểm tra product có match với query không
export const productMatchesSearch = (product, query) => {
  if (!query.trim()) return false

  const searchLower = query.toLowerCase().trim()

  if (product.name.toLowerCase().includes(searchLower)) return true
  if (product.brand.toLowerCase().includes(searchLower)) return true
  if (product.category.toLowerCase().includes(searchLower)) return true

  const specs = product.specs
  if (
    specs.cpu.toLowerCase().includes(searchLower) ||
    specs.ram.toLowerCase().includes(searchLower) ||
    specs.storage.toLowerCase().includes(searchLower) ||
    specs.display.toLowerCase().includes(searchLower) ||
    specs.gpu.toLowerCase().includes(searchLower) ||
    specs.os.toLowerCase().includes(searchLower)
  ) {
    return true
  }

  return false
}

// Trả về mảng product match với query
export const getSearchResults = (products, query) => {
  if (!query.trim()) return []
  return products.filter(product => productMatchesSearch(product, query))
}

// Highlight phần match trong text
export const highlightMatch = (text, query) => {
  if (!query.trim()) return text

  const searchLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  const index = textLower.indexOf(searchLower)

  if (index === -1) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const after = text.slice(index + query.length)

  return (
    <>
      {before}
      <span className="bg-yellow-100 font-medium">{match}</span>
      {after}
    </>
  )
}

// Gợi ý tìm kiếm dựa trên kết quả
export const generateSearchSuggestions = (query, results, limit = 5) => {
  if (!query.trim()) return []

  const suggestions = new Set()

  results.slice(0, limit).forEach(product => {
    suggestions.add(`${product.name}`)
  })

  const categories = new Set()
  results.forEach(product => categories.add(product.category))
  categories.forEach(category => {
    suggestions.add(`${query} in ${category}`)
  })

  const brands = new Set()
  results.forEach(product => brands.add(product.brand))
  brands.forEach(brand => {
    if (brand.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(`${brand} laptops`)
    }
  })

  return Array.from(suggestions).slice(0, limit)
}
