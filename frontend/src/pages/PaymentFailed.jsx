import React from "react"
import { useNavigate } from "react-router-dom"
import { XCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import MetaTags from "~/components/seo/MetaTags"

const PaymentFailed = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Payment Failed - LaptopNexus"
        description="Your payment was unsuccessful."
      />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-sm border p-8 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
          
          <p className="text-muted-foreground mb-6">
            We were unable to process your payment. Please try again or choose a different payment method.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Possible reasons for failure:
              <ul className="mt-2 list-disc list-inside">
                <li>Insufficient funds</li>
                <li>Connection timeout</li>
                <li>Transaction declined by bank</li>
                <li>Invalid card information</li>
              </ul>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mt-8">
            <Button onClick={() => navigate("/cart")}>
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            If you continue to experience issues, please contact our support team.
          </p>
        </div>
      </main>
    </div>
  )
}

export default PaymentFailed