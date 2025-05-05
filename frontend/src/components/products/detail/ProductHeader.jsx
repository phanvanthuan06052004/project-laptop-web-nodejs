import { Check, Star } from "lucide-react"
import { Link } from "react-router-dom"

const ProductHeader = ({ name, brand, rating, reviewCount, partNumber }) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-2">{name}</h1>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="flex items-center">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <a href="#reviews" className="text-primary hover:underline text-sm">
            {reviewCount} Đánh giá
          </a>
        </div>

        <span className="text-gray-400">|</span>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          Thương hiệu:{" "}
          <Link to="/products" className="text-primary hover:underline">
            {brand}
          </Link>
        </span>

        {partNumber && (
          <>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Mã sản phẩm: {partNumber}</span>
          </>
        )}
      </div>

      <div className="flex items-center text-sm text-green-600">
        <Check size={16} className="mr-1"/>
        Hàng chính hãng - Bảo hành toàn quốc
      </div>
    </div>
  )
}

export default ProductHeader
