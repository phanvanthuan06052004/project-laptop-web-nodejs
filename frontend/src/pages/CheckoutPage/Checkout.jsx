import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Check, ChevronRight } from "lucide-react"
import { Button } from "~/components/ui/button"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ShippingStep from "./ShippingStep"
import PaymentStep from "./PaymentStep"
import ReviewStep from "./ReviewStep"
import { useCreateOrderMutation } from "~/store/apis/orderSlice"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser } from "~/store/slices/authSlice"
import { useDeleteCartMutation } from "~/store/apis/cartSlice"
import { useApplyCouponMutation } from "~/store/apis/couponSlice"
import { selectCartItems, clearCart, removeItem } from "~/store/slices/cartSlice"

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)
  const [createOrder] = useCreateOrderMutation()
  const [deleteCart] = useDeleteCartMutation()
  const [applyCoupon] = useApplyCouponMutation()

  // Lấy cartItems từ location state (khi chuyển từ Cart.jsx)
  const locationCartItems = location.state?.cartItems || []
  // Lấy cartItems từ Redux store (khi chọn Buy Now từ ProductActions.jsx)
  const reduxCartItems = useSelector(selectCartItems)

  // Sử dụng cartItems từ location state nếu có, nếu không thì dùng từ Redux store
  const cartItems = locationCartItems.length > 0 ? locationCartItems : reduxCartItems

  const [currentStep, setCurrentStep] = useState("shipping")
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    ward: "",
    district: "",
    province: "",
    address: "",
    phone: "",
    notes: null
  })
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  })
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [shippingCost, setShippingCost] = useState(30000)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.appliedCoupon || null)

  // Tính toán subtotal từ cartItems
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)

  // Chỉ cập nhật shipping cost khi thay đổi shipping method
  const updateShippingCost = (method) => {
    const newShippingCost = method === "express" ? 50000 : 30000
    setShippingCost(newShippingCost)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code")
      return
    }

    try {
      const result = await applyCoupon({
        couponCode: couponCode.trim().toUpperCase(),
        userId: currentUser._id,
        orderTotal: subtotal,
        shippingCost: shippingCost
      }).unwrap()

      setAppliedCoupon(result)
      toast.success("Coupon applied successfully!")
      setCouponCode("") // Reset input
    } catch (error) {
      toast.error(error?.data?.message || "Failed to apply coupon")
      setAppliedCoupon(null)
    }
  }

  // Update shipping method handler
  const handleShippingMethodChange = (method) => {
    setShippingMethod(method)
    updateShippingCost(method)
  }

  // Calculate final total including new shipping cost
  const finalTotal = subtotal + shippingCost - (appliedCoupon?.discount || 0)

  // Handlers
  const handleShippingSubmit = (e) => {
    e.preventDefault()

    switch(paymentMethod) {
    case "COD":
      // Xử lý đặt hàng COD
      handlePlaceOrder()
      break

    case "BANK":
      // Xử lý thanh toán qua ngân hàng
      handleBankPayment()
      break

    default:
      toast.error("Please select a payment method")
    }
  }

  const handlePaymentSubmit = () => {
    setCurrentStep("review")
  }

  const handleBankPayment = async () => {
    try {
      let response = null
      if (locationCartItems.length > 0) {
        // Luồng từ Cart.jsx
        response = await createOrder({
          userId: currentUser._id,
          shippingAddress: shippingDetails,
          paymentMethod,
          items: cartItems,
          totalAmount: finalTotal,
          shippingCost: shippingCost,
          shippingMethod: shippingMethod,
          couponCodes: appliedCoupon ? [appliedCoupon.couponCode] : []
        }).unwrap()
        await deleteCart(currentUser._id).unwrap()
      } else if (reduxCartItems.length > 0) {
        // Luồng Buy Now
        const items = reduxCartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          productName: item.name,
          avatar: item.image
        }))
        response = await createOrder({
          userId: currentUser._id,
          shippingAddress: shippingDetails,
          paymentMethod,
          items,
          totalAmount: finalTotal,
          shippingCost: shippingCost,
          shippingMethod: shippingMethod,
          couponCodes: appliedCoupon ? [appliedCoupon.couponCode] : []
        }).unwrap()
        dispatch(clearCart())
      }
      // Nếu có paymentUrl từ PayOS, chuyển hướng người dùng đến trang thanh toán
      if (response?.payment) {
        navigate(`/payment/bank-transfer/${response.order.insertedId}`, { state: { paymentInfo: response.payment } })
      } else if (response) {
        navigate(`/order-confirmation/${response.order.insertedId}`)
      } else {
        toast.error("Không thể tạo đơn hàng")
      }
    } catch (err) {
      console.log(err)
      toast.error("Failed to create bank payment")
    }
  }

  const handlePlaceOrder = async () => {
    try {
      let response = null
      if (locationCartItems.length > 0) {
        // Luồng từ Cart.jsx
        response = await createOrder({
          userId: currentUser._id,
          shippingAddress: shippingDetails,
          paymentMethod,
          items: cartItems,
          totalAmount: finalTotal,
          shippingCost: shippingCost,
          shippingMethod: shippingMethod,
          couponCodes: appliedCoupon ? [appliedCoupon.couponCode] : []
        }).unwrap()
        await deleteCart(currentUser._id).unwrap()
      } else if (reduxCartItems.length > 0) {
        // Luồng Buy Now
        const items = reduxCartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          productName: item.name,
          avatar: item.image
        }))
        response = await createOrder({
          userId: currentUser._id,
          shippingAddress: shippingDetails,
          paymentMethod,
          items,
          totalAmount: finalTotal,
          shippingCost: shippingCost,
          shippingMethod: shippingMethod,
          couponCodes: appliedCoupon ? [appliedCoupon.couponCode] : []
        }).unwrap()
        dispatch(clearCart())
      }
      if (response) {
        navigate(`/order-confirmation/${response.order.insertedId}`)
      } else {
        toast.error("Không thể tạo đơn hàng")
      }
    } catch (err) {
      console.log(err)
      toast.error("Failed to place order")
    }
  }

  // Hàm xóa item khỏi Redux cart
  const handleRemoveItem = (id) => {
    dispatch(removeItem(id))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Checkout</h1>

          {/* Checkout Progress */}
          <div className="mb-8">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "shipping" || currentStep === "payment" || currentStep === "review"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep === "shipping" ? 1 : <Check size={16} />}
              </div>
              <div className="flex-grow h-0.5 mx-2 bg-gray-200">
                <div
                  className={`h-0.5 bg-primary transition-all ${currentStep === "payment" || currentStep === "review" ? "w-full" : "w-0"
                  }`}
                />
              </div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "payment" || currentStep === "review"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep === "payment" ? 2 : currentStep === "review" ? <Check size={16} /> : 2}
              </div>
              <div className="flex-grow h-0.5 mx-2 bg-gray-200">
                <div
                  className={`h-0.5 bg-primary transition-all ${currentStep === "review" ? "w-full" : "w-0"
                  }`}
                />
              </div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "review" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <div className="text-center">Shipping</div>
              <div className="text-center">Payment</div>
              <div className="text-center">Review</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === "shipping" && (
                <ShippingStep
                  shippingDetails={shippingDetails}
                  setShippingDetails={setShippingDetails}
                  shippingMethod={shippingMethod}
                  setShippingMethod={handleShippingMethodChange}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  onSubmit={handleShippingSubmit}
                />
              )}
              {currentStep === "payment" && (
                <PaymentStep
                  paymentDetails={paymentDetails}
                  setPaymentDetails={setPaymentDetails}
                  onSubmit={handlePaymentSubmit}
                  onBack={() => setCurrentStep("shipping")}
                />
              )}
              {currentStep === "review" && (
                <ReviewStep
                  shippingDetails={shippingDetails}
                  paymentDetails={paymentDetails}
                  shippingMethod={shippingMethod}
                  cartItems={cartItems}
                  onPlaceOrder={handlePlaceOrder}
                  onEditShipping={() => setCurrentStep("shipping")}
                  onEditPayment={() => setCurrentStep("payment")}
                  onBack={() => setCurrentStep("payment")}
                />
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id || item._id} className="flex justify-between py-2 border-b items-center">
                      <div className="flex items-center">
                        <span className="w-5 h-5 inline-flex items-center justify-center text-xl mr-2">
                          {item.quantity}
                        </span>
                        <span className="w-5 h-5 inline-flex items-center justify-center text-xs mr-2">
                          x
                        </span>
                        <span className="text-sm">{item.name || item.productName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ₫{(item.price * item.quantity).toLocaleString("vi-VN")}
                        </span>
                        {/* Nút xóa chỉ hiển thị khi vào từ Buy Now (reduxCartItems) */}
                        {locationCartItems.length === 0 && (
                          <button
                            className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                            title="Xóa sản phẩm"
                            onClick={() => handleRemoveItem(item.id || item._id)}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>₫{subtotal.toLocaleString("vi-VN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span>₫{shippingCost.toLocaleString("vi-VN")}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₫{appliedCoupon.discount.toLocaleString("vi-VN")}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₫{finalTotal.toLocaleString("vi-VN")}</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow rounded-l-md border border-r-0 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-r-md transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Display applied coupon info */}
                  {appliedCoupon && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/10 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-green-600 dark:text-green-400">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-sm text-green-500 dark:text-green-400">
                            {appliedCoupon.type === "PERCENT"
                              ? `${appliedCoupon.value}% Off`
                              : appliedCoupon.type === "AMOUNT"
                                ? `₫${appliedCoupon.value.toLocaleString("vi-VN")} Off`
                                : "Free Shipping"}
                          </p>
                        </div>
                        <button
                          onClick={() => setAppliedCoupon(null)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Checkout