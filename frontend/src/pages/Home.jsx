import FeaturedProducts from "~/components/home/FeaturedProducts"
import BrandShowcase from "~/components/home/BrandShowcase"
import CallToAction from "~/components/home/CallToAction"
import HeroBanner from "~/components/home/HeroBanner"
import Footer from "~/components/layout/Footer"
import Header from "~/components/layout/Header/Header"

const Home = () => {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <BrandShowcase />
      <CallToAction />
    </>
  )
}

export default Home
