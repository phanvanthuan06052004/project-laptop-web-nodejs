import BrandFilterStrategy from "./BrandFilterStrategy"
import PriceFilterStrategy from "./PriceFilterStrategy"
import CPUFilterStrategy from "./CPUFilterStrategy"
import RAMFilterStrategy from "./RAMFilterStrategy"
import StorageFilterStrategy from "./StorageFilterStrategy"
import CompositeFilterStrategy from "./CompositeFilterStrategy"

/**
 * Factory function để tạo chiến lược lọc
 * @param {string} type - Loại chiến lược lọc
 * @returns {FilterStrategy} - Chiến lược lọc tương ứng
 */
export const createFilter = (type) => {
  switch (type) {
    case "brand":
      return new BrandFilterStrategy()
    case "price":
      return new PriceFilterStrategy()
    case "cpu":
      return new CPUFilterStrategy()
    case "ram":
      return new RAMFilterStrategy()
    case "storage":
      return new StorageFilterStrategy()
    case "composite":
      return new CompositeFilterStrategy()
    default:
      throw new Error(`Unknown filter type: ${type}`)
  }
}

/**
 * Tạo composite filter với tất cả các chiến lược
 * @returns {CompositeFilterStrategy} - Composite filter
 */
export const createCompositeFilter = () => {
  const composite = new CompositeFilterStrategy()
  return composite
    .addStrategy(new BrandFilterStrategy())
    .addStrategy(new PriceFilterStrategy())
    .addStrategy(new CPUFilterStrategy())
    .addStrategy(new RAMFilterStrategy())
    .addStrategy(new StorageFilterStrategy())
}