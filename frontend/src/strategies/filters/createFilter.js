import BrandFilterStrategy from "./BrandFilterStrategy"
import PriceFilterStrategy from "./PriceFilterStrategy"
import CPUFilterStrategy from "./CPUFilterStrategy"
import RAMFilterStrategy from "./RAMFilterStrategy"
import StorageFilterStrategy from "./StorageFilterStrategy"
import CompositeFilterStrategy from "./CompositeFilterStrategy"

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
