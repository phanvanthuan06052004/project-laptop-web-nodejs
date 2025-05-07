import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import {
  X,
  ChevronRight,
  User,
  Heart,
  ShoppingBag,
  LogOut,
  Laptop,
  Star,
  MessageSquare,
  LayoutDashboard,
  Users,
  UserPlus
} from "lucide-react"

import { logOut, selectCurrentUser } from "~/store/slices/authSlice"
import { Button } from "~/components/ui/Button"
import { Separator } from "~/components/ui/Separator"

const DEFAULT_AVATAR = "/images/avatar-default.webp"

const MobileMenu = ({ isOpen, onClose }) => {
  const userInfo = useSelector(selectCurrentUser)
  const isAuthenticated = !!userInfo
  const isAdmin = userInfo?.role === "admin"
  const isStaff = userInfo?.role === "staff"

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    try {
      dispatch(logOut())
      toast.success("Đăng xuất thành công!")
      navigate("/")
      onClose()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout failed:", error)
      toast.error("Đăng xuất thất bại. Vui lòng thử lại!")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background z-50 md:hidden">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto flex-grow">
          {isAuthenticated && (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {userInfo?.avatar ? (
                    <img
                      src={userInfo.avatar || DEFAULT_AVATAR}
                      alt={userInfo.displayname}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <User size={20} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{userInfo?.displayname}</p>
                  <p className="text-sm text-muted-foreground">{userInfo?.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="py-4">
            <ul className="space-y-1">
              {[
                { title: "Trang chủ", path: "/" },
                { title: "Laptop ", path: "/products" },
                { title: "Danh mục", path: "/categories" },
                { title: "Ưu đãi", path: "/deals" },
                { title: "Bài viết", path: "/blog" },
                { title: "Hỗ trợ", path: "/support" }
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted"
                    onClick={onClose}
                  >
                    <span>{item.title}</span>
                    <ChevronRight size={20} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {(isAdmin || isStaff) && (
            <>
              <Separator className="my-2" />
              <div className="px-4 py-2">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  {isAdmin ? "ADMIN" : "STAFF"} PANEL
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                      onClick={onClose}
                    >
                      <LayoutDashboard size={16} className="mr-2" />
                      <span>Trang quản trị</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orders"
                      className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                      onClick={onClose}
                    >
                      <ShoppingBag size={16} className="mr-2" />
                      <span>Đơn hàng</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/reviews"
                      className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                      onClick={onClose}
                    >
                      <Star size={16} className="mr-2" />
                      <span>Đánh giá</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/support"
                      className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                      onClick={onClose}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      <span>Hỗ trợ</span>
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <li>
                        <Link
                          to="/admin/laptops"
                          className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                          onClick={onClose}
                        >
                          <Laptop size={16} className="mr-2" />
                          <span>Quản lý Laptop</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/staff"
                          className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                          onClick={onClose}
                        >
                          <Users size={16} className="mr-2" />
                          <span>Quản lý nhân viên</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </>
          )}

          <div className="mt-auto border-t">
            <div className="py-4 px-4 space-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center space-x-2 py-2"
                    onClick={onClose}
                  >
                    <User size={20} />
                    <span>Tài khoản của tôi</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-2 py-2"
                    onClick={onClose}
                  >
                    <Heart size={20} />
                    <span>Danh sách yêu thích</span>
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center space-x-2 py-2"
                    onClick={onClose}
                  >
                    <ShoppingBag size={20} />
                    <span>Đơn hàng</span>
                  </Link>
                  <Button
                    variant="destructive"
                    className="flex items-center w-full justify-start px-0"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-2" />
                    <span>Đăng xuất</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2"
                    onClick={onClose}
                  >
                    <Button className='w-full'>
                      <User size={20} />
                      <span>Đăng nhập</span>
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2"
                    onClick={onClose}
                  >
                    <Button className='w-full' variant="secondary">
                      <UserPlus size={20} />
                      <span>Đăng ký</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
