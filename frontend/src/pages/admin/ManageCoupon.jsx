/* eslint-disable no-console */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/Table"
import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "~/store/slices/authSlice"
import {
  useGetAllAdminQuery,
  useDeleteCouponMutation
} from "~/store/apis/couponSlice"
import { Trash2, Edit, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Label } from "~/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/Select"
import { toast } from "react-toastify"

const CouponManagement = () => {
  const user = useSelector(selectCurrentUser)
  const isAdmin = user?.role === "admin"

  // State for pagination, search, and sorting
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")

  // Fetch coupons
  const {
    data: couponsData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetAllAdminQuery({
    page,
    limit,
    sort,
    search
  })

  console.log("couponsData:", couponsData)
  console.log("error:", error)

  // Delete coupon mutation
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation()

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa coupon này?")) {
      try {
        await deleteCoupon(id).unwrap()
        toast.info("Xoá thành công")
        refetch()
      } catch (err) {
        console.error("Failed to delete coupon:", err)
      }
    }
  }

  if (!isAdmin) {
    return <div>Bạn không có quyền truy cập trang này.</div>
  }

  // Options for the Sort Select
  const sortOptions = [
    { value: "createdAt", label: "Ngày tạo" },
    { value: "code", label: "Mã coupon" },
    { value: "name", label: "Tên" },
    { value: "updatedAt", label: "Ngày cập nhật" }
  ]

  // Find the label for the currently selected sort value
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sort)?.label || "Sắp xếp theo"

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý Coupon</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search">Tìm kiếm mã coupon</Label>
          <Input
            id="search"
            placeholder="Nhập mã coupon..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div>
          <Label htmlFor="sort">Sắp xếp theo</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="sort">
              <SelectValue>{selectedSortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Removed the "Thứ tự" Select */}
        <Button className="mt-6" asChild>
          <Link to="/admin/promotions/create">Tạo Coupon</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Coupon</CardTitle>
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
                {error?.data?.message || "Đã xảy ra lỗi"}
              </p>
              <Button onClick={refetch}>Thử lại</Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Coupon</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                    {/* Removed the "Thứ tự" TableHead */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {couponsData?.coupons?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Không có coupon nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    couponsData?.coupons?.map((coupon) => (
                      <TableRow key={coupon._id}>
                        <TableCell className="font-medium">
                          {coupon.code}
                        </TableCell>
                        <TableCell>{coupon.name}</TableCell>
                        <TableCell>
                          {coupon.type === "PERCENT"
                            ? `${coupon.value}%`
                            : formatCurrency(coupon.value)}
                        </TableCell>
                        <TableCell>{formatDate(coupon.start_day)}</TableCell>
                        <TableCell>{formatDate(coupon.end_day)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              coupon.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {coupon.is_active ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/admin/promotions/edit/${coupon._id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(coupon._id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        {/* Removed the TableCell for "Thứ tự" */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <div>
                  Hiển thị {couponsData?.coupons?.length || 0} /{" "}
                  {couponsData?.pagination?.totalItems || 0} coupon
                </div>
                <div className="flex gap-2">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Trước
                  </Button>
                  <Button
                    disabled={page >= couponsData?.pagination?.totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CouponManagement