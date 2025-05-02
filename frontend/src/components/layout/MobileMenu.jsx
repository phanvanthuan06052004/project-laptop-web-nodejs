import React from "react"
import { Link } from "react-router-dom"
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
  Users
} from "lucide-react"
import { Button } from "~/components/ui/button"
// import { Separator } from "@/components/ui/separator"

const MobileMenu = ({ isOpen, onClose }) => {
  // const { user, isAuthenticated, logout } = useAuth()
  // const isAdmin = user?.role === "admin"
  // const isStaff = user?.role === "staff"

  if (!isOpen) return null

  // const handleLogout = () => {
  //   logout()
  //   onClose()
  // }

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
          {/* {isAuthenticated && (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <User size={20} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          )} */}

          <nav className="py-4">
            <ul className="space-y-1">
              {[
                { title: "Home", path: "/" },
                { title: "Laptops", path: "/products" },
                { title: "Categories", path: "/categories" },
                { title: "Deals", path: "/deals" },
                { title: "Blog", path: "/blog" },
                { title: "Support", path: "/support" }
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

          {/* {(isAdmin || isStaff) && (
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
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orders"
                      className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                      onClick={onClose}
                    >
                      <ShoppingBag size={16} className="mr-2" />
                      <span>Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/reviews"
                      className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                      onClick={onClose}
                    >
                      <Star size={16} className="mr-2" />
                      <span>Reviews</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/support"
                      className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                      onClick={onClose}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      <span>Support</span>
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
                          <span>Manage Laptops</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/staff"
                          className="flex items-center px-4 py-2 hover:bg-muted rounded-md"
                          onClick={onClose}
                        >
                          <Users size={16} className="mr-2" />
                          <span>Manage Staff</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </>
          )} */}

          <div className="mt-auto border-t">
            <div className="py-4 px-4 space-y-4">
              {/* {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center space-x-2 py-2"
                    onClick={onClose}
                  >
                    <User size={20} />
                    <span>My Account</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-2 py-2"
                    onClick={onClose}
                  >
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center space-x-2 py-2"
                    onClick={onClose}
                  >
                    <ShoppingBag size={20} />
                    <span>My Orders</span>
                  </Link>
                  <Button
                    variant="ghost"
                    className="flex items-center w-full justify-start px-0 hover:bg-transparent hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-2" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 py-2"
                    onClick={onClose}
                  >
                    <User size={20} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 py-2"
                    onClick={onClose}
                  >
                    <User size={20} />
                    <span>Create Account</span>
                  </Link>
                </>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
