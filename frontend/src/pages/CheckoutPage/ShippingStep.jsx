import React, { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { ChevronRight, CreditCard, Wallet, Truck } from "lucide-react"

const ShippingStep = ({
  shippingDetails,
  setShippingDetails,
  shippingMethod,
  setShippingMethod,
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  onAddressChange
}) => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false
  })

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(prev => ({ ...prev, provinces: true }))
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/")
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        console.error("Error fetching provinces:", error)
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }))
      }
    }
    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!shippingDetails.province) {
        setDistricts([])
        return
      }
      setLoading(prev => ({ ...prev, districts: true }))
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${shippingDetails.province}?depth=2`)
        const data = await response.json()
        setDistricts(data.districts)
      } catch (error) {
        console.error("Error fetching districts:", error)
      } finally {
        setLoading(prev => ({ ...prev, districts: false }))
      }
    }
    fetchDistricts()
  }, [shippingDetails.province])

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!shippingDetails.district) {
        setWards([])
        return
      }
      setLoading(prev => ({ ...prev, wards: true }))
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${shippingDetails.district}?depth=2`)
        const data = await response.json()
        setWards(data.wards)
      } catch (error) {
        console.error("Error fetching wards:", error)
      } finally {
        setLoading(prev => ({ ...prev, wards: false }))
      }
    }
    fetchWards()
  }, [shippingDetails.district])

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingDetails((prev) => {
      const newDetails = { ...prev, [name]: value }
      if (name === "province") {
        newDetails.district = ""
        newDetails.ward = ""
      } else if (name === "district") {
        newDetails.ward = ""
      }
      const provinceName = name === "province"
        ? provinces.find(p => p.code == value)?.name || ""
        : provinces.find(p => p.code == newDetails.province)?.name || ""
      const districtName = name === "district"
        ? districts.find(d => d.code == value)?.name || ""
        : districts.find(d => d.code == newDetails.district)?.name || ""
      const wardName = name === "ward"
        ? wards.find(w => w.code == value)?.name || ""
        : wards.find(w => w.code == newDetails.ward)?.name || ""
      if (onAddressChange) {
        onAddressChange({
          province: provinceName,
          district: districtName,
          ward: wardName
        })
      }
      return newDetails
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const provinceName = provinces.find(p => p.code == shippingDetails.province)?.name || ""
    const districtName = districts.find(d => d.code == shippingDetails.district)?.name || ""
    const wardName = wards.find(w => w.code == shippingDetails.ward)?.name || ""
    const shippingAddress = {
      ...shippingDetails,
      province: provinceName,
      district: districtName,
      ward: wardName
    }
    if (onSubmit) onSubmit(shippingAddress)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              Họ *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.firstName}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Tên *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.lastName}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.email}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.phone}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="province" className="block text-sm font-medium mb-1">
              Tỉnh/Thành phố *
            </label>
            <select
              id="province"
              name="province"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.province}
              onChange={handleShippingChange}
              required
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
            {loading.provinces && <span className="text-sm text-gray-500">Đang tải...</span>}
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium mb-1">
              Quận/Huyện *
            </label>
            <select
              id="district"
              name="district"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.district}
              onChange={handleShippingChange}
              required
              disabled={!shippingDetails.province}
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
            {loading.districts && <span className="text-sm text-gray-500">Đang tải...</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ward" className="block text-sm font-medium mb-1">
              Phường/Xã *
            </label>
            <select
              id="ward"
              name="ward"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.ward}
              onChange={handleShippingChange}
              required
              disabled={!shippingDetails.district}
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
            {loading.wards && <span className="text-sm text-gray-500">Đang tải...</span>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Địa chỉ chi tiết *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={shippingDetails.address}
              onChange={handleShippingChange}
              placeholder="Số nhà, tên đường..."
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Ghi chú
          </label>
          <input
            type="text"
            id="notes"
            name="notes"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={shippingDetails.notes}
            onChange={handleShippingChange}
            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Phương thức vận chuyển</h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
                className="mr-3 text-primary focus:ring-primary"
              />
              <div className="flex items-center justify-between flex-1">
                <div>
                  <div className="font-medium">Giao hàng tiêu chuẩn</div>
                  <div className="text-sm text-gray-500">3-5 ngày làm việc</div>
                </div>
                <div className="font-medium">₫30.000</div>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
                className="mr-3 text-primary focus:ring-primary"
              />
              <div className="flex items-center justify-between flex-1">
                <div>
                  <div className="font-medium">Giao hàng nhanh</div>
                  <div className="text-sm text-gray-500">1-2 ngày làm việc</div>
                </div>
                <div className="font-medium">₫50.000</div>
              </div>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Phương thức thanh toán</h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-primary focus:ring-primary"
              />
              <div className="flex items-center">
                <Truck className="w-5 h-5 mr-3 text-gray-600" />
                <div>
                  <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-sm text-gray-500">Thanh toán khi nhận được hàng</div>
                </div>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="BANK"
                checked={paymentMethod === "BANK"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-primary focus:ring-primary"
              />
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <div className="font-medium">Chuyển khoản ngân hàng</div>
                  <div className="text-sm text-gray-500">Thanh toán qua ngân hàng hoặc ví điện tử</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">
          {paymentMethod === "BANK" ? (
            <>Tiếp tục thanh toán <ChevronRight size={16} className="ml-1" /></>
          ) : (
            <>Đặt hàng <ChevronRight size={16} className="ml-1" /></>
          )}
        </Button>
      </form>
    </div>
  )
}

export default ShippingStep