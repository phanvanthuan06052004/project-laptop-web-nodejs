import React from "react"
import { Button } from "~/components/ui/button"
import { ChevronRight } from "lucide-react"

const ShippingStep = ({ shippingDetails, setShippingDetails, shippingMethod, setShippingMethod, onSubmit }) => {
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

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={shippingDetails.email}
            onChange={handleShippingChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium mb-1">
                        Street Address *
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
                            City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.city}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">
                            State/Province *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.state}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                            Postal Code *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.zipCode}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium mb-1">
                        Country *
          </label>
          <select
            id="country"
            name="country"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={shippingDetails.country}
            onChange={handleShippingChange}
            required
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
          </select>
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
          <h3 className="text-lg font-medium mb-3">Shipping Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-md cursor-pointer">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Standard Shipping</div>
                <div className="text-sm text-gray-500">3-5 business days - $15.99</div>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer">
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Express Shipping</div>
                <div className="text-sm text-gray-500">1-2 business days - $29.99</div>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">
                    Continue to Payment <ChevronRight size={16} className="ml-1" />
        </Button>
      </form>
    </div>
  )
}

export default ShippingStep