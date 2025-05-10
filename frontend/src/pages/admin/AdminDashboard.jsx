"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs"
import { ShoppingBag, Users, Star, MessageSquare, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "~/store/slices/authSlice"
import { useGetOrdersQuery } from "~/store/apis/orderSlice"
import { Button } from "~/components/ui/button"

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser)
  const isAdmin = user?.role === "admin"

  // Fetch recent orders
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrdersQuery({
    page: 1,
    limit: 5,
    sort: "createdAt",
    order: "desc",
  })

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    orders: {
      total: 0,
      change: "+0",
    },
    reviews: {
      total: 0,
      change: "+0",
    },
    support: {
      total: 0,
      unread: 0,
    },
    customers: {
      total: 0,
      change: "+0",
    },
  })

  // Update dashboard stats when orders data is loaded
  useEffect(() => {
    if (ordersData) {
      setDashboardStats((prev) => ({
        ...prev,
        orders: {
          total: ordersData.pagination.totalItems,
          change: `+${Math.floor(Math.random() * 10)} so với hôm qua`,
        },
      }))
    }
  }, [ordersData])

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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Đang chờ", class: "bg-yellow-100 text-yellow-800" },
      processing: { label: "Đang xử lý", class: "bg-blue-100 text-blue-800" },
      shipped: { label: "Đang giao", class: "bg-purple-100 text-purple-800" },
      delivered: { label: "Đã giao", class: "bg-green-100 text-green-800" },
      cancelled: { label: "Đã hủy", class: "bg-red-100 text-red-800" },
      returned: { label: "Đã trả hàng", class: "bg-gray-100 text-gray-800" },
    }

    const { label, class: className } = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800" }
    return <span className={`inline-block px-2 py-1 rounded-full text-xs ${className}`}>{label}</span>
  }

  // Mock data for other tabs
  const supportTickets = [
    {
      id: "TKT-1234",
      subject: "Vấn đề đơn hàng",
      customer: "Khách 1",
      date: new Date(Date.now() - 86400000),
      status: { label: "Khẩn cấp", class: "bg-red-100 text-red-800" },
    },
    {
      id: "TKT-1235",
      subject: "Câu hỏi sản phẩm",
      customer: "Khách 2",
      date: new Date(Date.now() - 2 * 86400000),
      status: { label: "Đang mở", class: "bg-orange-100 text-orange-800" },
    },
    {
      id: "TKT-1236",
      subject: "Yêu cầu trả hàng",
      customer: "Khách 3",
      date: new Date(Date.now() - 3 * 86400000),
      status: { label: "Đã xử lý", class: "bg-green-100 text-green-800" },
    },
  ]

  const inventoryItems = [
    {
      id: "PRD-1234",
      name: "Mẫu Laptop A",
      stock: 3,
      status: { label: "Sắp hết hàng", class: "bg-red-100 text-red-800" },
    },
    {
      id: "PRD-1235",
      name: "Mẫu Laptop B",
      stock: 15,
      status: { label: "Còn hàng", class: "bg-green-100 text-green-800" },
    },
    {
      id: "PRD-1236",
      name: "Mẫu Laptop C",
      stock: 2,
      status: { label: "Sắp hết hàng", class: "bg-red-100 text-red-800" },
    },
    {
      id: "PRD-1237",
      name: "Mẫu Laptop D",
      stock: 22,
      status: { label: "Còn hàng", class: "bg-green-100 text-green-800" },
    },
  ]

  // Dashboard card data
  const cardData = [
    {
      icon: <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />,
      title: "Đơn hàng",
      value: dashboardStats.orders.total.toString(),
      subtitle: dashboardStats.orders.change,
    },
    {
      icon: <Star className="mr-2 h-4 w-4 text-muted-foreground" />,
      title: "Đánh giá",
      value: "12",
      subtitle: "+2 so với hôm qua",
    },
    {
      icon: <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />,
      title: "Tin nhắn hỗ trợ",
      value: "8",
      subtitle: "3 tin chưa đọc",
    },
    isAdmin
      ? {
          icon: <Users className="mr-2 h-4 w-4 text-muted-foreground" />,
          title: "Tổng khách hàng",
          value: "45",
          subtitle: "+3 mới trong tuần",
        }
      : {
          icon: <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />,
          title: "Nhiệm vụ được giao",
          value: "6",
          subtitle: "2 nhiệm vụ khẩn cấp",
        },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bảng điều khiển</h1>
      <p className="text-muted-foreground mb-6">
        Chào mừng trở lại, <span className="font-medium">{user?.displayname || user?.name}</span>! Đây là tổng quan về{" "}
        {isAdmin ? "cửa hàng của bạn" : "nhiệm vụ của bạn"}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cardData.map((card, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                {card.icon}
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">Đơn hàng gần đây</TabsTrigger>
          <TabsTrigger value="support">Hỗ trợ khách hàng</TabsTrigger>
          {isAdmin && <TabsTrigger value="inventory">Kho hàng</TabsTrigger>}
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Đang tải dữ liệu..."
                  : isError
                    ? "Không thể tải dữ liệu đơn hàng"
                    : `${ordersData?.orders?.length || 0} đơn hàng mới cần xử lý`}
              </CardDescription>
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
                  <p className="text-muted-foreground mb-4">
                    {error?.data?.message || "Đã xảy ra lỗi khi tải đơn hàng"}
                  </p>
                  <Button onClick={refetch}>Thử lại</Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersData?.orders?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Không có đơn hàng nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      ordersData?.orders?.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">{order.orderCode}</TableCell>
                          <TableCell>{order.customerName || order.shippingInfo?.fullName}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Yêu cầu hỗ trợ</CardTitle>
              <CardDescription>Các yêu cầu hỗ trợ gần đây từ khách hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã ticket</TableHead>
                    <TableHead>Chủ đề</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>{formatDate(ticket.date)}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${ticket.status.class}`}>
                          {ticket.status.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái kho</CardTitle>
                <CardDescription>Sản phẩm cần được bổ sung</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã sản phẩm</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Tồn kho</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${item.status.class}`}>
                            {item.status.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default AdminDashboard
