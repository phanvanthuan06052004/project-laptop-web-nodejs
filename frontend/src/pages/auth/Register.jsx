import { Eye, EyeOff, Facebook, Mail, UserPlus } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { useRegisterMutation } from "~/store/apis/authSlice"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [register] = useRegisterMutation()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const { email, phone, password, confirmPassword } = formData
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Vui lòng nhập email hợp lệ."
    }
    if (!phone || !/^\+?\d{10,15}$/.test(phone)) {
      return "Vui lòng nhập số điện thoại hợp lệ (10-15 chữ số)."
    }
    if (!password || password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự."
    }
    if (password !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp."
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      await register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      }).unwrap()

      // Navigate to /authen-confirm with email
      navigate("/authen-confirm", { state: { email: formData.email } })
    } catch (err) {
      setError(err?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.")
      // eslint-disable-next-line no-console
      console.error("Register error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto animate-fade-up">
        <div className="border shadow-lg rounded-lg">
          <div className="flex flex-col items-center p-6 gap-1">
            <h3 className="text-3xl font-bold mb-2">Tạo tài khoản mới</h3>
            <p className="text-muted-foreground">Nhanh chóng và dễ dàng</p>
          </div>

          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-destructive text-sm text-center">{error}</div>}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
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
                <label htmlFor="phone" className="text-sm font-medium">
                  Số điện thoại
                </label>
                <Input
                  placeholder="Nhập số điện thoại..."
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="password">
                  Mật khẩu
                </label>
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
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Xác nhận mật khẩu
                </label>
                <Input
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Đăng ký</span>
                  </>
                )}
              </Button>
            </form>
          </div>
          <div className="text-center text-sm mb-3">
            <p className="text-sm text-muted-foreground">
              <span>Bạn đã có tài khoản ư? </span>
              <Link to="/login" className="text-primary hover:underline">Đăng nhập ngay</Link>
            </p>
          </div>
          {/* <div className="grid grid-cols-2 gap-3 p-6">
            <Button variant="outline" type="button" className="w-full">
              <Facebook size={16} className="mr-2" /> Facebook
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <Mail size={16} className="mr-2" /> Google
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Register
