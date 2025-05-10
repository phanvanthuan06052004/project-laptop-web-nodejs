"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card"
import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table"
import { Badge } from "~/components/ui/Badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog"
import { Search, Eye, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useGetOrdersQuery, useUpdateOrderMutation } from "~/store/apis/orderSlice"
import { useDispatch } from "react-redux"
import { Pagination } from "~/components/ui/Pagination"
import { usePagination } from "~/hooks/usePagination"

const statusColors = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  processing: { bg: "bg-blue-100", text: "text-blue-800" },
  shipped: { bg: "bg-purple-100", text: "text-purple-800" },
  delivered: { bg: "bg-green-100", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", text: "text-red-800" },
  returned: { bg: "bg-gray-100", text: "text-gray-800" },
}

// Action creator for pagination
const setPage = (page) => ({
  type: "orders/setPage",
  payload: page,
})

const ManageOrders = () => {
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [currentPage, setCurrentPageState] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch orders with RTK Query
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrdersQuery({
    page: currentPage,
    limit: pageSize,
    status: statusFilter !== "all" ? statusFilter : "",
    search: searchQuery,
    sort: "createdAt",
    order: "desc",
  })

  // Setup pagination
  const totalPages = ordersData?.pagination?.totalPages || 1
  const pagination = usePagination(totalPages, currentPage, setPage)

  // Update local state when pagination changes from Redux
  useEffect(() => {
    setCurrentPageState(pagination.currentPage)
  }, [pagination.currentPage])

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()

  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  // Handle update order status
  const handleUpdateStatus = async (newStatus) => {
    if (selectedOrder) {
      try {
        await updateOrder({
          id: selectedOrder._id,
          data: { status: newStatus },
        }).unwrap()
        toast.success(`Đơn hàng ${selectedOrder.orderCode} đã được cập nhật thành ${newStatus}`)
        setIsOrderDetailsOpen(false)
      } catch (err) {
        toast.error(`Cập nhật thất bại: ${err.data?.message || "Đã xảy ra lỗi"}`)
      }
    }
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    pagination.setCurrentPage(1)
    refetch()
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã đơn, tên khách hàng, email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value)
            pagination.setCurrentPage(1)
          }}
        >
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Đang chờ</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="shipped">Đang giao</SelectItem>
            <SelectItem value="delivered">Đã giao</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
            <SelectItem value="returned">Đã trả hàng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xl">Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mb-2" />
              <h3 className="text-lg font-medium">Không thể tải dữ liệu</h3>
              <p className="text-muted-foreground mb-4">{error?.data?.message || "Đã xảy ra lỗi khi tải đơn hàng"}</p>
              <Button onClick={refetch}>Thử lại</Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData?.orders?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không tìm thấy đơn hàng nào phù hợp
                      </TableCell>
                    </TableRow>
                  ) : (
                    ordersData?.orders?.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.orderCode}</TableCell>
                        <TableCell>
                          <div>
                            {order.customerName || order.shippingInfo?.fullName}
                            <div className="text-xs text-muted-foreground">{order.shippingInfo?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${statusColors[order.status]?.bg || "bg-gray-100"} ${
                              statusColors[order.status]?.text || "text-gray-800"
                            } border-none capitalize`}
                          >
                            {order.status === "pending"
                              ? "Đang chờ"
                              : order.status === "processing"
                                ? "Đang xử lý"
                                : order.status === "shipped"
                                  ? "Đang giao"
                                  : order.status === "delivered"
                                    ? "Đã giao"
                                    : order.status === "cancelled"
                                      ? "Đã hủy"
                                      : order.status === "returned"
                                        ? "Đã trả hàng"
                                        : order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {ordersData?.pagination && (
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground text-center mb-2">
                    Hiển thị {ordersData.orders.length} / {ordersData.pagination.totalItems} đơn hàng
                  </div>
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    paginationButtons={pagination.paginationButtons}
                    handlePageChange={pagination.handlePageChange}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Đơn hàng {selectedOrder.orderCode}</DialogTitle>
              <DialogDescription>Đặt ngày {formatDate(selectedOrder.createdAt)}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Khách hàng</div>
                <div>{selectedOrder.customerName || selectedOrder.shippingInfo?.fullName}</div>

                <div className="font-medium">Email</div>
                <div>{selectedOrder.shippingInfo?.email}</div>

                <div className="font-medium">Số điện thoại</div>
                <div>{selectedOrder.shippingInfo?.phone}</div>

                <div className="font-medium">Địa chỉ</div>
                <div>{selectedOrder.shippingInfo?.address}</div>

                <div className="font-medium">Trạng thái</div>
                <div>
                  <Badge
                    variant="outline"
                    className={`${statusColors[selectedOrder.status]?.bg || "bg-gray-100"} ${
                      statusColors[selectedOrder.status]?.text || "text-gray-800"
                    } border-none capitalize`}
                  >
                    {selectedOrder.status === "pending"
                      ? "Đang chờ"
                      : selectedOrder.status === "processing"
                        ? "Đang xử lý"
                        : selectedOrder.status === "shipped"
                          ? "Đang giao"
                          : selectedOrder.status === "delivered"
                            ? "Đã giao"
                            : selectedOrder.status === "cancelled"
                              ? "Đã hủy"
                              : selectedOrder.status === "returned"
                                ? "Đã trả hàng"
                                : selectedOrder.status}
                  </Badge>
                </div>

                <div className="font-medium">Tổng tiền</div>
                <div>{formatCurrency(selectedOrder.totalAmount)}</div>

                <div className="font-medium">Phí vận chuyển</div>
                <div>{formatCurrency(selectedOrder.shippingCost || 0)}</div>

                <div className="font-medium">Phương thức thanh toán</div>
                <div>
                  {selectedOrder.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : selectedOrder.paymentMethod === "banking"
                      ? "Chuyển khoản ngân hàng"
                      : selectedOrder.paymentMethod === "momo"
                        ? "Ví MoMo"
                        : selectedOrder.paymentMethod === "vnpay"
                          ? "VNPay"
                          : selectedOrder.paymentMethod}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Sản phẩm</h4>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>
                        {item.productName} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedOrder.couponCodes && selectedOrder.couponCodes.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Mã giảm giá đã áp dụng</h4>
                  <ul className="space-y-1">
                    {selectedOrder.couponCodes.map((code, index) => (
                      <li key={index} className="text-sm">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{code}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedOrder.note && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Ghi chú</h4>
                  <p className="text-sm">{selectedOrder.note}</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:justify-start gap-2 sm:space-x-2">
              <h4 className="font-medium text-sm w-full text-left">Cập nhật trạng thái</h4>
              <div className="flex flex-wrap gap-2 justify-start w-full">
                {["pending", "processing", "shipped", "delivered", "cancelled", "returned"]
                  .filter((s) => s !== selectedOrder.status)
                  .map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(status)}
                      className="capitalize"
                      disabled={isUpdating}
                    >
                      {status === "pending"
                        ? "Đang chờ"
                        : status === "processing"
                          ? "Đang xử lý"
                          : status === "shipped"
                            ? "Đang giao"
                            : status === "delivered"
                              ? "Đã giao"
                              : status === "cancelled"
                                ? "Đã hủy"
                                : status === "returned"
                                  ? "Đã trả hàng"
                                  : status}
                    </Button>
                  ))}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ManageOrders
