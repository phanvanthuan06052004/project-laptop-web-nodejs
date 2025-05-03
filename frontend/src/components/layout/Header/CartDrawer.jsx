import { Link } from "react-router-dom"
import { X, ShoppingCart, ArrowRight, Trash2, Plus, Minus } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "~/components/ui/Button"
import {
  selectCartItems,
  selectCartTotal,
  removeItem,
  updateQuantity
} from "~/store/slices/cartSlice"

const DEFAULT_LAPTOP = "/images/laptop-placeholder.webp"

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6 border-b">
              <h2 className="text-xl font-medium flex items-center">
                <ShoppingCart className="mr-2" size={24} />
                Giỏ hàng của bạn ({items.length})
              </h2>
              <button
                className="rounded-md p-2 hover:bg-gray-100"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <ShoppingCart size={64} className="text-gray-300 mb-4" />
                  <p className="text-lg font-medium mb-4">
                    Chưa có sản phẩm nào trong giỏ
                  </p>
                  <Button onClick={onClose}>Tiếp tục mua sắm</Button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image || DEFAULT_LAPTOP}
                          alt={item.name || "Product"}
                          className="h-full w-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium">
                          <h4>{item.name || "Product"}</h4>
                          <p className="ml-4">
                            ₫
                            {typeof item.price === "number"
                              ? item.price.toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              className="px-2 py-1 hover:bg-gray-100"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity - 1
                                  })
                                )
                              }
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              className="px-2 py-1 hover:bg-gray-100"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity + 1
                                  })
                                )
                              }
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            className="text-primary hover:text-red-500"
                            onClick={() => dispatch(removeItem(item.id))}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-between text-base font-medium mb-4">
                  <p>Tổng tiền</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Phí vận chuyển và thuế sẽ tính khi thanh toán.
                </p>
                <Link
                  to="/checkout"
                  onClick={onClose}
                >
                  <Button className='w-full mb-4' size="sm">
                    Thanh toán
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                >
                  <Button className='w-full mb-4' variant="secondary" size="sm">Xem giỏ hàng</Button>
                </Link>
                <button
                  onClick={onClose}
                  className="text-sm text-primary hover:underline"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer
