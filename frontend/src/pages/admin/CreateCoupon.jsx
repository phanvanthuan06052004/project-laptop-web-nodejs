"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card"
import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { Label } from "~/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/Select"
import { useCreateCouponMutation } from "~/store/apis/couponSlice"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import { Textarea } from "~/components/ui/Textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/Dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/Table"
import { useLazyGetProductsQuery } from "~/store/apis/productSlice"
import { Checkbox } from "~/components/ui/Checkbox"
import { toast } from "react-toastify"

const PRODUCTS_PER_PAGE = 10

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value)
}

const CreateCoupon = () => {
  const navigate = useNavigate()
  const [createCoupon, { isLoading, isError, error }] =
    useCreateCouponMutation()

  // Lazy query for products
  const [getProducts, { data: productsData, isLoading: isProductsLoading }] =
    useLazyGetProductsQuery()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    start_day: "",
    end_day: "",
    type: "AMOUNT",
    value: 0,
    max_value: null,
    min_value: 0,
    max_uses: 0,
    max_uses_per_user: 1,
    target_type: "PRODUCT",
    target_ids: [],
    is_public: false,
    is_active: true
  })

  // Dialog state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch products when dialog opens or page/search changes
  useEffect(() => {
    if (isProductDialogOpen) {
      getProducts({
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        name: searchTerm
      })
    }
  }, [isProductDialogOpen, currentPage, searchTerm, getProducts])

  // Update formData.target_ids when selectedProducts changes
  useEffect(() => {
    if (formData.target_type === "PRODUCT") {
      const newTargetIds = Object.keys(selectedProducts).filter(
        (key) => selectedProducts[key]
      )
      setFormData((prev) => ({
        ...prev,
        target_ids: newTargetIds
      }))
    }
  }, [selectedProducts, formData.target_type])

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // Handle checkbox change
  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }))
  }

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "target_type" && value !== "PRODUCT") {
      setFormData((prev) => ({ ...prev, target_ids: [] }))
      setSelectedProducts({})
    }
  }

  // Handle product selection
  const handleProductSelect = (productId, checked) => {
    setSelectedProducts((prev) => {
      const newSelected = { ...prev }
      if (checked) {
        newSelected[productId] = true
      } else {
        delete newSelected[productId]
      }
      return newSelected
    })
  }

  // Handle select all products
  const handleSelectAll = (checked) => {
    if (checked) {
      const allSelected = {}
      productsData?.products?.forEach(product => {
        allSelected[product._id] = true
      })
      setSelectedProducts(allSelected)
    } else {
      setSelectedProducts({})
    }
  }

  // Check if all products are selected
  const isAllSelected = productsData?.products?.length > 0 &&
    productsData.products.every(product => selectedProducts[product._id])

  // Check if some products are selected
  const isSomeSelected = productsData?.products?.some(product => selectedProducts[product._id])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to page 1 on search
  }

  // Pagination controls
  const totalPages = productsData?.pagination?.totalPages || 1
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  // Handle row click
  const handleRowClick = (productId) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.target_type === "PRODUCT" && formData.target_ids.length === 0) {
        toast.error("Vui lòng chọn ít nhất một sản phẩm.")
        return
      }
      const payload = {
        ...formData,
        description: formData.description.trim(),
        start_day: new Date(formData.start_day).getTime(),
        end_day: new Date(formData.end_day).getTime()
      }
      await createCoupon(payload).unwrap()
      toast.success("Tạo coupon thành công!")
      navigate("/admin/promotions")
    } catch (err) {
      toast.error("Không thể tạo coupon: " + (err?.data?.message || err.message))
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tạo Coupon Mới</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="flex items-center gap-2 text-destructive mb-4">
              <AlertCircle className="h-5 w-5" />
              <p>{error?.data?.message || "Đã xảy ra lỗi khi tạo coupon"}</p>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <Label htmlFor="name">Tên Coupon</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Mã Coupon</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="uppercase"
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="type">Loại Coupon</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMOUNT">Giảm giá cố định</SelectItem>
                  <SelectItem value="PERCENT">Giảm giá phần trăm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Giá trị</Label>
              <Input
                id="value"
                name="value"
                type="number"
                min="0"
                value={formData.value}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.type === "AMOUNT"
                  ? formatCurrency(formData.value)
                  : `${formData.value}%`}
              </p>
            </div>
            <div>
              <Label htmlFor="max_value">Giá trị giảm tối đa </Label>
              <Input
                id="max_value"
                name="max_value"
                type="number"
                min="0"
                value={formData.max_value || ""}
                onChange={handleChange}
              />
              {formData.max_value && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(formData.max_value)}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="min_value">Giá trị đơn hàng tối thiểu</Label>
              <Input
                id="min_value"
                name="min_value"
                type="number"
                min="0"
                value={formData.min_value}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(formData.min_value)}
              </p>
            </div>
            <div>
              <Label htmlFor="max_uses">Số lần sử dụng tối đa</Label>
              <Input
                id="max_uses"
                name="max_uses"
                type="number"
                min="0"
                value={formData.max_uses}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="max_uses_per_user">
                Số lần sử dụng tối đa mỗi người
              </Label>
              <Input
                id="max_uses_per_user"
                name="max_uses_per_user"
                type="number"
                min="1"
                value={formData.max_uses_per_user}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="start_day">Ngày bắt đầu</Label>
              <Input
                id="start_day"
                name="start_day"
                type="date"
                value={formData.start_day}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_day">Ngày kết thúc</Label>
              <Input
                id="end_day"
                name="end_day"
                type="date"
                value={formData.end_day}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="target_type">Loại áp dụng</Label>
              <Select
                value={formData.target_type}
                onValueChange={(value) =>
                  handleSelectChange("target_type", value)
                }
              >
                <SelectTrigger id="target_type">
                  <SelectValue placeholder="Chọn loại áp dụng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRODUCT">Sản phẩm</SelectItem>
                  <SelectItem value="ORDER">Đơn hàng</SelectItem>
                  <SelectItem value="FREESHIPPING">
                    Miễn phí vận chuyển
                  </SelectItem>
                </SelectContent>
              </Select>
              {formData.target_type === "PRODUCT" && (
                <Dialog
                  open={isProductDialogOpen}
                  onOpenChange={setIsProductDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div
                      role="button"
                      className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
                    >
                      Chọn Sản phẩm
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[600px] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Chọn Sản phẩm Áp dụng</DialogTitle>
                    </DialogHeader>
                    <div className="mb-4">
                      <Label htmlFor="product-search">Tìm kiếm sản phẩm</Label>
                      <Input
                        id="product-search"
                        placeholder="Nhập tên sản phẩm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mt-1"
                      />
                    </div>
                    {Object.keys(selectedProducts).length > 0 && (
                      <div className="mb-4">
                        <Label className="mb-2 block">Sản phẩm đã chọn:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {productsData?.products
                            ?.filter(product => selectedProducts[product._id])
                            .map(product => (
                              <div
                                key={product._id}
                                className="flex items-center justify-between p-2 bg-secondary/20 rounded-md"
                              >
                                <span className="text-sm truncate">{product.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProductSelect(product._id, false)}
                                  className="h-6 w-6 p-0"
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {isProductsLoading ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : !productsData?.products?.length ? (
                      <p className="text-center text-muted-foreground">
                        Không tìm thấy sản phẩm
                      </p>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>
                                <Checkbox
                                  checked={isAllSelected}
                                  indeterminate={isSomeSelected && !isAllSelected ? true : undefined}
                                  onCheckedChange={handleSelectAll}
                                />
                              </TableHead>
                              <TableHead>Tên Sản phẩm</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {productsData.products.map((product) => (
                              <TableRow
                                key={product._id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleRowClick(product._id)}
                              >
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    checked={selectedProducts[product._id] || false}
                                    onCheckedChange={(checked) => handleProductSelect(product._id, checked)}
                                  />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="flex justify-between items-center mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                          >
                            Trang trước
                          </Button>
                          <span>
                            Trang {currentPage} / {totalPages}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                          >
                            Trang sau
                          </Button>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={(e) => handleCheckboxChange("is_public", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor="is_public" className="select-none cursor-pointer">
                Công khai
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) => handleCheckboxChange("is_active", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
              />
              <Label htmlFor="is_active" className="select-none cursor-pointer">
                Hoạt động
              </Label>
            </div>
            <div className="col-span-2 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/promotions")}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang tạo..." : "Tạo Coupon"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateCoupon
