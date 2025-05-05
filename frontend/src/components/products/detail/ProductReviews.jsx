import { useState } from "react"
import { Star, MessageSquare, User } from "lucide-react"

// eslint-disable-next-line no-unused-vars
const ProductReviews = ({ productId, initialReviews = [] }) => {
  const [reviews] = useState(initialReviews)

  // Calculate average rating
  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : 0

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Rating Summary */}
        <div className="md:w-1/3 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{avgRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">{reviews.length} đánh giá</div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
              Viết đánh giá
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:w-2/3">
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <div className="bg-gray-100 rounded-full p-2 mr-3">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="font-medium">{review.user?.name || "Khách hàng"}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < (review.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có đánh giá nào</h3>
              <p className="text-gray-500 mb-6">Hãy là người đầu tiên đánh giá sản phẩm này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductReviews
