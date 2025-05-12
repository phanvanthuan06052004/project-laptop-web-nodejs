import React, { useState, useMemo } from "react"
import { useGetUserOrdersQuery } from "~/store/apis/orderSlice"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "~/store/slices/authSlice"
import { Navigate } from "react-router-dom"
import { formatPrice } from "~/utils/formatPrice"
import dayjs from "dayjs"

const STATUS_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "Pending", label: "Chờ thanh toán" },
  { key: "Processing", label: "Đang xử lý" },
  { key: "Shipped", label: "Đang giao" },
  { key: "Delivered", label: "Hoàn thành" },
  { key: "Cancelled", label: "Đã hủy" },
  { key: "Refunded", label: "Trả hàng/Hoàn tiền" }
]

const STATUS_COLORS = {
  Pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
  Processing: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  Shipped: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700",
  Delivered: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
  Cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
  Refunded: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
}

const PAYMENT_STATUS_COLORS = {
  Pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
  Paid: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
  Failed: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
}

const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const user = useSelector(selectCurrentUser)

  const { data: ordersData, isLoading, error } = useGetUserOrdersQuery(user?._id, {
    skip: !user?._id
  })

  // useMemo luôn được gọi, không phụ thuộc vào điều kiện
  const filteredOrders = useMemo(() => {
    if (!ordersData) return []
    if (activeTab === "all") return ordersData
    return ordersData.filter(order => order.status === activeTab)
  }, [ordersData, activeTab])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Badge trạng thái
  const StatusBadge = ({ status }) => (
    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"}`}>
      {STATUS_TABS.find(t => t.key === status)?.label || status}
    </span>
  )

  // Badge trạng thái thanh toán
  const PaymentStatusBadge = ({ status }) => (
    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${PAYMENT_STATUS_COLORS[status] || "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"}`}>
      {status === "Paid" ? "Đã thanh toán" : status === "Pending" ? "Chờ thanh toán" : "Thất bại"}
    </span>
  )

  // Card đơn hàng
  const OrderCard = ({ order }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <StatusBadge status={order.paymentMethod} />
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">Mã đơn: <span className="font-semibold text-gray-700 dark:text-gray-300">{order.orderCode}</span></span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
          <span className="text-xs text-gray-500 dark:text-gray-400">Tổng tiền:</span>
          <span className="font-bold text-lg text-blue-700 dark:text-blue-400">{formatPrice(order.totalAmount)}</span>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>
      <div className="px-6 py-4">
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-2 border-b dark:border-gray-700 last:border-b-0">
            <img
              src={item.avatar || "/laptop-default.png"}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded border dark:border-gray-700"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800 dark:text-gray-200">{item.productName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Số lượng: {item.quantity}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-700 dark:text-gray-300">{formatPrice(item.price)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-end px-6 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
        <button
          className="px-4 py-1 rounded border border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
          onClick={() => setModalVisible(true) || setSelectedOrder(order)}
        >
          Xem chi tiết
        </button>
        <button
          className="px-4 py-1 rounded border border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 transition"
        >
          Đánh giá
        </button>
        <button
          className="px-4 py-1 rounded border border-orange-500 dark:border-orange-400 text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/30 transition"
        >
          Yêu cầu hoàn tiền
        </button>
        <button
          className="px-4 py-1 rounded border border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 transition"
        >
          Hủy đơn
        </button>
      </div>
    </div>
  )

  // Modal chi tiết đơn hàng
  const OrderDetailModal = () => {
    if (!selectedOrder) return null
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${modalVisible ? "" : "hidden"}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
          <button
            className="absolute top-2 right-4 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-2xl"
            onClick={() => setModalVisible(false)}
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">Chi tiết đơn hàng</h2>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Mã đơn: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedOrder.orderCode}</span></div>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Ngày đặt: {dayjs(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm")}</div>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Trạng thái: <StatusBadge status={selectedOrder.status} /></div>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Trạng thái thanh toán: <PaymentStatusBadge status={selectedOrder.paymentStatus} /></div>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Phương thức thanh toán: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedOrder.paymentMethod}</span></div>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Địa chỉ giao hàng: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.province}</span></div>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Số điện thoại: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedOrder.shippingAddress.phone}</span></div>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Email: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedOrder.shippingAddress.email}</span></div>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Ghi chú: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedOrder.shippingAddress.notes ? selectedOrder.shippingAddress.notes : "Không có ghi chú"}</span></div>
          <div className="mt-4 mb-2 font-semibold text-blue-700 dark:text-blue-400">Danh sách sản phẩm</div>
          <div className="max-h-48 overflow-y-auto mb-4">
            {selectedOrder.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 py-2 border-b dark:border-gray-700 last:border-b-0">
                <img
                  src={item.avatar || "/laptop-default.png"}
                  alt={item.avatar}
                  className="w-14 h-14 object-cover rounded border dark:border-gray-700"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200">{item.productName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Số lượng: {item.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-8 mt-4">
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Phí vận chuyển</div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">{formatPrice(selectedOrder.shippingCost)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tổng tiền</div>
              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">{formatPrice(selectedOrder.totalAmount)}</div>
            </div>
          </div>
          {selectedOrder.couponCodes?.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mã giảm giá đã sử dụng:</div>
              <div className="flex gap-2 flex-wrap">
                {selectedOrder.couponCodes.map((code) => (
                  <span key={code} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-700">{code}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Đơn hàng của tôi</h1>
        <p className="text-red-500 dark:text-red-400">Có lỗi xảy ra khi tải danh sách đơn hàng</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] bg-gray-50 dark:bg-gray-900">
      {/* Sidebar + Main content */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 py-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-transparent rounded-lg shadow-sm dark:border-gray-700 p-6 mb-6 md:mb-0">
          <div className="font-bold text-blue-700 dark:text-blue-400 text-lg mb-4">Tài khoản</div>
          <ul className="space-y-3">
            <li className="text-gray-700 dark:text-gray-300 font-semibold">Đơn Mua</li>
            <li className="text-gray-500 dark:text-gray-400">Thông Báo</li>
            <li className="text-gray-500 dark:text-gray-400">Tài Khoản Của Tôi</li>
            <li className="text-gray-500 dark:text-gray-400">Kho Voucher</li>
          </ul>
        </aside>
        {/* Main content */}
        <main className="flex-1">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                className={`px-4 py-2 rounded-full font-semibold border transition text-sm ${
                  activeTab === tab.key 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Order list */}
          {isLoading ? (
            <div className="text-center text-blue-600 dark:text-blue-400 py-12">Đang tải đơn hàng...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 py-12">Không có đơn hàng nào.</div>
          ) : (
            [...filteredOrders].reverse().map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </main>
      </div>
      <OrderDetailModal />
    </div>
  )
}

export default OrderList 