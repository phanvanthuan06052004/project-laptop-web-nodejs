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
      return strategy.filter(filteredProducts, filterValues[filterType])
    }, products)
  }
}

export default CompositeFilterStrategy
