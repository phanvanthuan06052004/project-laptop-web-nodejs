import FilterStrategy from "./FilterStrategy"

class StorageFilterStrategy extends FilterStrategy {
  filter(products, storageSizes) {
    if (!storageSizes || !storageSizes.length) return products

    return products.filter((product) => {
      if (!product.specs || !product.specs.length) return false
      const storageInfo = product.specs[0].storage?.toLowerCase() || ""

      return storageSizes.some((storage) => {
        if (storage === "1tb") return storageInfo.includes("1tb")
        if (storage === "512gb") return storageInfo.includes("512gb")
        return false
      })
    })
  }
}

export default StorageFilterStrategy
