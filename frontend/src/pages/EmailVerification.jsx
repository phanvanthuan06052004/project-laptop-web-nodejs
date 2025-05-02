/* eslint-disable no-console */
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"

import { useSendVerificationEmailMutation, useVerifyEmailMutation } from "~/store/apis/mailSlice"

const AuthenConfirm = () => {
  const [code, setCode] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendMessage, setResendMessage] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ""

  const [verifyEmail] = useVerifyEmailMutation()
  const [sendVerificationEmail] = useSendVerificationEmailMutation()

  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!/^\d{8}$/.test(code)) {
      setError("Mã xác nhận phải là 8 chữ số.")
      setIsLoading(false)
      return
    }

    try {
      await verifyEmail({ email, code }).unwrap()
      navigate("/login", {
        state: { message: "Email đã được xác nhận. Vui lòng đăng nhập." }
      })
    } catch (err) {
      setError(err?.data?.message || "Xác nhận thất bại. Vui lòng thử lại.")
      console.error("Verify email error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    setError(null)
    setResendMessage(null)
    setIsLoading(true)

    try {
      await sendVerificationEmail({ email }).unwrap()
      setResendMessage("Mã xác nhận mới đã được gửi.")
      setResendCooldown(60)
    } catch (err) {
      setError(err?.data?.message || "Gửi lại mã thất bại. Vui lòng thử lại.")
      console.error("Resend code error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    navigate("/register")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto animate-fade-up">
        <div className="border shadow-lg rounded-lg">
          <div className="flex flex-col items-center p-6 gap-1">
            <h3 className="text-3xl font-bold mb-2">Xác nhận Email</h3>
            <p className="text-muted-foreground">
              Nhập mã 8 chữ số đã được gửi đến <strong>{email}</strong>
            </p>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-destructive text-sm text-center">{error}</div>}
              {resendMessage && <div className="text-green-500 text-sm text-center">{resendMessage}</div>}
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">Mã xác nhận</label>
                <Input
                  placeholder="Nhập mã 8 chữ số..."
                  id="code"
                  name="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={8}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Đang xử lý...
                  </div>
                ) : (
                  <span>Xác nhận</span>
                )}
              </Button>
            </form>
            <div className="text-center pt-4 text-sm">
              <Button
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isLoading}
                variant="link"
                className={`${resendCooldown > 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Gửi lại mã {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthenConfirm
