/* eslint-disable no-console */
import { Eye, EyeOff, Facebook, LogIn, Mail } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { useLoginMutation } from "~/store/apis/authSlice"
import { setCredentials } from "~/store/slices/authSlice"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  const [login] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      }).unwrap()

      const { userInfo, accessToken } = response

      // Handle successful login (e.g., store token, redirect, etc.)
      dispatch(setCredentials({ user: userInfo, accessToken }))
      window.location.href = "/"
    } catch (err) {
      // Handle error
      setError(err?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto animate-fade-up">
        <div className="rounded-lg shadow-lg border">
          <div className="flex flex-col items-center p-6 gap-1">
            <h3 className="text-3xl font-bold mb-2">Chào mừng trở lại</h3>
            <p className="text-muted-foreground">Đăng nhập để truy cập tài khoản của bạn</p>
          </div>
          <div className="pt-0 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <Input
                  placeholder="Nhập email..."
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">Mật khẩu</label>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} className="text-muted-foreground" /> : <Eye size={16} className="text-muted-foreground" />}
                  </Button>
                </div>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">Quên mật khẩu?</Link>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Đăng nhập</span>
                  </>
                )}
              </Button>
            </form>
          </div>
          <div className="text-center text-sm">
            <p className="text-sm text-muted-foreground">
              <span>Bạn chưa có tài khoản ư? </span>
              <Link to="/register" className="text-primary hover:underline">Đăng ký ngay</Link>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-6">
            <Button variant="outline" type="button" className="w-full">
              <Facebook size={16} className="mr-2" /> Facebook
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <Mail size={16} className="mr-2" /> Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
