/**
 * Interface cho các chiến lược lọc sản phẩm
 */
class FilterStrategy {
  /**
   * Lọc danh sách sản phẩm theo tiêu chí cụ thể
   * @param {Array} products - Danh sách sản phẩm cần lọc
   * @param {any} filterValue - Giá trị lọc
   * @returns {Array} - Danh sách sản phẩm đã được lọc
   */
  filter(products, filterValue) {
    throw new Error("Method filter() must be implemented")
  }
}

export default FilterStrategy
