import FilterStrategy from "./FilterStrategy"

class RAMFilterStrategy extends FilterStrategy {
  filter(products, ramSizes) {
    if (!ramSizes || !ramSizes.length) return products

    return products.filter((product) => {
      if (!product.specs || !product.specs.length) return false
      const ramInfo = product.specs[0].ram?.toLowerCase() || ""

      return ramSizes.some((ram) => {
        // For 32GB RAM filter
        if (ram === "32gb") {
          // Match exact 32GB configurations or 1 x 32GB
          if (/\b32gb\b/.test(ramInfo) || /\b1\s*x\s*32gb\b/.test(ramInfo)) return true
          // Match configurations like "2 x 16GB" (32GB total)
          if (/\b2\s*x\s*16gb\b/.test(ramInfo)) return true
          // Match configurations like "4 x 8GB" (32GB total)
          if (/\b4\s*x\s*8gb\b/.test(ramInfo)) return true
          // Match configurations like "16GB + 16GB" (32GB total)
          if (/\b16gb\s*\+\s*16gb\b/.test(ramInfo)) return true
          return false
        }

        // For 24GB RAM filter
        if (ram === "24gb") {
          // Match exact 24GB configurations or 1 x 24GB
          if (/\b24gb\b/.test(ramInfo) || /\b1\s*x\s*24gb\b/.test(ramInfo)) return true
          // Match configurations like "16GB + 8GB" (24GB total)
          if (/\b16gb\s*\+\s*8gb\b/.test(ramInfo) || /\b8gb\s*\+\s*16gb\b/.test(ramInfo)) return true
          // Match configurations like "3 x 8GB" (24GB total)
          if (/\b3\s*x\s*8gb\b/.test(ramInfo)) return true
          return false
        }

        // For 16GB RAM filter
        if (ram === "16gb") {
          // Match exact 16GB configurations or 1 x 16GB
          if (/\b16gb\b/.test(ramInfo) || /\b1\s*x\s*16gb\b/.test(ramInfo)) {
            // Exclude configurations that are parts of larger setups
            if (
              !/\b2\s*x\s*16gb\b/.test(ramInfo) && // Exclude "2 x 16GB" (32GB total)
              !/\b16gb\s*\+\s*16gb\b/.test(ramInfo) && // Exclude "16GB + 16GB" (32GB total)
              !/\b16gb\s*\+\s*8gb\b/.test(ramInfo) && // Exclude "16GB + 8GB" (24GB total)
              !/\b8gb\s*\+\s*16gb\b/.test(ramInfo) // Exclude "8GB + 16GB" (24GB total)
            ) {
              return true
            }
          }
          // Match configurations like "2 x 8GB" (16GB total)
          if (/\b2\s*x\s*8gb\b/.test(ramInfo)) return true
          return false
        }

        // For 8GB RAM filter
        if (ram === "8gb") {
          // Match exact 8GB configurations or 1 x 8GB
          if (/\b8gb\b/.test(ramInfo) || /\b1\s*x\s*8gb\b/.test(ramInfo)) {
            // Exclude configurations that are parts of larger setups
            if (
              !/\b2\s*x\s*8gb\b/.test(ramInfo) && // Exclude "2 x 8GB" (16GB total)
              !/\b3\s*x\s*8gb\b/.test(ramInfo) && // Exclude "3 x 8GB" (24GB total)
              !/\b4\s*x\s*8gb\b/.test(ramInfo) && // Exclude "4 x 8GB" (32GB total)
              !/\b8gb\s*\+\s*8gb\b/.test(ramInfo) && // Exclude "8GB + 8GB" (16GB total)
              !/\b8gb\s*\+\s*16gb\b/.test(ramInfo) && // Exclude "8GB + 16GB" (24GB total)
              !/\b16gb\s*\+\s*8gb\b/.test(ramInfo) // Exclude "8GB + 16GB" (24GB total)
            ) {
              return true
            }
          }
          return false
        }

        return false
      })
    })
  }
}

export default RAMFilterStrategy