import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "~/components/ui/Button"

// Mock data, thực tế sẽ lấy từ API
const mockCoupon = {
  _id: "1",
  name: "Giảm 10% toàn bộ đơn hàng",
  description: "Áp dụng cho tất cả khách hàng mới",
  code: "SALE10",
  type: "PERCENT",
  value: 10,
  max_value: 500000,
  min_value: 1000000,
  start_day: "2024-06-01",
  end_day: "2024-06-30",
  is_active: true
}

const CouponEdit = () => {
  const navigate = useNavigate()
  // const { id } = useParams()
  // TODO: Lấy data từ API theo id, hiện tại dùng mock
  const [form, setForm] = useState(mockCoupon)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Gọi API cập nhật mã giảm giá
    navigate(-1)
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa mã giảm giá</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Tên mã giảm giá</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mã coupon</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 uppercase"
            required
            disabled
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Loại</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="AMOUNT">Số tiền (₫)</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Giá trị</label>
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Giá trị tối đa (nếu %)</label>
            <input
              type="number"
              name="max_value"
              value={form.max_value || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Giá trị đơn hàng tối thiểu</label>
            <input
              type="number"
              name="min_value"
              value={form.min_value || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Ngày bắt đầu</label>
            <input
              type="date"
              name="start_day"
              value={form.start_day?.slice(0, 10) || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ngày kết thúc</label>
            <input
              type="date"
              name="end_day"
              value={form.end_day?.slice(0, 10) || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="font-medium">Kích hoạt</label>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
          <Button type="submit">Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  )
}

export default CouponEdit 