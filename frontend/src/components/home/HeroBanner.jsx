import { Link } from "react-router-dom"

import { Button } from "~/components/ui/Button"
import { useIsMobile } from "~/hooks/useIsMobile"

const HeroBanner = () => {
  const isMobile = useIsMobile()
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-800 text-white min-h-screen">
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Nền"
          className="w-full h-full sm:h-auto object-cover object-center"
        />

      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl mx-auto lg:mx-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fadeIn">
            Khai Phá
            <span className="block text-primary-300">Hiệu Suất Làm Việc Tối Ưu</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-gray-100 max-w-2xl animate-slideUp">
            Khám phá bộ sưu tập laptop cao cấp của chúng tôi – hiệu năng mạnh mẽ, thiết kế tiện dụng, nâng tầm trải nghiệm số của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/products" className="w-full sm:w-auto">
              <Button size={isMobile ? "default" : "lg"} className="w-full">
                Mua Ngay
              </Button>
            </Link>
            <Link to="/deals" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size={isMobile ? "default" : "lg"}
                className="bg-white/10 hover:bg-white/20 text-white border-white w-full"
              >
                Ưu Đãi Đặc Biệt
              </Button>
            </Link>
          </div>
          <div className="mt-8 md:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold">30+</p>
              <p className="text-xs sm:text-sm text-gray-200">Thương hiệu hàng đầu</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">500+</p>
              <p className="text-xs sm:text-sm text-gray-200">Mẫu laptop</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">90%</p>
              <p className="text-xs sm:text-sm text-gray-200">Khách hàng hài lòng</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">24/7</p>
              <p className="text-xs sm:text-sm text-gray-200">Hỗ trợ kỹ thuật</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
