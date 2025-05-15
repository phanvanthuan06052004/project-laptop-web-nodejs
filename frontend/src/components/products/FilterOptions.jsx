import { useState } from "react"
import { ChevronDown } from "lucide-react"

// Định nghĩa các tùy chọn lọc
const filterOptions = {
  price: [
    { id: "under-15000000", label: "Dưới 15 triệu" },
    { id: "15000000-25000000", label: "15 - 25 triệu" },
    { id: "25000000-35000000", label: "25 - 35 triệu" },
    { id: "35000000-50000000", label: "35 - 50 triệu" },
    { id: "over-50000000", label: "Trên 50 triệu" }
  ],
  cpu: [
    { id: "intel-core-ultra", label: "Intel Core Ultra" },
    { id: "intel-core-i9", label: "Intel Core i9" },
    { id: "intel-core-i7", label: "Intel Core i7" },
    { id: "intel-core-i5", label: "Intel Core i5" },
    { id: "amd-ryzen", label: "AMD Ryzen" }
  ],
  ram: [
    { id: "32gb", label: "32GB" },
    { id: "24gb", label: "24GB" },
    { id: "16gb", label: "16GB" },
    { id: "8gb", label: "8GB" }
  ],
  storage: [
    { id: "1tb", label: "1TB SSD" },
    { id: "512gb", label: "512GB SSD" }
  ]
}

export function FilterOptions({ activeFilters, toggleFilter, brands }) {
  // State để quản lý trạng thái đóng/mở của các mục lọc
  const [openSections, setOpenSections] = useState({
    brands: true,
    price: true,
    cpu: false,
    ram: false,
    storage: false
  })

  // Hàm toggle trạng thái đóng/mở
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Lọc ra các thương hiệu có sản phẩm
  const availableBrands = brands || []

  return (
    <div className="space-y-4">
      {/* Lọc theo thương hiệu */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => toggleSection("brands")}
          className="flex w-full justify-between items-center py-2 text-left text-sm font-medium"
        >
          <span className="text-gray-900 dark:text-gray-100">Thương hiệu</span>
          <ChevronDown
            size={16}
            className={`${openSections.brands ? "transform rotate-180" : ""} text-gray-500 transition-transform`}
          />
        </button>
        {openSections.brands && (
          <div className="pt-2 pb-4">
            <div className="space-y-2 max-h-60  pr-2">
              {availableBrands.map((brand) => (
                <div key={brand._id} className="flex items-center">
                  <input
                    id={`brand-${brand._id}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={(activeFilters.brands || []).includes(brand.slug)}
                    onChange={() => toggleFilter("brands", brand.slug)}
                  />
                  <label htmlFor={`brand-${brand._id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lọc theo giá */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => toggleSection("price")}
          className="flex w-full justify-between items-center py-2 text-left text-sm font-medium"
        >
          <span className="text-gray-900 dark:text-gray-100">Giá</span>
          <ChevronDown
            size={16}
            className={`${openSections.price ? "transform rotate-180" : ""} text-gray-500 transition-transform`}
          />
        </button>
        {openSections.price && (
          <div className="pt-2 pb-4">
            <div className="space-y-2">
              {filterOptions.price.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={`price-${option.id}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={(activeFilters.price || []).includes(option.id)}
                    onChange={() => toggleFilter("price", option.id)}
                  />
                  <label htmlFor={`price-${option.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lọc theo CPU */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => toggleSection("cpu")}
          className="flex w-full justify-between items-center py-2 text-left text-sm font-medium"
        >
          <span className="text-gray-900 dark:text-gray-100">CPU</span>
          <ChevronDown
            size={16}
            className={`${openSections.cpu ? "transform rotate-180" : ""} text-gray-500 transition-transform`}
          />
        </button>
        {openSections.cpu && (
          <div className="pt-2 pb-4">
            <div className="space-y-2">
              {filterOptions.cpu.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={`cpu-${option.id}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={(activeFilters.cpu || []).includes(option.id)}
                    onChange={() => toggleFilter("cpu", option.id)}
                  />
                  <label htmlFor={`cpu-${option.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lọc theo RAM */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => toggleSection("ram")}
          className="flex w-full justify-between items-center py-2 text-left text-sm font-medium"
        >
          <span className="text-gray-900 dark:text-gray-100">RAM</span>
          <ChevronDown
            size={16}
            className={`${openSections.ram ? "transform rotate-180" : ""} text-gray-500 transition-transform`}
          />
        </button>
        {openSections.ram && (
          <div className="pt-2 pb-4">
            <div className="space-y-2">
              {filterOptions.ram.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={`ram-${option.id}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={(activeFilters.ram || []).includes(option.id)}
                    onChange={() => toggleFilter("ram", option.id)}
                  />
                  <label htmlFor={`ram-${option.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lọc theo Storage */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => toggleSection("storage")}
          className="flex w-full justify-between items-center py-2 text-left text-sm font-medium"
        >
          <span className="text-gray-900 dark:text-gray-100">Lưu trữ</span>
          <ChevronDown
            size={16}
            className={`${openSections.storage ? "transform rotate-180" : ""} text-gray-500 transition-transform`}
          />
        </button>
        {openSections.storage && (
          <div className="pt-2 pb-4">
            <div className="space-y-2">
              {filterOptions.storage.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={`storage-${option.id}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={(activeFilters.storage || []).includes(option.id)}
                    onChange={() => toggleFilter("storage", option.id)}
                  />
                  <label htmlFor={`storage-${option.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
