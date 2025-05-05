import { useState } from "react"
import ProductSpecifications from "./ProductSpecifications"
import ProductDescription from "./ProductDescription"
import ProductReviews from "./ProductReviews"

const ProductTabs = ({ description, specs, productId, reviews, attributeGroup }) => {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <div className="mt-12">
      <div className="border-b border-gray-200 mb-6">
        <div className="flex flex-wrap">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "description"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Mô tả
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "specifications"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thông số kỹ thuật
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "reviews" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đánh giá
          </button>
        </div>
      </div>

      <div className="py-4">
        {activeTab === "description" && <ProductDescription description={description} />}
        {activeTab === "specifications" && <ProductSpecifications specs={specs} attributeGroup={attributeGroup} />}
        {activeTab === "reviews" && <ProductReviews productId={productId} initialReviews={reviews} />}
      </div>
    </div>
  )
}

export default ProductTabs
