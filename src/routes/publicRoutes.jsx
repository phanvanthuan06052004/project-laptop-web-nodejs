import Index from "~/pages/Index"
import ProductListing from "~/pages/ProductListing"
import ProductDetail from "~/pages/ProductDetail"
import Cart from "~/pages/Cart"
import Checkout from "~/pages/Checkout"
import OrderConfirmation from "~/pages/OrderConfirmation"
import Login from "~/pages/Login"
import SignUp from "~/pages/SignUp"
import Account from "~/pages/Account"
import Blog from "~/pages/Blog"
import BlogPost from "~/pages/BlogPost"
import Categories from "~/pages/Categories"
import Deals from "~/pages/Deals"

const publicRoutes = [
  { path: "/", element: <Index /> },
  { path: "/products", element: <ProductListing /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/order-confirmation", element: <OrderConfirmation /> },
  { path: "/login", element: <Login />, restricted: true },
  { path: "/signup", element: <SignUp />, restricted: true },
  { path: "/account/*", element: <Account /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <BlogPost /> },
  { path: "/categories", element: <Categories /> },
  { path: "/deals", element: <Deals /> }
]

export default publicRoutes
