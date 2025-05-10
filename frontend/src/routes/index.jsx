import { Route, Routes } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { lazy } from "react"

import { selectCurrentUser } from "~/store/slices/authSlice"
import MainLayout from "~/layout/MainLayout"
// import ScrollToTop from "~/components/common/ScrollToTop"
import publicRoutes from "./publicRoutes"
import privateRoutes from "./privateRoutes"


// Lazy load public pages
const BankTransferInfo = lazy(() => import("~/components/payment/BankTransferInfo"))
const Home = lazy(() => import("~/pages/Home"))
const ProductListing = lazy(() => import("~/pages/ProductListing"))
const ProductDetail = lazy(() => import("~/pages/ProductDetail"))
const Cart = lazy(() => import("~/pages/Cart"))
const Checkout = lazy(() => import("~/pages/CheckoutPage/Checkout"))
const OrderConfirmation = lazy(() => import("~/pages/OrderConfirmation"))
const OrderList = lazy(() => import("~/pages/Order/OrderList"))
const Login = lazy(() => import("~/pages/auth/Login"))
const Register = lazy(() => import("~/pages/auth/Register"))
const Account = lazy(() => import("~/pages/account/Account"))
const ForgotPassword = lazy(() => import("~/pages/ForgotPassword"))

// const Blog = lazy(() => import("~/pages/Blog"))
// const BlogPost = lazy(() => import("~/pages/BlogPost"))
// const Categories = lazy(() => import("~/pages/Categories"))
// const Deals = lazy(() => import("~/pages/Deals"))
const NotFound = lazy(() => import("~/pages/NotFound"))
const EmailVerification = lazy(() => import("~/pages/EmailVerification"))
const PaymentCallback = lazy(() => import("~/pages/PaymentCallback"))
const PaymentFailed = lazy(() => import("~/pages/PaymentFailed"))

const routeComponents = {
  "/": <Home />,
  "/products": <ProductListing />,
  "/product/slug/:nameSlug": <ProductDetail />,
  "/cart": <Cart />,
  "/checkout": <Checkout />,
  "/order-confirmation": <OrderConfirmation />,
  "/login": <Login />,
  "/forgot-password": <ForgotPassword />,
  "/register": <Register />,
  "/authen-confirm": <EmailVerification />,
  "/account/*": <Account />,
  "/payment/callback": <PaymentCallback />,
  "/order-confirmation/:orderId": <OrderConfirmation />,
  "/payment-failed": <PaymentFailed />,
  // "/payment-success": <PaymentSuccess />,
  "/account/orders": <OrderList />,
  "/payment/bank-transfer/:orderId": <BankTransferInfo />
  // "/blog": <Blog />,
  // "/blog/:slug": <BlogPost />,
  // "/categories": <Categories />,
  // "/deals": <Deals />
}

const PublicRoutes = ({ children, restricted }) => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  if (isAuthenticated && restricted) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />
  }
  return children
}

const UserPrivateRoutes = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

const PrivateRoutes = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          {publicRoutes.map(({ path, restricted }) => (
            <Route
              key={path}
              path={path}
              element={
                path === "/account" ? (
                  <UserPrivateRoutes>{routeComponents[path] || <NotFound />}</UserPrivateRoutes>
                ) : (
                  <PublicRoutes restricted={restricted}>{routeComponents[path] || <NotFound />}</PublicRoutes>
                )
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Private Routes with AdminLayout */}
        {privateRoutes.map(({ path, element, children }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoutes>{element}</PrivateRoutes>}
          >
            {children &&
              children.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={child.element}
                />
              ))}
          </Route>
        ))}
        {/* <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/checkout/payment-failed" element={<PaymentFailed />} />
        <Route path="/account/orders" element={<OrderList />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default AppRoutes
