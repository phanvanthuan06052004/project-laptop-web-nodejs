import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, ChevronRight } from "lucide-react"
import { Button } from "~/components/ui/button"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ShippingStep from "./ShippingStep"
import PaymentStep from "./PaymentStep"
import ReviewStep from "./ReviewStep"

const Checkout = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState("shipping")
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: ""
  })
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  })
  const [shippingMethod, setShippingMethod] = useState("standard")

  // Mock cart items
  const cartItems = [
    {
      id: 1,
      name: "Dell XPS 13",
      price: 999.99,
      image:
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quantity: 1
    },
    {
      id: 2,
      name: "MacBook Pro 14\"",
      price: 1999.99,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quantity: 1
    }
  ]

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const shipping = shippingMethod === "express" ? 29.99 : 15.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  // Handlers
  const handleShippingSubmit = () => {
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = () => {
    setCurrentStep("review")
  }

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully!", {
      position: "top-right",
      autoClose: 2000
    })
    navigate("/order-confirmation")
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
                  setShippingMethod={setShippingMethod}
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
                    <div key={item.id} className="flex justify-between py-2 border-b">
                      <div className="flex items-center">
                        <span className="w-5 h-5 inline-flex items-center justify-center bg-gray-200 rounded-full text-xs mr-2">
                          {item.quantity}
                        </span>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
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