import FilterStrategy from "./FilterStrategy"

class CPUFilterStrategy extends FilterStrategy {
  filter(products, cpuTypes) {
    if (!cpuTypes || !cpuTypes.length) return products

    return products.filter((product) => {
      if (!product.specs || !product.specs.length) return false
      const cpuInfo = product.specs[0].cpu?.toLowerCase() || ""

      return cpuTypes.some((cpu) => {
        if (cpu === "intel-core-ultra") return cpuInfo.includes("ultra")
        if (cpu === "intel-core-i9") return cpuInfo.includes("i9")
        if (cpu === "intel-core-i7") return cpuInfo.includes("i7")
        if (cpu === "intel-core-i5") return cpuInfo.includes("i5")
        if (cpu === "amd-ryzen") return cpuInfo.includes("ryzen")
        return false
      })
    })
  }
}

export default CPUFilterStrategy