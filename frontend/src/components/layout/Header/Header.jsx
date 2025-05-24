import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, ShoppingCart, Menu, User, X, LogOut } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/DropdownMenu"
import MobileMenu from "./MobileMenu"
import SearchBar from "~/components/search/SearchBar"
import { logOut, selectCurrentUser } from "~/store/slices/authSlice"
import CartDrawer from "./CartDrawer"
import ThemeToggle from "~/components/theme/ThemeToggle"
import { useCountItemCartQuery } from "~/store/apis/cartSlice"
import Avatar from "~/components/common/Avatar"

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const userInfo = useSelector(selectCurrentUser)
  const isAuthenticated = !!userInfo

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: cartNumber, refetch } = useCountItemCartQuery(undefined, {
    skip: !isAuthenticated
  })

  useEffect(() => {
    if (isAuthenticated) {
      refetch()
    }
  }, [isAuthenticated, refetch])

  const handleLogout = () => {
    try {
      dispatch(logOut())
      toast.success("Đăng xuất thành công!")
      navigate("/")
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout failed:", error)
      toast.error("Đăng xuất thất bại. Vui lòng thử lại!")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">LapVibe</span>
          </Link>
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 ">
            <Link to="/" className="font-medium hover:text-primary">Trang Chủ</Link>
            <Link to="/products" className="font-medium hover:text-primary">Laptop</Link>
            <Link to="/blog" className="font-medium hover:text-primary">Bài Viết</Link>
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <div className="relative">
              <ThemeToggle />
            </div>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:bg-muted rounded-full">
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Account dropdown menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-full">
                  {/* <User size={20} /> */}
                  <Avatar
                    src={userInfo?.avatar}
                    name={userInfo?.displayname}
                    size="sm"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800 dark:hover:text-black cursor-pointer">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userInfo?.displayname}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userInfo?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    Tài khoản của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account/orders")}>
                    Đơn hàng
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                    Danh sách yêu thích
                  </DropdownMenuItem>
                  {userInfo?.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        Trang quản trị
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="p-2 hover:bg-muted rounded-full">
                <div className="flex items-center justify-center gap-2"> <User size={20} /> <h6>Đăng nhập</h6>  </div>
              </Link>
            )}

            {/* Cart */}
            {isAuthenticated && (
              <button onClick={() => navigate("/cart")} className="p-2 hover:bg-muted rounded-full relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartNumber ? cartNumber : 0}
                </span>
              </button>

            ) }

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 hover:bg-muted rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-3 animate-slideUp">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (<MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />)}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

export default Header
