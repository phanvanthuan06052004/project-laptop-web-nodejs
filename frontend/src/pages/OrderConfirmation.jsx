import React from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import MetaTags from "~/components/seo/MetaTags"

const OrderConfirmation = () => {
  // const { orderId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Order Confirmation - LaptopNexus"
        description="Your order has been confirmed successfully."
      />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-sm border p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been placed successfully. We've sent you an email with your order details.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Button onClick={() => navigate("/account/orders")}>
              View Your Orders
            </Button>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderConfirmation