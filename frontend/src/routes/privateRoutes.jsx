import AdminLayout from "~/layout/AdminLayout"
import AdminDashboard from "~/pages/admin/AdminDashboard"
import ManageLaptops from "~/pages/admin/ManageLaptops"
import ManageCustomers from "~/pages/admin/ManageCustomers"
import ManageStaff from "~/pages/admin/ManageStaff"
import ManageOrders from "~/pages/admin/ManageOrders"
import ManageReviews from "~/pages/admin/ManageReviews"
import SalesReports from "~/pages/admin/SalesReports"
import CustomerSupport from "~/pages/admin/CustomerSupport"

const privateRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "laptops", element: <ManageLaptops /> },
      { path: "customers", element: <ManageCustomers /> },
      { path: "staff", element: <ManageStaff /> },
      { path: "orders", element: <ManageOrders /> },
      { path: "reviews", element: <ManageReviews /> },
      { path: "reports", element: <SalesReports /> },
      { path: "support", element: <CustomerSupport /> }
    ]
  }
]

export default privateRoutes
