"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "~/components/ui/Button"
import { useCreateProductMutation } from "~/store/apis/productSlice"
import { useGetBrandsQuery } from "~/store/apis/brandSlice"
import { useGetAllTypeQuery } from "~/store/apis/typeSlice"

const ManageLaptopCreate = () => {
  const navigate = useNavigate()
  const { data: brandsData } = useGetBrandsQuery({ limit: 100 })
  const { data: typeData } = useGetAllTypeQuery()
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()

  const [form, setForm] = useState({
    name: "",
    displayName: "",
    brand: "",
    type: "",
    purchasePrice: 0,
    discount: 0,
    price: 0,
    quantity: 0,
    description: "",
    mainImg: "",
    images: [],
    attributeGroup: [],
    specs: [{ cpu: "", ram: "", storage: "", gpu: "", screen: "" }],
    options: [],
    isPublish: true
  })
  const [message, setMessage] = useState("")
  const [newImage, setNewImage] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "discount" ? parseFloat(value) || 0 : value
    }))
  }

  const handleSpecChange = (index, field, value) => {
    setForm((prev) => {
      const newSpecs = [...prev.specs]
      newSpecs[index] = { ...newSpecs[index], [field]: value.trim() }
      return { ...prev, specs: newSpecs }
    })
  }

  const handleAttrChange = (index, field, value) => {
    setForm((prev) => {
      const newAttrs = [...prev.attributeGroup]
      newAttrs[index] = { ...newAttrs[index], [field]: value }
      return { ...prev, attributeGroup: newAttrs }
    })
  }

  const addAttribute = () => {
    setForm((prev) => ({
      ...prev,
      attributeGroup: [...prev.attributeGroup, { name: "", values: "" }]
    }))
  }

  const removeAttribute = (index) => {
    setForm((prev) => ({
      ...prev,
      attributeGroup: prev.attributeGroup.filter((_, i) => i !== index)
    }))
  }

  const handleOptionGroupChange = (index, value) => {
    setForm((prev) => {
      const newOptions = [...prev.options]
      newOptions[index] = { ...newOptions[index], name: value }
      return { ...prev, options: newOptions }
    })
  }

  const handleOptionValueChange = (groupIndex, optionIndex, value) => {
    setForm((prev) => {
      const newOptions = [...prev.options]
      newOptions[groupIndex].options[optionIndex] = {
        ...newOptions[groupIndex].options[optionIndex],
        value
      }
      return { ...prev, options: newOptions }
    })
  }

  const addOptionGroup = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { name: "", options: [{ value: "", images: [] }] }]
    }))
  }

  const removeOptionGroup = (index) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const addOptionValue = (groupIndex) => {
    setForm((prev) => {
      const newOptions = [...prev.options]
      newOptions[groupIndex].options.push({ value: "", images: [] })
      return { ...prev, options: newOptions }
    })
  }

  const removeOptionValue = (groupIndex, optionIndex) => {
    setForm((prev) => {
      const newOptions = [...prev.options]
      newOptions[groupIndex].options = newOptions[groupIndex].options.filter(
        (_, i) => i !== optionIndex
      )
      return { ...prev, options: newOptions }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    if (!form.name || !form.brand || !form.type || form.price <= 0 || form.quantity < 0) {
      setMessage("Vui lòng điền đầy đủ các trường bắt buộc!")
      return
    }
    if (form.discount < 0 || form.discount > 100 || isNaN(form.discount)) {
      setMessage("Giảm giá phải từ 0 đến 100!")
      return
    }
    if (!form.specs[0].storage?.trim() || !form.specs[0].gpu?.trim()) {
      setMessage("Lưu trữ và GPU không được để trống!")
      return
    }
    // Transform specs before sending
    const transformedSpecs = form.specs.map((spec) => ({
      cpu: spec.cpu?.trim() || "",
      ram: spec.ram?.trim() || "",
      storage: spec.storage?.trim() || "Unknown",
      gpu: spec.gpu?.trim() || "Unknown",
      screen: spec.screen?.trim() || ""
    }))
    try {
      const payload = { ...form, specs: transformedSpecs }
      await createProduct(payload).unwrap()
      setMessage("Tạo sản phẩm thành công!")
      setTimeout(() => navigate(-1), 1000)
    } catch (err) {
      setMessage(
        `Có lỗi xảy ra khi tạo sản phẩm: ${
          err?.data?.message || "Vui lòng thử lại."
        }`
      )
    }
  }

  return (
    <div className="mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Tạo Laptop Mới</h1>
      {message && (
        <div
          className={`mb-4 text-center font-semibold ${
            message.includes("thành công")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}
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
          <label className="block mb-1 font-medium">Tên hiển thị</label>
          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
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
            {brandsData?.brands?.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Loại sản phẩm</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            required
          >
            <option value="">Chọn loại</option>
            {typeData?.types
              ?.filter((type) => type.is_active)
              .map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Giá mua</label>
          <input
            type="number"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            min="0"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Giảm giá (%)</label>
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            min="0"
            step="any"
            placeholder="VD: 10.5"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Giá bán</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            min="0"
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
            min="0"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ảnh chính</label>
          <input
            type="text"
            name="mainImg"
            value={form.mainImg}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            placeholder="Nhập link ảnh chính..."
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ảnh sản phẩm</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt="laptop"
                  className="w-20 h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== idx)
                    }))
                  }
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
              onChange={(e) => setNewImage(e.target.value)}
              className="border rounded px-2 py-1 w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
            <Button
              type="button"
              onClick={() => {
                if (newImage.trim()) {
                  setForm((prev) => ({
                    ...prev,
                    images: [...prev.images, newImage.trim()]
                  }))
                  setNewImage("")
                }
              }}
              disabled={!newImage.trim()}
            >
              Thêm
            </Button>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            rows="6"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Thông số kỹ thuật</label>
          {form.specs.map((spec, index) => (
            <div key={index} className="space-y-2 mb-4 border p-4 rounded">
              <div>
                <label className="block mb-1">CPU</label>
                <input
                  type="text"
                  value={spec.cpu}
                  onChange={(e) => handleSpecChange(index, "cpu", e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block mb-1">RAM</label>
                <input
                  type="text"
                  value={spec.ram}
                  onChange={(e) => handleSpecChange(index, "ram", e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block mb-1">Lưu trữ</label>
                <input
                  type="text"
                  value={spec.storage}
                  onChange={(e) => handleSpecChange(index, "storage", e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">GPU</label>
                <input
                  type="text"
                  value={spec.gpu}
                  onChange={(e) => handleSpecChange(index, "gpu", e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Màn hình</label>
                <input
                  type="text"
                  value={spec.screen}
                  onChange={(e) => handleSpecChange(index, "screen", e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <label className="block mb-1 font-medium">Thuộc tính</label>
          {form.attributeGroup.length > 0 ? (
            <div className="space-y-2">
              {form.attributeGroup.map((attr, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={attr.name}
                    onChange={(e) => handleAttrChange(index, "name", e.target.value)}
                    className="w-1/3 border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    placeholder="Tên thuộc tính"
                  />
                  <input
                    type="text"
                    value={attr.values}
                    onChange={(e) => handleAttrChange(index, "values", e.target.value)}
                    className="w-2/3 border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    placeholder="Giá trị"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeAttribute(index)}
                  >
                    Xóa
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có thuộc tính nào.</p>
          )}
          <Button type="button" onClick={addAttribute} className="mt-2">
            Thêm thuộc tính
          </Button>
        </div>
        <div>
          <label className="block mb-1 font-medium">Tùy chọn</label>
          {form.options.length > 0 ? (
            <div className="space-y-4">
              {form.options.map((option, groupIndex) => (
                <div key={groupIndex} className="border p-4 rounded space-y-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => handleOptionGroupChange(groupIndex, e.target.value)}
                      className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      placeholder="Tên nhóm tùy chọn (VD: Màu sắc)"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeOptionGroup(groupIndex)}
                    >
                      Xóa nhóm
                    </Button>
                  </div>
                  {option.options.map((opt, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2 items-center pl-4">
                      <input
                        type="text"
                        value={opt.value}
                        onChange={(e) => handleOptionValueChange(groupIndex, optionIndex, e.target.value)}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                        placeholder="Giá trị tùy chọn (VD: Xám)"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeOptionValue(groupIndex, optionIndex)}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addOptionValue(groupIndex)}
                    className="ml-4"
                  >
                    Thêm giá trị
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có tùy chọn nào.</p>
          )}
          <Button type="button" onClick={addOptionGroup} className="mt-2">
            Thêm nhóm tùy chọn
          </Button>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublish"
              checked={form.isPublish}
              onChange={handleChange}
              className="h-5 w-5"
            />
            <span className="font-medium">Công khai sản phẩm</span>
          </label>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button
            type="submit"
            disabled={
              isCreating ||
              !form.name ||
              !form.brand ||
              !form.type ||
              form.price <= 0 ||
              form.quantity < 0 ||
              !form.specs[0].storage?.trim() ||
              !form.specs[0].gpu?.trim()
            }
          >
            Tạo sản phẩm
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ManageLaptopCreate