import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const FilterSection = ({ title, isOpen, toggleSection, options, activeValues, onToggleFilter, filterKey }) => {
  return (
    <div className="border-b pb-2">
      <button
        className="flex items-center justify-between w-full py-2 font-medium text-sm"
        onClick={() => toggleSection(filterKey)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="space-y-1 mt-1 pl-1">
          {options.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer py-1">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                checked={activeValues?.includes(option.value)}
                onChange={() => onToggleFilter(filterKey, option.value)}
              />
              <span className="ml-2 text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export const FilterOptions = ({ activeFilters, toggleFilter, brands = [], allProducts = [] }) => {
  const [openSections, setOpenSections] = useState({
    brands: true,
    price: true,
    cpu: true,
    ram: true,
    storage: true
  })

  // Hàm bật/tắt hiển thị từng nhóm bộ lọc
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const [filterOptions, setFilterOptions] = useState({
    priceRanges: [
      { value: "under-15000000", label: "Dưới 15.000.000₫" },
      { value: "15000000-25000000", label: "15.000.000₫ - 25.000.000₫" },
      { value: "25000000-35000000", label: "25.000.000₫ - 35.000.000₫" },
      { value: "35000000-50000000", label: "35.000.000₫ - 50.000.000₫" },
      { value: "over-50000000", label: "Trên 50.000.000₫" }
    ],
    cpuOptions: [],
    ramOptions: [],
    storageOptions: []
  })

  // Tạo các tùy chọn từ dữ liệu sản phẩm
  const extractFilterOptions = (products) => {
    const cpuSet = new Set()
    const ramSet = new Set()
    const storageSet = new Set()

    products.forEach((product) => {
      if (!product.specs || product.specs.length === 0) return

      // Trích xuất loại CPU
      const cpuInfo = product.specs[0].cpu?.toLowerCase() || ""
      if (cpuInfo.includes("ultra")) {
        cpuSet.add("intel-core-ultra")
      } else if (cpuInfo.includes("i7")) {
        cpuSet.add("intel-core-i7")
      } else if (cpuInfo.includes("i5")) {
        cpuSet.add("intel-core-i5")
      }

      // Trích xuất dung lượng RAM
      const ramInfo = product.specs[0].ram?.toLowerCase() || ""
      if (ramInfo.includes("32gb")) {
        ramSet.add("32gb")
      } else if (ramInfo.includes("16gb")) {
        ramSet.add("16gb")
      } else if (ramInfo.includes("8gb")) {
        ramSet.add("8gb")
      }

      // Trích xuất dung lượng lưu trữ
      const storageInfo = product.specs[0].storage?.toLowerCase() || ""
      if (storageInfo.includes("1tb")) {
        storageSet.add("1tb")
      } else if (storageInfo.includes("512gb")) {
        storageSet.add("512gb")
      }
    })

    // Ánh xạ các bộ lọc CPU
    const cpuOptions = Array.from(cpuSet).map((value) => {
      const labels = {
        "intel-core-ultra": "Intel Core Ultra",
        "intel-core-i7": "Intel Core i7",
        "intel-core-i5": "Intel Core i5"
      }
      return { value, label: labels[value] || "CPU không xác định" }
    })

    // Ánh xạ các bộ lọc RAM
    const ramOptions = Array.from(ramSet).map((value) => {
      const labels = {
        "32gb": "32GB",
        "16gb": "16GB",
        "8gb": "8GB"
      }
      return { value, label: labels[value] || "RAM không xác định" }
    })

    // Ánh xạ các bộ lọc lưu trữ
    const storageOptions = Array.from(storageSet).map((value) => {
      const labels = {
        "1tb": "1TB SSD",
        "512gb": "512GB SSD"
      }
      return { value, label: labels[value] || "Lưu trữ không xác định" }
    })

    return { cpuOptions, ramOptions, storageOptions }
  }

  // Cập nhật bộ lọc khi dữ liệu sản phẩm thay đổi
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const options = extractFilterOptions(allProducts)
      setFilterOptions(prev => ({
        ...prev,
        ...options
      }))
    }
  }, [allProducts])

  // Chuẩn bị dữ liệu thương hiệu để hiển thị
  const brandOptions = brands.map(brand => ({
    value: brand.name,
    label: brand.name
  }))

  // Định nghĩa cấu trúc các section lọc
  const filterSections = [
    {
      key: "brands",
      title: "Thương hiệu",
      options: brandOptions,
      activeValues: activeFilters.brands
    },
    {
      key: "price",
      title: "Giá",
      options: filterOptions.priceRanges,
      activeValues: activeFilters.price
    },
    {
      key: "cpu",
      title: "CPU",
      options: filterOptions.cpuOptions,
      activeValues: activeFilters.cpu
    },
    {
      key: "ram",
      title: "RAM",
      options: filterOptions.ramOptions,
      activeValues: activeFilters.ram
    },
    {
      key: "storage",
      title: "Lưu trữ",
      options: filterOptions.storageOptions,
      activeValues: activeFilters.storage
    }
  ]

  return (
    <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 pb-4">
      {filterSections.map((section) => (
        <FilterSection
          key={section.key}
          title={section.title}
          isOpen={openSections[section.key]}
          toggleSection={toggleSection}
          options={section.options}
          activeValues={section.activeValues}
          onToggleFilter={toggleFilter}
          filterKey={section.key}
        />
      ))}
    </div>
  )
}
