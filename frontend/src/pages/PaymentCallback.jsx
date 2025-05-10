import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import MetaTags from "~/components/seo/MetaTags"

const PaymentCallback = () => {
  const [searchParams] = useSearchParams() // Fix: Need to destructure from hook
  const navigate = useNavigate()

  useEffect(() => {
    // Get params from MOMO callback
    const orderId = searchParams.get("orderId")
    const resultCode = searchParams.get("resultCode")

    // Add timeout to show loading state
    const timeout = setTimeout(() => {
      if (resultCode === "0") {
        navigate(`/order-confirmation/${orderId}`)
      } else {
        navigate("/checkout/payment-failed")
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <MetaTags
        title="Processing Payment - LaptopNexus"
        description="Processing your payment, please wait..."
      />

      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">
          Processing Payment
        </h1>
        <p className="text-muted-foreground">
          Please wait while we confirm your payment...
        </p>
      </div>
    </div>
  )
}

export default PaymentCallback // Fix: Add export