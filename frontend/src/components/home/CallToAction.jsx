import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary-700 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Cần Giúp Đỡ Tìm Laptop Phù Hợp?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn lựa chọn
              laptop phù hợp với nhu cầu và ngân sách. Hãy làm bài kiểm tra nhanh
              hoặc đặt lịch tư vấn.
            </p>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary-700 hover:bg-white/90 w-full sm:w-1/2"
              >
                Liên Hệ Chuyên Gia
              </Button>
            </Link>
          </div>
          <div className="hidden md:block">
            <img
              src="/images/customer-support.webp"
              alt="Hỗ trợ khách hàng"
              className="rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
