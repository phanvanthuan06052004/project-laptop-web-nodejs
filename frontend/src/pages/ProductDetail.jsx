import { useParams, Link } from "react-router-dom"
import { ChevronRight, CircleCheck, Loader2 } from "lucide-react"

import { useGetProductBySlugQuery } from "~/store/apis/productSlice"
import ProductImages from "~/components/products/detail/ProductImages"
import ProductHeader from "~/components/products/detail/ProductHeader"
import ProductPrice from "~/components/products/detail/ProductPrice"
import ProductActions from "~/components/products/detail/ProductActions"
import ProductFeatures from "~/components/products/detail/ProductFeatures"
import ProductTabs from "~/components/products/detail/ProductTabs"
import MetaTags from "~/components/seo/MetaTags"
import DiscussionSection from "~/components/products/detail/DiscussionSection"

export default function ProductDetail() {
  const { nameSlug } = useParams()
  const { data: product, isLoading, error } = useGetProductBySlugQuery(nameSlug)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h1>
        <p className="text-gray-600 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
          Quay lại trang chủ
        </Link>
      </div>
    )
  }

  const attrMap = Object.fromEntries(
    (product.attributeGroup || []).map(attr => [attr.name, attr.values])
  )

  const brandName = attrMap["Thương hiệu"] || ""
  const warranty = attrMap["Bảo hành"] || "12 tháng"

  const specs = {
    cpu: attrMap["CPU"] || "",
    ram: attrMap["Ram"] || "",
    storage: attrMap["Lưu trữ"] || "",
    display: attrMap["Màn hình"] || "",
    gpu: attrMap["Chip đồ họa"] || "",
    os: attrMap["Hệ điều hành"] || "",
    battery: attrMap["Pin"] || "",
    wireless: attrMap["Kết nối không dây"] || "",
    ports: attrMap["Cổng kết nối"] || "",
    weight: attrMap["Khối lượng"] || "",
    dimensions: attrMap["Kích thước"] || "",
    material: attrMap["Chất liệu"] || "",
    security: attrMap["Bảo mật"] || "",
    keyboard: attrMap["Bàn phím"] || "",
    audio: attrMap["Âm thanh"] || "",
    webcam: attrMap["Webcam"] || "",
    npu: attrMap["NPU"] || ""
  }

  const productData = {
    id: product._id,
    name: product.displayName,
    price: product.price,
    image: product.mainImg,
    brand: brandName
  }

  return (
    <div className="min-h-screen">
      <MetaTags
        title={product.displayName || product.name}
        description={product.description?.replace(/<[^>]*>/g, "").slice(0, 160) || ""}
        image={product.mainImg}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-100 dark:bg-gray-800 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-primary">
              Laptop
            </Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-primary">
              {brandName}
            </Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px] sm:max-w-xs">
              {product.displayName || product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Product Images */}
          <ProductImages images={product.images || [product.mainImg]} name={product.displayName} />

          {/* Right Column - Product Info */}
          <div>
            <ProductHeader
              name={product.displayName || product.name}
              brand={brandName}
              rating={product.avgRating || 0}
              reviewCount={product.numberRating || 0}
              partNumber={attrMap["Part-number"] || ""}
            />

            {/* AI PC Badge */}
            {specs.npu && (
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <CircleCheck size={16} className="mr-1" fill="currentColor" color="white" />
                Intel AI PC
              </div>
            )}

            {/* Quick Specs */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-3">Thông số chính</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-24 font-medium">CPU:</span>
                  <span className="flex-1">{specs.cpu}</span>
                </li>
                {specs.npu && (
                  <li className="flex items-start">
                    <span className="w-24 font-medium">NPU:</span>
                    <span className="flex-1">{specs.npu}</span>
                  </li>
                )}
                <li className="flex items-start">
                  <span className="w-24 font-medium">RAM:</span>
                  <span className="flex-1">{specs.ram}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-24 font-medium">Ổ cứng:</span>
                  <span className="flex-1">{specs.storage}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-24 font-medium">Màn hình:</span>
                  <span className="flex-1">{specs.display}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-24 font-medium">Card đồ họa:</span>
                  <span className="flex-1">{specs.gpu}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-24 font-medium">Trọng lượng:</span>
                  <span className="flex-1">{specs.weight}</span>
                </li>
              </ul>
            </div>

            <ProductPrice
              price={product.price}
              oldPrice={product.discount > 0 ? product.purchasePrice : undefined}
              inStock={product.quantity > 0}
            />

            <ProductActions
              inStock={product.quantity > 0}
              product={productData}
              quantity={product.quantity}
            />

            <ProductFeatures warranty={warranty} />
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs
          description={product.description}
          specs={specs}
          productId={product._id}
          reviews={product.comments || []}
          attributeGroup={product.attributeGroup || []}
        />

        <hr className="mt-5" />
        <DiscussionSection productId={productData?.id} />
      </div>
    </div>
  )
}