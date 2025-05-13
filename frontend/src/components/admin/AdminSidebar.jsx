"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  FileText,
  Settings,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Tag
} from "lucide-react"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "~/store/slices/authSlice"
import Avatar from "../common/Avatar"

const AdminSidebar = () => {
  const location = useLocation()
  const user = useSelector(selectCurrentUser)
  const isAdmin = user?.role === "admin"

  // State to track which menu groups are expanded
  const [expandedGroups, setExpandedGroups] = useState({
    products: false,
    orders: false,
    users: false,
    content: false
  })

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group]
    }))
  }

  // Define menu items with nested structure
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      exact: true
    },
    {
      title: "Sản phẩm",
      icon: Package,
      group: "products",
      children: [
        { title: "Tất cả sản phẩm", path: "/admin/products" },
        { title: "Thêm sản phẩm", path: "/admin/products/new" },
        { title: "Danh mục", path: "/admin/categories" },
        { title: "Thương hiệu", path: "/admin/brands" },
        { title: "Thuộc tính", path: "/admin/attributes" }
      ]
    },
    {
      title: "Đơn hàng",
      icon: ShoppingBag,
      group: "orders",
      children: [
        { title: "Tất cả đơn hàng", path: "/admin/orders" },
        { title: "Đơn hàng mới", path: "/admin/orders/new" },
        { title: "Đang xử lý", path: "/admin/orders/processing" },
        { title: "Đã hoàn thành", path: "/admin/orders/completed" },
        { title: "Đã hủy", path: "/admin/orders/cancelled" }
      ]
    },
    {
      title: "Khách hàng",
      icon: Users,
      path: "/admin/customers",
      adminOnly: true
    },
    {
      title: "Nhân viên",
      icon: Users,
      path: "/admin/staff",
      adminOnly: true
    },
    {
      title: "Đánh giá",
      icon: FileText,
      path: "/admin/reviews"
    },
    {
      title: "Nội dung",
      icon: FileText,
      group: "content",
      children: [
        { title: "Bài viết", path: "/admin/blog" },
        { title: "Trang", path: "/admin/pages" },
        { title: "Banner", path: "/admin/banners" },
        { title: "Khuyến mãi", path: "/admin/promotions" }
      ]
    },
    {
      title: "Báo cáo",
      icon: BarChart3,
      path: "/admin/reports",
      adminOnly: true
    },
    {
      title: "Hỗ trợ",
      icon: MessageSquare,
      path: "/admin/support"
    },
    {
      title: "Cài đặt",
      icon: Settings,
      path: "/admin/settings",
      adminOnly: true
    },
    {
      title: "Mã giảm giá",
      icon: Tag,
      path: "/admin/promotions",
      adminOnly: true
    }
  ]

  // Check if a path is active
  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") {
      return true
    }
    return location.pathname.startsWith(path) && path !== "/admin"
  }

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => !item.adminOnly || (item.adminOnly && isAdmin))

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar
              src={user?.avatar}
              name={user?.displayname}
              size="md"
            />
            <div>
              <p className="font-medium">{user?.displayname || "Admin User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === "admin" ? "Quản trị viên" : "Nhân viên"}
              </p>
            </div>
          </div>
        </div>

        <nav>
          <ul className="space-y-1">
            {filteredMenuItems.map((item, index) => {
              const Icon = item.icon

              // If item has children, render a collapsible group
              if (item.children) {
                const isExpanded = expandedGroups[item.group]
                const hasActiveChild = item.children.some((child) => isActive(child.path))

                return (
                  <li key={index}>
                    <button
                      onClick={() => toggleGroup(item.group)}
                      className={`w-full flex items-center justify-between p-2 rounded-md text-left ${
                        hasActiveChild
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon size={18} className="mr-2" />
                        <span>{item.title}</span>
                      </div>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {isExpanded && (
                      <ul className="pl-8 mt-1 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <li key={childIndex}>
                            <Link
                              to={child.path}
                              className={`block p-2 rounded-md ${
                                isActive(child.path)
                                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              }

              // Otherwise render a simple link
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-md ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon size={18} className="mr-2" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default AdminSidebar
