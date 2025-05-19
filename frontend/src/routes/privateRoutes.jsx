import AdminLayout from "~/layout/AdminLayout"
import AdminDashboard from "~/pages/admin/AdminDashboard"
import ManageLaptops from "~/pages/admin/ManageLaptops"
import ManageCustomers from "~/pages/admin/ManageCustomers"
import ManageStaff from "~/pages/admin/ManageStaff"
import ManageOrders from "~/pages/admin/ManageOrders"
import ManageReviews from "~/pages/admin/ManageReviews"
import SalesReports from "~/pages/admin/SalesReports"
import CustomerSupport from "~/pages/admin/CustomerSupport"
import CouponManagement from "~/pages/admin/ManageCoupon"
import CreateCoupon from "~/pages/admin/CreateCoupon"
import EditCoupon from "~/pages/admin/EditCoupon"
import ManagementCoupon from "~/pages/admin/ManagementCoupon"
import CouponEdit from "~/pages/admin/CouponEdit"
import ManagementLaptopDetail from "~/pages/admin/ManagementLaptopDetail"
import ManagementStaffDetail from "~/pages/admin/ManagementStaffDetail"
import ManagementLaptopCreate from "~/pages/admin/ManagementLaptopCreate"
import BrandManagement from "~/pages/admin/brand/ManageBrand"
import BrandCreate from "~/pages/admin/brand/BrandCreate"
import BrandEdit from "~/pages/admin/brand/BrandEdit"

const privateRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "products", element: <ManageLaptops /> },
      { path: "products/:id", element: <ManagementLaptopDetail /> },
      { path: "laptops/new", element: <ManagementLaptopCreate /> },
      { path: "customers", element: <ManageCustomers /> },
      { path: "staff", element: <ManageStaff /> },
      { path: "staff/:id", element: <ManagementStaffDetail /> },
      { path: "orders", element: <ManageOrders /> },
      { path: "reviews", element: <ManageReviews /> },
      { path: "reports", element: <SalesReports /> },
      { path: "support", element: <CustomerSupport /> },
      { path: "promotions", element: <CouponManagement /> },
      { path: "promotions/create", element: <CreateCoupon /> },
      { path: "promotions/edit/:id", element: <EditCoupon /> },
      { path: "coupons", element: <ManagementCoupon /> },
      { path: "coupons/:id", element: <CouponEdit /> },
      { path: "brand", element: <BrandManagement /> },
      { path: "brand/create", element: <BrandCreate /> },
      { path: "brand/edit/:id", element: <BrandEdit /> }
    ]
  }
]

export default privateRoutes
