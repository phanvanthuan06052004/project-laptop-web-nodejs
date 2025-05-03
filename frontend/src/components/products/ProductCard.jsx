import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { Heart, Star, ShoppingCart } from "lucide-react"

import { addItem } from "~/store/slices/cartSlice"

const ProductCard = ({ product }) => {
  const { id, name, price, image, rating, reviewCount, brand, oldPrice, discount, inStock } = product
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    try {
      dispatch(
        addItem({
          id,
          name,
          price,
          quantity: 1
        })
      )
      toast.success("Đã thêm vào giỏ hàng!")
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Lỗi khi thêm vào giỏ hàng:", error)
      toast.error("Thêm vào giỏ hàng thất bại. Vui lòng thử lại!")
    }
  }


  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image with Discount Badge */}
      <div className="relative h-52 overflow-hidden">
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        {discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart size={16} />
        </button>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {brand}
        </div>
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-semibold text-gray-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
            {oldPrice && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {inStock && (
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white transition-colors"
              aria-label="Add to cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
