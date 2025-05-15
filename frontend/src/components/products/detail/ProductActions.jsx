/* eslint-disable no-console */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, ShoppingCart, CreditCard } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"

import { useAddItemMutation } from "~/store/apis/cartSlice"
import { selectCurrentUser } from "~/store/slices/authSlice"
import { addItem } from "~/store/slices/cartSlice"

const ProductActions = ({ inStock, product, quantity: maxQuantity }) => {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [addItemApi] = useAddItemMutation()
  const userId = useSelector(selectCurrentUser)?._id

  const handleAddToCart = async () => {
    try {
      const addData = await addItemApi({
        userId: userId,
        laptopId: product.id,
        quantity: quantity,
      })

      if (addData?.data) {
        toast.success("Đã thêm vào giỏ hàng!")
      } else {
        toast.error("Sản phẩm không đủ hàng")
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error)
      toast.error("Thêm vào giỏ hàng thất bại. Vui lòng thử lại!")
    }
  }

  const handleBuyNow = () => {
    try {
      dispatch(
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        })
      )
      navigate("/checkout")
    } catch (error) {
      console.error("Lỗi khi mua ngay:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!")
    }
  }

  // Giới hạn số lượng không vượt quá maxQuantity
  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1)
    } else {
      toast.error(`Chỉ còn ${maxQuantity} sản phẩm trong kho!`)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={!inStock || quantity <= 1}
          >
            -
          </button>
          <span className="px-3">{quantity}</span>
          <button
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
            onClick={handleIncrease}
            disabled={!inStock || quantity >= maxQuantity}
          >
            +
          </button>
        </div>
        <button
          className={`flex-grow flex items-center justify-center py-3 px-4 rounded-md ${
            inStock && quantity <= maxQuantity
              ? "bg-primary hover:bg-primary-dark dark:hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!inStock || quantity > maxQuantity}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} className="mr-2" />
          {inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
        </button>
        <button
          className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors dark:hover:bg-gray-500"
          aria-label="Thêm vào danh sách yêu thích"
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          className={`py-3 px-4 rounded-md flex items-center justify-center ${
            inStock && quantity <= maxQuantity
              ? "bg-gray-800 hover:bg-gray-900 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!inStock || quantity > maxQuantity}
          onClick={handleBuyNow}
        >
          Mua ngay
        </button>
        <button
          className="py-3 px-4 rounded-md border border-primary text-primary hover:bg-primary/5 flex items-center justify-center"
          disabled={!inStock || quantity > maxQuantity}
        >
          <CreditCard size={18} className="mr-2" />
          Mua trả góp
        </button>
      </div>
      {inStock && quantity > maxQuantity && (
        <p className="text-red-500 mt-2">
          Chỉ còn {maxQuantity} sản phẩm trong kho
        </p>
      )}
    </div>
  )
}

export default ProductActions