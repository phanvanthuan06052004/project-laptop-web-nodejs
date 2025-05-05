import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

export default function ProductImageGallery({ mainImg, images, productName }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  // Ensure we have an array of images
  const allImages = images && images.length > 0 ? images : [mainImg]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowLightbox(false)
    } else if (e.key === "ArrowRight") {
      nextImage()
    } else if (e.key === "ArrowLeft") {
      prevImage()
    }
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4 border border-gray-200">
        <img
          src={allImages[currentImage] || "/placeholder.svg"}
          alt={productName}
          className="w-full h-full object-contain cursor-zoom-in"
          onClick={() => setShowLightbox(true)}
        />
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
          onClick={prevImage}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
          onClick={nextImage}
        >
          <ChevronRight size={20} />
        </button>
        <button
          className="absolute right-2 bottom-2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
          onClick={() => setShowLightbox(true)}
        >
          <ZoomIn size={20} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {allImages.map((img, index) => (
          <button
            key={index}
            className={`flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden ${
              currentImage === index ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <img
              src={img || "/placeholder.svg"}
              alt={`${productName} - ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <img
              src={allImages[currentImage] || "/placeholder.svg"}
              alt={productName}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full hover:bg-white/40"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full hover:bg-white/40"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
