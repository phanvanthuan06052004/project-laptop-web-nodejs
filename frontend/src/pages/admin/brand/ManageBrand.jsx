import { useState } from "react"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Trash2, Edit, AlertCircle, Plus } from "lucide-react"

import { selectCurrentUser } from "~/store/slices/authSlice"
import { useGetBrandsQuery, useDeleteBrandMutation } from "~/store/apis/brandSlice"

import { Input } from "~/components/ui/Input"
import { Label } from "~/components/ui/Label"
import { Button } from "~/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/Select"
import { formatDate } from "~/utils/dateHelpers"

const BrandManagement = () => {
  const user = useSelector(selectCurrentUser)
  const isAdmin = user?.role === "admin"

  // State for pagination, search, and sorting
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")

  // Fetch brands
  const {
    data: brandsData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetBrandsQuery({ page, limit, sort, search })
  // Delete brand mutation
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation()

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      try {
        await deleteBrand(id).unwrap()
        toast.info("Xoá thành công")
        refetch()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to delete brand:", err)
        toast.error("Xoá thất bại")
      }
    }
  }

  if (!isAdmin) {
    return <div>Bạn không có quyền truy cập trang này.</div>
  }

  // Options for the Sort Select
  const sortOptions = [
    { value: "createdAt", label: "Ngày tạo" },
    { value: "name", label: "Tên thương hiệu" },
    { value: "updatedAt", label: "Ngày cập nhật" }
  ]

  // Find the label for the currently selected sort value
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sort)?.label || "Sắp xếp theo"

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý Thương hiệu</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search" className="mb-2">Tìm kiếm thương hiệu</Label>
          <Input
            id="search"
            placeholder="Nhập tên thương hiệu..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div>
          <Label htmlFor="sort" className="mb-2">Sắp xếp theo</Label>
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
        <Button className="mt-7">
          <Link to="/admin/brand/create">
            Thêm Thương hiệu
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Thương hiệu</CardTitle>
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
                    <TableHead>Logo</TableHead>
                    <TableHead>Tên thương hiệu</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Ngày cập nhật</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brandsData?.brands?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Không có thương hiệu nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    brandsData?.brands?.map((brand) => (
                      <TableRow key={brand._id}>
                        <TableCell>
                          <img
                            src={brand.logo || "/images/laptop-placeholder.webp"}
                            alt={brand.name}
                            className="object-contain h-9 w-12"
                            loading="lazy"
                          />

                        </TableCell>
                        <TableCell className="font-medium">
                          {brand.name}
                        </TableCell>
                        <TableCell>{brand.slug}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              brand.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {brand.is_active ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(brand.createdAt)}</TableCell>
                        <TableCell>{formatDate(brand.updatedAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Link to={`/admin/brand/edit/${brand._id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(brand._id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <div>
                  Hiển thị {brandsData?.brands?.length || 0} /{" "}
                  {brandsData?.pagination?.totalItems || 0} thương hiệu
                </div>
                <div className="flex gap-2">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Trước
                  </Button>
                  <Button
                    disabled={page >= brandsData?.pagination?.totalPages}
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

export default BrandManagement
