import FilterStrategy from "./FilterStrategy"

class BrandFilterStrategy extends FilterStrategy {
  filter(products, brandSlugs) {
    if (!brandSlugs || !brandSlugs.length) return products

    return products.filter((product) => {
      const brandAttribute = product.attributeGroup?.find(
        (attr) => attr.name === "Thương hiệu"
      )
      const brandDisplay = brandAttribute?.values.toLowerCase() || ""
      
      return brandSlugs.some((brand) => {
        // Nếu chọn "macbook" thì khớp với "apple"
        if (brand === "macbook" && brandDisplay === "apple") {
          return true
        }
        // Các trường hợp khác
        return brand === brandDisplay
      })
    })
  }
}

export default BrandFilterStrategy