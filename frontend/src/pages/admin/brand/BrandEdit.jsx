import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

import { useGetBrandByIdQuery, useUpdateBrandMutation } from "~/store/apis/brandSlice"
import { selectCurrentUser } from "~/store/slices/authSlice"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card"
import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { Label } from "~/components/ui/Label"
import { Textarea } from "~/components/ui/Textarea"
import { Checkbox } from "~/components/ui/Checkbox"

const BrandEdit = () => {
  const { id } = useParams()
  const user = useSelector(selectCurrentUser)
  const isAdmin = user?.role === "admin"
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    is_active: true
  })

  // Fetch brand data
  const {
    data: brand,
    isLoading: isLoadingBrand,
    isError,
    error
  } = useGetBrandByIdQuery(id)

  // Update brand mutation
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation()

  // Set form data when brand data is loaded
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        description: brand.description || "",
        logo: brand.logo || "",
        is_active: brand.is_active !== undefined ? brand.is_active : true
      })
    }
  }, [brand])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Tên thương hiệu không được để trống")
      return
    }

    try {
      await updateBrand({ id, data: formData }).unwrap()
      toast.success("Cập nhật thương hiệu thành công")
      navigate("/admin/brand")
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to update brand:", error)
      const errorMessage = error?.data?.message || "Đã xảy ra lỗi khi cập nhật thương hiệu"
      toast.error(errorMessage)
    }
  }

  if (!isAdmin) {
    return <div>Bạn không có quyền truy cập trang này.</div>
  }

  if (isLoadingBrand) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-2" />
          <h3 className="text-lg font-medium">Không thể tải dữ liệu</h3>
          <p className="text-muted-foreground mb-4">
            {error?.data?.message || "Đã xảy ra lỗi"}
          </p>
          <Button onClick={() => navigate("/admin/brand")}>Quay lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline"className="mr-4">
          <Link to="/admin/brand" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Chỉnh sửa thương hiệu</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin thương hiệu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="name">
                Tên thương hiệu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên thương hiệu"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả thương hiệu (không bắt buộc)"
                rows={4}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="logo">URL Logo</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="Nhập URL hình ảnh logo"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">Kích hoạt</Label>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate("/admin/brand")}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default BrandEdit
