
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroBanner />
        <FeaturedProducts />
        <BrandShowcase />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

export default Home
