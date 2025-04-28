import AdminLayout from "~/layout/AdminLayout"
import AdminDashboard from "~/pages/Admin/AdminDashboard"
import ManageLaptops from "~/pages/Admin/ManageLaptops"
import ManageCustomers from "~/pages/Admin/ManageCustomers"
import ManageStaff from "~/pages/Admin/ManageStaff"
import ManageOrders from "~/pages/Admin/ManageOrders"
import ManageReviews from "~/pages/Admin/ManageReviews"
import SalesReports from "~/pages/Admin/SalesReports"
import CustomerSupport from "~/pages/Admin/CustomerSupport"

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
