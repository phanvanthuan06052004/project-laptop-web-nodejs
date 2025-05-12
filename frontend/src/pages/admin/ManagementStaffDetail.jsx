import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "~/components/ui/Button"
import { useGetUserByIdQuery, useUpdateUserMutation } from "~/store/apis/userSlice"
import { toast } from "react-toastify"
import { useRegisterMutation } from "~/store/apis/authSlice"

const ManagementStaffDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNewStaff = id === "new"

  const { data: staff, isLoading, isError, error } = useGetUserByIdQuery(id, {
    skip: isNewStaff
  })
  const [updateUser] = useUpdateUserMutation()
  const [register] = useRegisterMutation()

  const [form, setForm] = useState({
    displayname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isActive: true,
    role: "staff"
  })

  const [message, setMessage] = useState("")

  useEffect(() => {
    if (staff) {
      setForm({
        displayname: staff.displayname || "",
        email: staff.email || "",
        phone: staff.phone || "",
        password: "",
        confirmPassword: "",
        isActive: staff.isActive,
        role: staff.role
      })
    }
  }, [staff])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const validateForm = () => {
    if (!form.displayname) {
      return "Vui lòng nhập tên nhân viên"
    }
    if (!form.email) {
      return "Vui lòng nhập email"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Email không hợp lệ"
    }
    if (isNewStaff) {
      if (!form.password) {
        return "Vui lòng nhập mật khẩu"
      }
      if (form.password.length < 8) {
        return "Mật khẩu phải có ít nhất 8 ký tự"
      }
      if (form.password !== form.confirmPassword) {
        return "Mật khẩu xác nhận không khớp"
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    const validationError = validateForm()
    if (validationError) {
      setMessage(validationError)
      return
    }

    try {
      if (isNewStaff) {
        await register({
          displayname: form.displayname,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: "staff",
          isActive: true
        }).unwrap()
        toast.success("Thêm nhân viên thành công!")
      } else {
        const updateData = {
          displayname: form.displayname,
          email: form.email,
          phone: form.phone === "" ? null : form.phone,
          isActive: form.isActive
        }
        if (form.password) {
          if (form.password.length < 8) {
            setMessage("Mật khẩu phải có ít nhất 8 ký tự")
            return
          }
          if (form.password !== form.confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp")
            return
          }
          updateData.password = form.password
        }
        await updateUser({ id, ...updateData }).unwrap()
        toast.success("Cập nhật nhân viên thành công!")
      }
      setTimeout(() => navigate(-1), 1000)
    } catch (error) {
      setMessage(error?.data?.message || "Có lỗi xảy ra!")
    }
  }

  if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>
  if (isError) return <div className="p-6 text-red-500">Lỗi: {error?.data?.message || "Không thể tải dữ liệu"}</div>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">{isNewStaff ? "Thêm nhân viên mới" : "Chỉnh sửa thông tin nhân viên"}</h1>
      {message && <div className="mb-4 text-center text-red-600 font-semibold">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Tên nhân viên</label>
          <input
            type="text"
            name="displayname"
            value={form.displayname}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mật khẩu {!isNewStaff && "(để trống nếu không muốn thay đổi)"}</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required={isNewStaff}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required={isNewStaff}
          />
        </div>
        {!isNewStaff && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="font-medium">Kích hoạt tài khoản</label>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
          <Button type="submit">{isNewStaff ? "Thêm nhân viên" : "Lưu thay đổi"}</Button>
        </div>
      </form>
    </div>
  )
}

export default ManagementStaffDetail 