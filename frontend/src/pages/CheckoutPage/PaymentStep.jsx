import React from "react"
import { Button } from "~/components/ui/button"
import { CreditCard, ChevronRight } from "lucide-react"

const PaymentStep = ({ paymentDetails, setPaymentDetails, onSubmit, onBack }) => {
  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentDetails((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Card Details</h3>
            <div className="flex space-x-2">
              <span className="border px-2 py-1 rounded text-xs">Visa</span>
              <span className="border px-2 py-1 rounded text-xs">Mastercard</span>
              <span className="border px-2 py-1 rounded text-xs">Amex</span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                            Name on Card *
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={paymentDetails.cardName}
              onChange={handlePaymentChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                            Card Number *
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                className="w-full rounded-md border px-3 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentChange}
                required
              />
              <CreditCard
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                                Expiration Date *
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="MM/YY"
                value={paymentDetails.expiryDate}
                onChange={handlePaymentChange}
                required
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="123"
                value={paymentDetails.cvv}
                onChange={handlePaymentChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
            <Button variant="outline" onClick={onBack}>
                            Back to Shipping
            </Button>
            <Button type="submit">
                            Continue to Review <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PaymentStep