import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateBrandMutation } from "~/store/apis/brandSlice"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "~/store/slices/authSlice"
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card"
import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { Label } from "~/components/ui/Label"
import { Textarea } from "~/components/ui/Textarea"
import { Checkbox } from "~/components/ui/Checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

const BrandCreate = () => {
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

  // Create brand mutation
  const [createBrand, { isLoading }] = useCreateBrandMutation()

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
      await createBrand(formData).unwrap()
      toast.success("Thêm thương hiệu thành công")
      navigate("/admin/brand")
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to create brand:", error)
      const errorMessage = error?.data?.message || "Đã xảy ra lỗi khi thêm thương hiệu"
      toast.error(errorMessage)
    }
  }

  if (!isAdmin) {
    return <div>Bạn không có quyền truy cập trang này.</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" className="mr-4" asChild>
          <Link to="/admin/brand" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Thêm thương hiệu mới</h1>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Thêm thương hiệu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default BrandCreate
