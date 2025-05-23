
import Account from "~/pages/account/Account"
import Login from "~/pages/auth/Login"
import Register from "~/pages/auth/Register"
import Cart from "~/pages/Cart"
import Checkout from "~/pages/CheckoutPage/Checkout"
import Home from "~/pages/Home"
import OrderConfirmation from "~/pages/OrderConfirmation"
import ProductDetail from "~/pages/ProductDetail"
import ProductListing from "~/pages/ProductListing"
import EmailVerification from "~/pages/EmailVerification"
import OrderList from "~/pages/Order/OrderList"
import BankTransferInfo from "~/components/payment/BankTransferInfo"
import PaymentFailed from "~/pages/PaymentFailed"
import ForgotPassword from "~/pages/ForgotPassword"

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <ProductListing /> },
  { path: "/product/slug/:nameSlug", element: <ProductDetail /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/order-confirmation", element: <OrderConfirmation /> },
  { path: "/login", element: <Login />, restricted: true },
  { path: "/register", element: <Register />, restricted: true },
  { path: "/account/*", element: <Account /> },
  { path: "/account/orders", element: <OrderList /> },
  { path: "/order-confirmation/:orderId", element: <OrderConfirmation /> },
  { path: "/payment/bank-transfer/:orderId", element: <BankTransferInfo /> },
  { path: "/payment-failed", element: <PaymentFailed /> },

  { path: "/forgot-password", element: <ForgotPassword /> },
  // { path: "/blog", element: <Blog /> },
  // { path: "/blog/:slug", element: <BlogPost /> },
  // { path: "/categories", element: <Categories /> },
  // { path: "/deals", element: <Deals /> }
  { path: "/authen-confirm", element: <EmailVerification /> }
]

export default publicRoutes
