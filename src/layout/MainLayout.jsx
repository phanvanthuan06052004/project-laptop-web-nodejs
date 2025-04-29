import { Outlet } from "react-router-dom"
import Footer from "~/components/layout/Footer"
import Header from "~/components/layout/Header"
import MetaTags from "~/components/seo/MetaTags"


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MetaTags
        // key={location.pathname}
        title="LapVibe - Điểm đến laptop tuyệt vời của bạn"
        description="Khám phá các laptop mới nhất, tìm thiết bị phù hợp với bạn. Từ những chiếc máy tính xách tay giá rẻ đến các máy tính hiệu suất cao, chúng tôi có đầy đủ cho bạn."
      />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
