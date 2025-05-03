import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { getFeaturedProducts } from "~/data/product"
import ProductCard from "~/components/products/ProductCard"

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts()

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
