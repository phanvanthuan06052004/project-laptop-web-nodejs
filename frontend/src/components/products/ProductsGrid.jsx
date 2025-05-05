import { Search } from "lucide-react"
import ProductCard from "./ProductCard"

export const ProductsGrid = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="col-span-full py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-gray-500 mb-4">Chúng tôi không thể tìm thấy bất kì sản phẩm nào khớp với tiêu chí của bạn.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
