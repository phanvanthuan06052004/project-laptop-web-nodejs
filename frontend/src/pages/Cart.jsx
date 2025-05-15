import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Trash2, Plus, Minus, ChevronLeft, ArrowRight, Truck, Wallet, CreditCard } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useDeleteItemMutation, useGetUserCartQuery, useUpdateQuantityMutation } from "~/store/apis/cartSlice"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "~/store/slices/authSlice"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Cart = () => {
  const navigate = useNavigate()
  const userId = useSelector(selectCurrentUser)?._id

  // Fetch cart data
  const { data: cartData, isLoading, error } = useGetUserCartQuery(userId, {
    skip: !userId // Chỉ gọi query khi userId là truthy (có giá trị)
  })
  // Mutations
  const [updateCartItem] = useUpdateQuantityMutation()
  const [removeCartItem] = useDeleteItemMutation()

  // Extract cart items
  const cartItems = cartData?.items || []

  const updateQuantity = async (id, newQuantity, maxQuantity, productName) => {
    if (newQuantity < 1) return
    if (newQuantity > maxQuantity) {
      toast.error(`Cannot add more "${productName}". Only ${maxQuantity} in stock.`)
      return
    }
    try {
      await updateCartItem({ cartItemId: id, quantity: newQuantity }).unwrap()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to update quantity:", err)
      toast.error("Sản phẩm không đủ hàng")
    }
  }

  const removeItem = async (id) => {
    try {
      await removeCartItem(id).unwrap()
      toast.success("Item removed from cart.")
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to remove item:", err)
      toast.error("Failed to remove item. Please try again.")
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
  const total = subtotal

  if (isLoading) {
    return <div className="text-center py-16">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">Error loading cart</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Something went wrong. Please try again later.
        </p>
        <Link to="/products">
          <Button variant="default">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="bg-gray-50 dark:bg-gray-800/50 py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Your Cart</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <ShoppingCart size={64} className="mx-auto text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link to="/products">
                <Button variant="default">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Shopping Cart ({cartItems.length} items)
                  </h2>
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="py-6 flex flex-col sm:flex-row gap-4"
                      >
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.product.mainImg}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.product.brand || "Unknown Brand"}
                              </p>
                            </div>
                            <p className="font-medium">
                              ₫{(item.product.price * item.quantity).toLocaleString("vi-VN")}
                            </p>
                          </div>
                          <span className="text-xl font-semibold text-red-500">
                            Còn lại {item?.product?.stock || "Unknown"} sản phẩm
                          </span>
                          <div className="mt-auto flex justify-between items-center pt-4">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                className="px-3 py-1"
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity - 1, item.product.quantity, item.product.name)
                                }
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3">{item.quantity}</span>
                              <button
                                className="px-3 py-1"
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1, item.product.quantity, item.product.name)
                                }
                                disabled={item.quantity >= item.product.quantity}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t mt-6">
                    <Link
                      to="/products"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  <div className="mb-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between py-2 border-b items-center">
                        <div className="flex items-center">
                          <span className="w-5 h-5 inline-flex items-center justify-center text-xl mr-2">
                            {item.quantity}
                          </span>
                          <span className="w-5 h-5 inline-flex items-center justify-center text-xs mr-2">
                            x
                          </span>
                          <span className="text-sm">{item.product.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            ₫{(item.product.price * item.quantity).toLocaleString("vi-VN")}
                          </span>
                          <button
                            className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                            title="Xóa sản phẩm"
                            onClick={() => removeItem(item._id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span>₫{subtotal.toLocaleString("vi-VN")}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₫{total.toLocaleString("vi-VN")}</span>
                    </div>
                  </div>

                  {/* Nút Proceed to Checkout */}
                  <div className="mt-6">
                    <Button
                      className="w-full"
                      onClick={() => navigate("/checkout", {
                        state: {
                          cartItems: cartItems.map(item => ({
                            productId: item.product._id,
                            productName: item.product.name,
                            price: item.product.price,
                            quantity: item.quantity,
                            avatar: item.product.mainImg
                          })),
                          subtotal: subtotal,
                          total: total
                        }
                      })}
                    >
                      Proceed to Checkout <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium mb-4">
                    Accepted Payment Methods
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="border p-3 rounded-md flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Truck size={20} />
                      <span>COD</span>
                    </div>
                    <div className="border p-3 rounded-md flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Wallet className="w-5 h-5 text-pink-500" />
                      <span>e-wallet</span>
                    </div>
                    <div className="border p-3 rounded-md flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <CreditCard size={20} />
                      <span>Bank</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Cart