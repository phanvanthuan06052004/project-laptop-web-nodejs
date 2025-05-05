import { Check, AlertTriangle } from "lucide-react"
import { formatPrice } from "~/utils/formatPrice"

const ProductPrice = ({ price, oldPrice, inStock }) => {
  // Calculate discount percentage
  const discountPercentage = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

  return (
    <div className="my-6">
      <div className="flex items-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(price)}₫</span>
        {oldPrice && <span className="ml-3 text-lg text-gray-500 line-through">{formatPrice(oldPrice)}₫</span>}
        {oldPrice && (
          <span className="ml-3 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">
            {discountPercentage}% GIẢM
          </span>
        )}
      </div>

      <div className="mt-2">
        {inStock ? (
          <p className="text-green-500 flex items-center">
            <Check size={16} className="mr-1" /> Còn hàng - Giao hàng trong 24h
          </p>
        ) : (
          <p className="text-amber-500 flex items-center">
            <AlertTriangle size={16} className="mr-1" /> Tạm hết hàng - Liên hệ để đặt trước
          </p>
        )}
      </div>

      {/* Installment payment option */}
      <div className="mt-3 text-sm bg-blue-50 text-blue-700 p-2 rounded-md">
        Trả góp 0%: chỉ từ {formatPrice(Math.round(price / 12))}₫/tháng
      </div>
    </div>
  )
}

export default ProductPrice
