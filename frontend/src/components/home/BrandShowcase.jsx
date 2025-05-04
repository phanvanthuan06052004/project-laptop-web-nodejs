import { useGetBrandsQuery } from "~/store/apis/brandSlice"

const BrandShowcase = () => {
  const { data, isLoading, error } = useGetBrandsQuery({
    limit: 8,
    page: 1,
    sort: "name",
    order: "asc"
  })

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Được các thương hiệu hàng đầu tin tưởng
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
            {[1, 2, 3, 4, 5, 6, 8].map((placeholder) => (
              <div
                key={placeholder}
                className="flex justify-center items-center p-4 h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded"
              ></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Được các thương hiệu hàng đầu tin tưởng
          </h2>
          <p className="text-center text-red-500">
            Tải danh sách thương hiệu thất bại. Vui lòng thử lại sau.
          </p>
        </div>
      </section>
    )
  }

  if (!data || !data.brands || data.brands.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Được các thương hiệu hàng đầu tin tưởng
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
          {data.brands.map((brand) => (
            <div
              key={brand._id}
              className="flex justify-center items-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandShowcase
