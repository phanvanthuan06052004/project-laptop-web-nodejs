import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

import { addItem } from "~/store/slices/cartSlice"
import { formatPrice } from "~/utils/formatPrice"

const ProductCard = ({ product }) => {
  const { _id, name, displayName, price, discount, mainImg, nameSlug } = product

  const dispatch = useDispatch()

  // Lấy thông số kỹ thuật chính từ mảng specs
  const specs = product.specs && product.specs.length > 0 ? product.specs[0] : null

  // Lấy tên thương hiệu từ attributeGroup
  const brandName = product.attributeGroup?.find((attr) => attr?.name === "Thương hiệu")?.values || ""

  // Tính giá sau khi giảm
  const discountedPrice = discount ? price - (price * discount) / 100 : null
  const finalPrice = discountedPrice || price

  const handleAddToCart = () => {
    try {
      dispatch(
        addItem({
          id: _id,
          name: displayName || name,
          price: finalPrice,
          quantity: 1,
          image: mainImg
        })
      )
      toast.success("Đã thêm vào giỏ hàng!")
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Thêm vào giỏ hàng thất bại. Vui lòng thử lại!")
    }
  }

  // Rút gọn các thông số kỹ thuật để hiển thị
  const simplifiedCpu = specs?.cpu ? specs.cpu.split("(")[0].trim() : ""
  const simplifiedRam = specs?.ram ? specs.ram.split("(")[0].trim() : ""
  const simplifiedStorage = specs?.storage ? specs.storage.split("(")[0].trim() : ""
  const simplifiedScreen = specs?.screen ? specs.screen.split(",").slice(0, 2).join(",") : ""


  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image with Discount Badge */}
      <div className="relative h-52 overflow-hidden">
        <Link to={`/product/slug/${nameSlug}`}>
          <img
            src={mainImg || "/images/laptop-placeholder.webp"}
            alt={displayName || name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{brandName}</div>
        <Link to={`/product/${_id}`} className="block">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-primary transition-colors line-clamp-2">
            {displayName || name}
          </h3>
        </Link>

        {/* Specs - Show more details on hover */}
        <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
          {simplifiedCpu && (
            <p className="line-clamp-1">
              <span className="font-medium">CPU:</span> {simplifiedCpu}
            </p>
          )}
          {simplifiedRam && (
            <p className="line-clamp-1">
              <span className="font-medium">RAM:</span> {simplifiedRam}
            </p>
          )}
          {simplifiedStorage && (
            <p className="line-clamp-1">
              <span className="font-medium">Storage:</span> {simplifiedStorage}
            </p>
          )}
          {simplifiedScreen && (
            <p className="line-clamp-1">
              <span className="font-medium">Display:</span> {simplifiedScreen}
            </p>
          )}
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(finalPrice)}₫</span>
            {discount > 0 && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">{formatPrice(price)}₫</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
