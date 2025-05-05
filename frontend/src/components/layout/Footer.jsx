import { useState } from "react"
import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const Footer = () => {
  const [email, setEmail] = useState("")

  const socialLinks = [
    { icon: Facebook, url: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, url: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, url: "https://twitter.com", label: "Twitter" },
    { icon: Youtube, url: "https://youtube.com", label: "YouTube" }
  ]

  const quickLinks = [
    { path: "/", label: "Trang chủ" },
    { path: "/products", label: "Tất cả sản phẩm" },
    { path: "/deals", label: "Ưu đãi đặc biệt" },
    { path: "/blog", label: "Tin tức" },
    { path: "/about", label: "Về chúng tôi" },
    { path: "/contact", label: "Liên hệ" }
  ]

  const customerServiceLinks = [
    { path: "/faq", label: "Câu hỏi thường gặp" },
    { path: "/shipping", label: "Thông tin vận chuyển" },
    { path: "/returns", label: "Đổi trả & Hoàn tiền" },
    { path: "/warranty", label: "Thông tin bảo hành" },
    { path: "/support", label: "Hỗ trợ kỹ thuật" }
  ]

  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Giới thiệu */}
          <div>
            <h3 className="text-lg font-bold mb-3 md:mb-4">Về LapVibe</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Điểm đến hàng đầu cho laptop cao cấp và phụ kiện công nghệ. Chúng tôi cung cấp
              giá cả cạnh tranh, tư vấn chuyên nghiệp và dịch vụ tuyệt vời.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  aria-label={social.label}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-700 transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-bold mb-3 md:mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dịch vụ khách hàng */}
          <div>
            <h3 className="text-lg font-bold mb-3 md:mb-4">Dịch vụ khách hàng</h3>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Đăng ký nhận bản tin */}
          <div>
            <h3 className="text-lg font-bold mb-3 md:mb-4">Đăng ký nhận bản tin</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Đăng ký để nhận thông tin cập nhật, khuyến mãi độc quyền và nhiều ưu đãi khác.
            </p>
            <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Địa chỉ email của bạn"
                className="px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-700 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-700 transition-colors">
              Điều khoản dịch vụ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
