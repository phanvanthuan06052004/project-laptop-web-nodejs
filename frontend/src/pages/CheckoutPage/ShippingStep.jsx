import React from "react"
import { Button } from "~/components/ui/button"
import { ChevronRight, CreditCard, Wallet, Truck } from "lucide-react"

const ShippingStep = ({
  shippingDetails,
  setShippingDetails,
  shippingMethod,
  setShippingMethod,
  paymentMethod,
  setPaymentMethod,
  onSubmit
}) => {
  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingDetails((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                            First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.firstName}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                            Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.lastName}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.email}
              onChange={handleShippingChange}
              required
            /></div>
          <div>
            <label htmlFor="ward" className="block text-sm font-medium mb-1">
                            Ward *
            </label>
            <input
              type="text"
              id="ward"
              name="ward"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.ward}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="district" className="block text-sm font-medium mb-1">
                            District *
            </label>
            <input
              type="text"
              id="district"
              name="district"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.district}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div>
            <label htmlFor="province" className="block text-sm font-medium mb-1">
                            Province *
            </label>
            <input
              type="text"
              id="province"
              name="province"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.province}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium mb-1">
                        Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={shippingDetails.address}
            onChange={handleShippingChange}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={shippingDetails.phone}
            onChange={handleShippingChange}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
                        Notes
          </label>
          <input
            type="text"
            id="notes"
            name="notes"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={shippingDetails.notes}
            onChange={handleShippingChange}
          />
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Shipping Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
                className="mr-3 text-primary focus:ring-primary"
              />
              <div className="flex items-center justify-between flex-1">
                <div>
                  <div className="font-medium">Standard Shipping</div>
                  <div className="text-sm text-gray-500">3-5 business days</div>
                </div>
                <div className="font-medium">₫30.000</div>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
                className="mr-3 text-primary focus:ring-primary"
              />
              <div className="flex items-center justify-between flex-1">
                <div>
                  <div className="font-medium">Express Shipping</div>
                  <div className="text-sm text-gray-500">1-2 business days</div>
                </div>
                <div className="font-medium">₫50.000</div>
              </div>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-primary focus:ring-primary"
              />
              <div className="flex items-center">
                <Truck className="w-5 h-5 mr-3 text-gray-600" />
                <div>
                  <div className="font-medium">Cash On Delivery (COD)</div>
                  <div className="text-sm text-gray-500">Pay when you receive</div>
                </div>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="BANK"
                checked={paymentMethod === "BANK"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-primary focus:ring-primary"
              />
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <div className="font-medium">Bank or e-wallet Transfer</div>
                  <div className="text-sm text-gray-500">Pay via bank or e-wallet</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">
          {paymentMethod === "BANK" ? (
            <>Continue to Bank Payment <ChevronRight size={16} className="ml-1" /></>
          ) : (
            <>Place Order <ChevronRight size={16} className="ml-1" /></>
          )}
        </Button>
      </form>
    </div>
  )
}

export default ShippingStep