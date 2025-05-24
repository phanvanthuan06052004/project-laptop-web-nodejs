import FilterStrategy from "./FilterStrategy"

class CompositeFilterStrategy extends FilterStrategy {
  constructor() {
    super()
    this.strategies = []
  }

  addStrategy(strategy) {
    this.strategies.push(strategy)
    return this
  }

  filter(products, filterValues) {
    return this.strategies.reduce((filteredProducts, strategy) => {
      const filterType = strategy.constructor.name.toLowerCase().replace("filterstrategy", "")
      // Xử lý đặc biệt cho BrandFilterStrategy
      if (filterType === "brand") {
        return strategy.filter(filteredProducts, filterValues)
      }
      // Xử lý cho các strategy khác (CPU, RAM, etc.)
      return strategy.filter(filteredProducts, filterValues[filterType])
    }, products)
  }
}

export default CompositeFilterStrategy