import { useState } from "react"
import { Star, MessageSquare, User, X, Image as ImageIcon, MoreVertical, ThumbsUp, EllipsisVertical } from "lucide-react"
import { useGetProductReviewsQuery, useCreateReviewMutation, useDeleteReviewMutation, useToggleLikeMutation } from "~/store/apis/reviewSlice"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "~/store/slices/authSlice"
import { toast } from "react-toastify"
import { Button } from "~/components/ui/Button"
import Avatar from "~/components/common/Avatar"

const REVIEWS_PER_PAGE = 5

const ProductReviews = ({ productId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errors, setErrors] = useState({})
  const user = useSelector(selectCurrentUser)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [showMenuId, setShowMenuId] = useState(null)
  const [deleteReview] = useDeleteReviewMutation()
  const [toggleLike] = useToggleLikeMutation()
  const [currentPage, setCurrentPage] = useState(1)

  const { data: reviewsData, isLoading } = useGetProductReviewsQuery({ productId, page: currentPage, limit: REVIEWS_PER_PAGE })
  const [createReview] = useCreateReviewMutation()

  const reviews = reviewsData?.reviews || []
  const ratings = reviews.map(r => r.rating).filter(r => typeof r === "number")
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
  const totalReviews = reviewsData?.pagination?.totalItems || ratings.length
  const totalPages = reviewsData?.pagination?.totalPages || 1

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff"]
    const maxSize = 1 * 1024 * 1024

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`File ${file.name} không hợp lệ. Chỉ chấp nhận JPEG, PNG, GIF, WEBP, BMP, TIFF.`)
        return false
      }
      if (file.size > maxSize) {
        toast.error(`File ${file.name} vượt quá kích thước 1MB.`)
        return false
      }
      return true
    })

    setImages((prevImages) => [...prevImages, ...validFiles].slice(0, 5))
  }

  const validateForm = () => {
    const newErrors = {}
    if (rating === 0) newErrors.rating = "Vui lòng chọn số sao đánh giá"
    if (!content.trim()) newErrors.content = "Nội dung đánh giá không được để trống"
    else if (content.length < 10) newErrors.content = "Nội dung đánh giá phải có ít nhất 10 ký tự"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0]
      const errorElement = document.getElementById(firstErrorField)
      if (errorElement) errorElement.focus()
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào")
    }
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm")
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      const formData = new FormData()
      formData.append("productId", productId)
      formData.append("rating", rating)
      formData.append("content", content)
      images.forEach((image) => {
        formData.append("images", image)
      })

      await createReview(formData).unwrap()

      toast.success("Đánh giá thành công!")
      setShowReviewForm(false)
      setRating(0)
      setContent("")
      setImages([])
      setErrors({})
    } catch (error) {
      toast.error(error.data?.message || "Có lỗi xảy ra khi đánh giá")
    }
  }

  const handleLike = async (review) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thích bình luận!")
      return
    }
    try {
      await toggleLike(review._id).unwrap()
    } catch {
      toast.error("Có lỗi khi like bình luận!")
    }
  }

  // Delete handler
  const handleDelete = async () => {
    if (!reviewToDelete) return
    try {
      console.log("reviewToDelete", reviewToDelete)
      await deleteReview(reviewToDelete._id).unwrap()
      toast.success("Xóa bình luận thành công!")
      setShowDeleteModal(false)
      setReviewToDelete(null)
    } catch {
      toast.error("Xóa bình luận thất bại!")
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: document.getElementById("reviews").offsetTop - 100, behavior: "smooth" })
  }

  return (
    <div id="reviews" className="py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Rating Summary */}
        <div className="md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg h-fit shadow-sm border dark:border-gray-700">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">{avgRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{totalReviews} đánh giá</div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => setShowReviewForm(true)}
              className="w-full"
              disabled={!user}
            >
              {user ? "Viết đánh giá" : "Đăng nhập để đánh giá"}
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:w-2/3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="space-y-6">
                {reviews.map((review) => {
                  const isOwner = user && review.user.id === user._id
                  return (
                    <div key={review._id} className="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl shadow flex flex-col gap-2 border dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={review.user.avatar}
                            name={review.user.displayName}
                            size="md"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">{review.user.displayName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={i < (review.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}
                              />
                            ))}
                          </div>
                          <button
                            className={`flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${review.likes?.includes(user?._id) ? "text-primary" : "text-gray-600 dark:text-gray-300"}`}
                            onClick={() => handleLike(review)}
                          >
                            <ThumbsUp size={16} />
                            <span>{review.likesCount || review.likes?.length || 0}</span>
                          </button>
                          {isOwner && (
                            <div className="relative">
                              <button
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                onClick={() => setShowMenuId(showMenuId === review._id ? null : review._id)}
                              >
                                <EllipsisVertical size={18} />
                              </button>
                              {showMenuId === review._id && (
                                <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-700">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                    onClick={() => {
                                      setShowDeleteModal(true)
                                      setReviewToDelete(review)
                                      setShowMenuId(null)
                                    }}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pl-14">
                        <div className="text-gray-800 dark:text-gray-200 mb-2">{review.content}</div>
                        {review.images?.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {review.images.map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt={`Review image ${idx + 1}`}
                                className="w-32 h-20 object-cover rounded-lg border dark:border-gray-700"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </Button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <Button
                      key={idx}
                      variant={currentPage === idx + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Chưa có đánh giá nào</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Hãy là người đầu tiên đánh giá sản phẩm này</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowDeleteModal(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Xác nhận xóa bình luận</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
              <Button variant="danger" onClick={handleDelete}>Xóa</Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowReviewForm(false)}
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Viết đánh giá</h2>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-700 dark:text-gray-300">Đánh giá:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    id="rating"
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      size={24}
                      className={`${
                        i < (hoveredRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <span className="text-red-500 text-sm">{errors.rating}</span>
              )}
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nội dung đánh giá
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              />
              {errors.content && (
                <span className="text-red-500 text-sm">{errors.content}</span>
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hình ảnh (tùy chọn)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleSubmitReview}>
                Gửi đánh giá
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
