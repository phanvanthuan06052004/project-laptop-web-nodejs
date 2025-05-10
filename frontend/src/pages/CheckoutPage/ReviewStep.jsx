import React from "react"
import { Button } from "~/components/ui/button"

const ReviewStep = ({
  shippingDetails,
  paymentDetails,
  shippingMethod,
  cartItems,
  onPlaceOrder,
  onEditShipping,
  onEditPayment,
  onBack
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Review Order</h2>

      {/* Shipping Information Summary */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Shipping Information</h3>
          <button
            className="text-primary text-sm hover:underline"
            onClick={onEditShipping}
          >
                        Edit
          </button>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <p className="mb-1">
            {shippingDetails.firstName} {shippingDetails.lastName}
          </p>
          <p className="mb-1">{shippingDetails.address}</p>
          <p className="mb-1">
            {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}
          </p>
          <p className="mb-1">{shippingDetails.country}</p>
          <p className="mb-1">{shippingDetails.email}</p>
          <p>{shippingDetails.phone}</p>
          <div className="mt-2 border-t pt-2">
            <p className="font-medium">
              {shippingMethod === "standard"
                ? "Standard Shipping (3-5 business days)"
                : "Express Shipping (1-2 business days)"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Information Summary */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Payment Information</h3>
          <button
            className="text-primary text-sm hover:underline"
            onClick={onEditPayment}
          >
                        Edit
          </button>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <p className="mb-1">{paymentDetails.cardName}</p>
          <p>
                        Credit Card ending in {paymentDetails.cardNumber.slice(-4)}
          </p>
        </div>
      </div>

      {/* Cart Items Summary */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Order Items</h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 py-3 border-b"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-grow">
                <p className="font-medium">{item.name}</p>
                <div className="flex justify-between mt-1">
                  <p className="text-sm">Qty: {item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
          <Button variant="outline" onClick={onBack}>
                        Back to Payment
          </Button>
          <Button onClick={onPlaceOrder}>Place Order</Button>
        </div>
      </div>
    </div>
  )
}

export default ReviewStep