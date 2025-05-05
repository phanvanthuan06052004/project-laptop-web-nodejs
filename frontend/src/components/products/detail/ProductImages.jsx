import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"

const ProductImages = ({ images, name }) => {
  const [activeImage, setActiveImage] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const imageArray = Array.isArray(images) && images.length > 0 ? images : ["/images/laptop-placeholder.webp"]

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % imageArray.length)
  }

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + imageArray.length) % imageArray.length)
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
          src={imageArray[activeImage] || "/images/laptop-placeholder.webp"}
          alt={name}
          className="w-full h-full object-contain cursor-zoom-in"
          onClick={() => setShowLightbox(true)}
          loading="lazy"
        />

        {imageArray.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white dark:text-black dark:hover:bg-slate-200"
              onClick={prevImage}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white dark:text-black dark:hover:bg-slate-200"
              onClick={nextImage}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <button
          className="absolute right-2 bottom-2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white dark:text-black dark:hover:bg-slate-200"
          onClick={() => setShowLightbox(true)}
        >
          <ZoomIn size={20} />
        </button>
      </div>

      {/* Thumbnails */}
      {imageArray.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {imageArray.map((img, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden ${
                activeImage === index ? "border-primary" : "border-gray-200"
              }`}
              onClick={() => setActiveImage(index)}
            >
              <img
                src={img || "/images/laptop-placeholder.webp"}
                alt={`${name} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

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
              src={imageArray[activeImage] || "/images/laptop-placeholder.webp"}
              alt={name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/40"
              onClick={() => setShowLightbox(false)}
            >
              <X size={24} className="text-white" />
            </button>

            {imageArray.length > 1 && (
              <>
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
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {activeImage + 1} / {imageArray.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductImages
