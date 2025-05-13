/* eslint-disable no-console */
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { toast } from "react-toastify"

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useConfirmCodeMutation // Add the confirmCode mutation hook
} from "~/store/apis/authSlice.js"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [stage, setStage] = useState("email") // 'email' | 'code' | 'reset'
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendMessage, setResendMessage] = useState(null)

  const navigate = useNavigate()
  const [forgotPassword] = useForgotPasswordMutation()
  const [resetPassword] = useResetPasswordMutation()
  const [confirmCode] = useConfirmCodeMutation() // Initialize confirmCode mutation

  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError(null)
    setResendMessage(null)
    setIsLoading(true)

    if (!email) {
      setError("Vui lòng nhập địa chỉ email.")
      setIsLoading(false)
      return
    }

    try {
      await forgotPassword({ email }).unwrap()
      toast.success("Mã xác nhận đã được gửi đến email của bạn.")
      setStage("code")
      setResendCooldown(60)
    } catch (err) {
      setError(err?.data?.message || "Không thể gửi mã xác nhận. Vui lòng thử lại.")
      console.error("Forgot password error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPasswordFlow = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (stage === "code") {
      if (!/^\d{8}$/.test(code)) {
        setError("Mã xác nhận phải là 8 chữ số.")
        setIsLoading(false)
        return
      }

      try {
        // Call the confirmCode API to validate the code
        await confirmCode({ email, code }).unwrap()
        toast.success("Mã xác nhận hợp lệ.")
        setStage("reset") // Move to reset stage only if code is valid
      } catch (err) {
        setError(err?.data?.message || "Mã xác nhận không hợp lệ. Vui lòng thử lại.")
        console.error("Confirm code error:", err)
        setIsLoading(false)
        return
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (stage === "reset") {
      if (!newPassword) {
        setError("Vui lòng nhập mật khẩu mới.")
        setIsLoading(false)
        return
      }

      if (newPassword !== confirmNewPassword) {
        setError("Mật khẩu mới và mật khẩu xác nhận không khớp.")
        setIsLoading(false)
        return
      }

      try {
        await resetPassword({ email, newPassword }).unwrap()
        toast.success("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.")
        navigate("/login")
      } catch (err) {
        setError(err?.data?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.")
        console.error("Reset password error:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading || stage !== "code") return

    setError(null)
    setResendMessage(null)
    setIsLoading(true)

    try {
      await forgotPassword({ email }).unwrap()
      setResendMessage("Mã xác nhận mới đã được gửi.")
      setResendCooldown(60)
    } catch (err) {
      setError(err?.data?.message || "Gửi lại mã thất bại. Vui lòng thử lại.")
      console.error("Resend code error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto animate-fade-up">
        <div className="border shadow-lg rounded-lg">
          <div className="flex flex-col items-center p-6 gap-1">
            <h3 className="text-3xl font-bold mb-2">Quên mật khẩu</h3>
            <p className="text-muted-foreground text-center">
              {stage === "email"
                ? "Vui lòng nhập địa chỉ email của bạn để khôi phục mật khẩu."
                : stage === "code"
                  ? "Nhập mã xác nhận 8 chữ số đã được gửi đến email của bạn."
                  : "Nhập mật khẩu mới của bạn."}
            </p>
          </div>
          <div className="p-6 pt-0">
            {error && <div className="text-destructive text-sm text-center mb-4">{error}</div>}
            {resendMessage && <div className="text-green-500 text-sm text-center mb-4">{resendMessage}</div>}

            {stage === "email" && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Địa chỉ Email</label>
                  <Input
                    placeholder="Nhập email của bạn"
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Đang xử lý...
                    </div>
                  ) : (
                    <span>Gửi mã xác nhận</span>
                  )}
                </Button>
                <div className="text-center pt-2 text-sm">
                  <Button variant="link" onClick={() => navigate("/login")}>
                    Quay lại đăng nhập
                  </Button>
                </div>
              </form>
            )}

            {(stage === "code" || stage === "reset") && (
              <form onSubmit={handleResetPasswordFlow} className="space-y-4">
                {stage === "code" && (
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
                )}

                {stage === "reset" && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="text-sm font-medium">Mật khẩu mới</label>
                      <Input
                        placeholder="Nhập mật khẩu mới"
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirmNewPassword" className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                      <Input
                        placeholder="Xác nhận mật khẩu mới"
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Đang xử lý...
                    </div>
                  ) : (
                    <span>{stage === "code" ? "Tiếp tục" : "Đặt lại mật khẩu"}</span>
                  )}
                </Button>

                {stage === "code" && (
                  <div className="text-center pt-2 text-sm">
                    <Button
                      onClick={handleResendCode}
                      disabled={resendCooldown > 0 || isLoading}
                      variant="link"
                      className={`${resendCooldown > 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Gửi lại mã {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
                    </Button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword