import { BASE_URL } from "~/constants/fe.constant"
import { apiSlice } from "./apiSlice"

export const brandSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: ({ page = 1, limit = 10, search = "", sort = "name", order = "asc" }) => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("limit", limit.toString())
        if (search) params.append("search", search)
        if (sort) params.append("sort", sort)
        if (order) params.append("order", order)
        return `${BASE_URL}/brand?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.brands.map(({ _id }) => ({ type: "Brands", id: _id })), { type: "Brands", id: "LIST" }]
          : [{ type: "Brands", id: "LIST" }]
    }),

    getBrandById: builder.query({
      query: (brandId) => `${BASE_URL}/brand/${brandId}`,
      providesTags: (result, error, id) => [{ type: "Brands", id }]
    }),

    createBrand: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/brand`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Brands", id: "LIST" }]
    }),

    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/brand/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Brands", id: arg.id },
        { type: "Brands", id: "LIST" }
      ]
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/brand/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Brands", id: arg },
        { type: "Brands", id: "LIST" }
      ]
    })
  })
})

export const {
  useGetBrandsQuery,
  useLazyGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation
} = brandSlice
