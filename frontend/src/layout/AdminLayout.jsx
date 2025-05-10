import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import AdminSidebar from "~/components/admin/AdminSideBar"
import Footer from "~/components/layout/Footer"
import Header from "~/components/layout/Header/Header"
import { selectCurrentUser } from "~/store/slices/authSlice"

const AdminLayout = () => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user

  // Redirect if not authenticated or not admin/staff
  // if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff")) {
  //   return <Navigate to="/login" />
  // }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex">
        <AdminSidebar />
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default AdminLayout
