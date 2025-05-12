import { useGetProductsQuery } from "~/store/apis/productApi"
import { ArrowRight } from "lucide-react"
import ProductCard from "~/components/products/ProductCard"
import { Link } from "react-router-dom"

const FeaturedProducts = () => {
  // Lấy 50 sản phẩm đầu tiên (hoặc nhiều hơn nếu muốn)
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 50 })
  const products = data?.products || []

  // Random 8 sản phẩm
  const getRandomProducts = (arr, n) => {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random())
    return shuffled.slice(0, n)
  }
  const featuredProducts = getRandomProducts(products, 8)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Sản phẩm nổi bật</h2>
          <Link
            to="/products"
            className="text-primary flex items-center hover:underline"
          >
            Xem tất cả <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts
