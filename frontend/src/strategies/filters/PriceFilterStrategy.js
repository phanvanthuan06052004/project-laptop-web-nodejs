import FilterStrategy from "./FilterStrategy"

class PriceFilterStrategy extends FilterStrategy {
  filter(products, priceRanges) {
    if (!priceRanges || !priceRanges.length) return products

    const priceRangeMap = {
      "under-15000000": { min: 0, max: 15000000 },
      "15000000-25000000": { min: 15000000, max: 25000000 },
      "25000000-35000000": { min: 25000000, max: 35000000 },
      "35000000-50000000": { min: 35000000, max: 50000000 },
      "over-50000000": { min: 50000000, max: Number.MAX_SAFE_INTEGER }
    }

    return products.filter((product) => {
      return priceRanges.some((range) => {
        const { min, max } = priceRangeMap[range]
        return product.price >= min && product.price <= max
      })
    })
  }
}

export default PriceFilterStrategy
