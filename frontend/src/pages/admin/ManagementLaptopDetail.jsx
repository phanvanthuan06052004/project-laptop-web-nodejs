import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "~/components/ui/Button"
import {
  useGetProductByIdQuery,
  useUpdateProductMutation
} from "~/store/apis/productApi"
import { useGetBrandsQuery } from "~/store/apis/brandSlice"

const ManagementLaptopDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data, isLoading, isError, error } = useGetProductByIdQuery(id)
  const { data: brandsData } = useGetBrandsQuery({ limit: 100 })
  console.log("brandsData", brandsData)
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: 0,
    quantity: 0,
    status: "Còn hàng",
    description: "",
    images: []
  })
  const [message, setMessage] = useState("")
  const [newImage, setNewImage] = useState("")

  useEffect(() => {
    if (data && brandsData && brandsData.brands) {
      const brand = brandsData.brands.find(b => b._id === (data.brand._id || data.brand))
      setForm({
        name: data.name || "",
        brand: brand?._id || "",
        price: data.price || 0,
        quantity: data.quantity || 0,
        status: data.quantity > 0 ? "Còn hàng" : "Hết hàng",
        description: data.description || "",
        images: data.images || []
      })
    }
  }, [data, brandsData])
  console.log("form", form)
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
      await updateProduct({ id, data: form }).unwrap()
      setMessage("Cập nhật thành công!")
      setTimeout(() => navigate(-1), 1000)
    } catch {
      setMessage("Có lỗi xảy ra khi cập nhật!")
    }
  }

  if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>
  if (isError) return <div className="p-6 text-red-500">Lỗi: {error?.data?.message || "Không thể tải dữ liệu"}</div>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa Laptop</h1>
      {message && <div className="mb-4 text-center text-green-600 font-semibold">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Tên laptop</label>
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
          <label className="block mb-1 font-medium">Hãng</label>
          <select
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required
          >
            <option value="">Chọn hãng</option>
            {brandsData?.brands?.map(brand => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Giá</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="Còn hàng">Còn hàng</option>
            <option value="Hết hàng">Hết hàng</option>
          </select>
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
        {/* Hiển thị ảnh nếu có */}
        {form.images && (
          <div>
            <label className="block mb-1 font-medium">Ảnh sản phẩm</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt="laptop" className="w-20 h-20 object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                    className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:bg-red-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                    style={{ transform: "translate(40%,-40%)" }}
                    title="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Nhập link ảnh..."
                value={newImage}
                onChange={e => setNewImage(e.target.value)}
                className="border rounded px-2 py-1 w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newImage.trim()) {
                    setForm(prev => ({ ...prev, images: [...prev.images, newImage.trim()] }))
                    setNewImage("")
                  }
                }}
                disabled={!newImage.trim()}
              >
                Thêm
              </Button>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
          <Button type="submit" disabled={isUpdating}>Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  )
}

export default ManagementLaptopDetail 