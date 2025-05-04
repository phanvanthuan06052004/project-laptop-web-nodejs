import { BASE_URL } from "~/constants/fe.constant"
import { apiSlice } from "./apiSlice"

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, limit = 10, search = "", sort = "name", order = "asc", brand = "", minPrice, maxPrice }) => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("limit", limit.toString())
        if (search) params.append("search", search)
        if (sort) params.append("sort", sort)
        if (order) params.append("order", order)
        if (brand) params.append("brand", brand)
        if (minPrice !== undefined) params.append("minPrice", minPrice.toString())
        if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString())
        return `${BASE_URL}/products?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [
            ...result.products.map(({ _id }) => ({ type: "Products", id: _id })),
            { type: "Products", id: "LIST" }
          ]
          : [{ type: "Products", id: "LIST" }]
    }),

    getProductById: builder.query({
      query: (productId) => `${BASE_URL}/products/${productId}`,
      providesTags: (result, error, id) => [{ type: "Products", id }]
    }),

    getProductBySlug: builder.query({
      query: (nameSlug) => `${BASE_URL}/products/slug/${nameSlug}`,
      providesTags: (result, error, nameSlug) => [{ type: "Products", id: `SLUG-${nameSlug}` }]
    }),

    searchProducts: builder.query({
      query: (searchTerm) => {
        const params = new URLSearchParams()
        params.append("search", searchTerm)
        params.append("limit", "20")
        return `${BASE_URL}/products?${params.toString()}`
      },
      providesTags: [{ type: "Products", id: "SEARCH" }]
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/products`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }]
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/products/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: arg.id },
        { type: "Products", id: "LIST" }
      ]
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/products/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Products", id: arg },
        { type: "Products", id: "LIST" }
      ]
    })
  })
})

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productSlice
