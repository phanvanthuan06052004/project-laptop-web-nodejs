import FilterStrategy from "./FilterStrategy"

class BrandFilterStrategy extends FilterStrategy {
  filter(products, filters) {
    const brandSlugs = filters?.brands || []
    
    if (!brandSlugs.length) {
      return products
    }

    const filteredProducts = products.filter((product) => {
      if (!product.attributeGroup || !Array.isArray(product.attributeGroup)) {
        return false
      }

      const brandAttribute = product.attributeGroup.find(
        (attr) => attr.name === "Thương hiệu"
      )

      if (!brandAttribute || !brandAttribute.values) {
        return false
      }

      const brandValue = brandAttribute.values.toLowerCase().trim()
      
      return brandSlugs.some((brandSlug) => {
        if (brandSlug === "macbook") {
          return brandValue === "apple"
        }
        
        const brandValueSlug = brandValue
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
        
        return brandSlug === brandValueSlug
      })
    })

    return filteredProducts
  }
}

export default BrandFilterStrategy