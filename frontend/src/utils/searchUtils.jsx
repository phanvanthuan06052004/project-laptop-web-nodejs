// Highlight matching text in search results
export const highlightMatch = (text, query) => {
  if (!query.trim() || !text) return text

  const searchLower = query.toLowerCase()
  const textLower = text.toString().toLowerCase()
  const index = textLower.indexOf(searchLower)

  if (index === -1) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const after = text.slice(index + query.length)

  return (
    <>
      {before}
      <span className="bg-yellow-100 dark:bg-yellow-700 font-medium">{match}</span>
      {after}
    </>
  )
}

// Extract brand name from product data
export const extractBrandName = (product, brandMap) => {
  // Try to get brand name from attributeGroup if available
  if (product.attributeGroup && Array.isArray(product.attributeGroup)) {
    const brandAttribute = product.attributeGroup.find((attr) => attr.name === "Thương hiệu" || attr.name === "Brand")
    if (brandAttribute && brandAttribute.values) {
      return brandAttribute.values
    }
  }

  // Try to get from brand map if brand object exists
  if (product.brand) {
    if (typeof product.brand === "object" && product.brand._id) {
      // Try from brand map first
      const brandFromMap = brandMap[product.brand._id]
      if (brandFromMap) return brandFromMap

      // If not in map, try to get name directly from brand object
      if (product.brand.name) return product.brand.name
    }
  }

  // Try to extract from product name
  const laptopBrands = ["Lenovo", "HP", "Dell", "Asus", "Acer", "MSI", "Apple", "Macbook", "Gigabyte", "LG"]
  for (const brand of laptopBrands) {
    if (product.name.includes(brand)) {
      return brand
    }
  }

  return "Unknown Brand"
}

// Extract type/category name from product data
export const extractTypeName = (product, typeMap) => {
  // Try to get type from attributeGroup if available
  if (product.attributeGroup && Array.isArray(product.attributeGroup)) {
    const typeAttribute = product.attributeGroup.find(
      (attr) => attr.name === "Nhu cầu" || attr.name === "Category" || attr.name === "Series model"
    )
    if (typeAttribute && typeAttribute.values) {
      return typeAttribute.values
    }
  }

  // Try to get from type map if type object exists
  if (product.type) {
    if (typeof product.type === "object" && product.type._id) {
      // Try from type map first
      const typeFromMap = typeMap[product.type._id]
      if (typeFromMap) return typeFromMap

      // If not in map, try to get name directly from type object
      if (product.type.name) return product.type.name
    }
  }

  // Try to extract from product name or displayName
  const laptopTypes = ["Gaming", "Văn phòng", "Ultrabook", "Workstation", "Mỏng nhẹ", "Đồ hoạ"]

  // Check displayName first if available
  if (product.displayName) {
    for (const type of laptopTypes) {
      if (product.displayName.includes(type)) {
        return type
      }
    }
  }

  // Then check name
  for (const type of laptopTypes) {
    if (product.name.includes(type)) {
      return type
    }
  }

  return "Laptop" // Default to "Laptop"
}
