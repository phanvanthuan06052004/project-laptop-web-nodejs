import { Link } from "react-router-dom"
import { Button } from "~/components/ui/Button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

const slides = [
  {
    id: 1,
    image: "https://lh3.googleusercontent.com/xXhdvJ0ghxHZI_JiZ4HKlBxFjeL9lXFC4UUp87W2Zqw7CDpNRct2iUnDAFa4FteHawV4hZ_ETgvpQLMML6Q8U5sGmB6LNw8EAw=w1920-rw",
    title: "Laptop Mới 2024",
    subtitle: "Ưu đãi lên đến 20% - Trả góp 0%",
    description: "Sở hữu laptop mỏng nhẹ, hiệu năng mạnh mẽ, giá cực tốt. Đổi trả miễn phí 7 ngày.",
    cta: "Xem Sản Phẩm"
  },
  {
    id: 2,
    image: "https://file.hstatic.net/200000722513/file/thang_04_pc_tang_man_banner_web_slider_800x400.jpg",
    title: "Back To School",
    subtitle: "Sinh viên mua laptop giảm thêm 1 triệu",
    description: "Tặng balo, chuột không dây, bảo hành chính hãng toàn quốc.",
    cta: "Mua Ngay"
  },
  {
    id: 3,
    image: "https://file.hstatic.net/200000722513/file/thang_04_laptop_gaming_banner_web_slider_800x400.jpg",
    title: "Gaming Laptop",
    subtitle: "Hiệu năng đỉnh cao - Giá sốc",
    description: "Laptop gaming RTX series, màn hình 144Hz, tản nhiệt tối ưu, quà tặng hấp dẫn.",
    cta: "Khám Phá Ngay"
  }
]


const HeroBanner = () => {

  return (
    <div className="relative w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
              {/* Background image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
              {/* Content */}
              {/* <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center h-full">
                <div className="max-w-xl text-white py-8 md:py-0">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">{slide.title}</h1>
                  <h2 className="text-lg md:text-2xl font-semibold text-primary-300 mb-4 drop-shadow">{slide.subtitle}</h2>
                  <p className="mb-6 text-sm md:text-base text-gray-100 drop-shadow">{slide.description}</p>
                  <Link to="/products">
                    <Button size={isMobile ? "default" : "lg"} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition">
                      {slide.cta}
                    </Button>
                  </Link>
                </div> 
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroBanner
