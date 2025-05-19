import { apiSlice } from "./apiSlice"

export const brandSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all brands with pagination, filtering, and sorting
    getBrands: builder.query({
      query: ({ page = 1, limit = 10, sort = "createdAt", order = "asc", search = "" }) => ({
        url: "/brand",
        params: {
          page,
          limit,
          sort,
          order,
          ...(search && { search })
        }
      }),
      transformResponse: (response) => ({
        brands: response.brands || [], // Map 'brands' từ backend
        pagination: response.pagination || {
          totalItems: 0,
          currentPage: 1,
          totalPages: 0,
          itemsPerPage: 10
        }
      }),
      providesTags: (result) =>
        result && result.brands
          ? [
            ...result.brands.map(({ _id }) => ({ type: "Brands", id: _id })),
            { type: "Brands", id: "LIST" }
          ]
          : [{ type: "Brands", id: "LIST" }]
    }),

    // Get a brand by ID
    getBrandById: builder.query({
      query: (id) => `/brand/${id}`,
      providesTags: (result, error, id) => [{ type: "Brands", id }]
    }),

    // Create a new brand
    createBrand: builder.mutation({
      query: (data) => ({
        url: "/brand",
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Brands", id: "LIST" }]
    }),

    // Update a brand by ID
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brand/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Brands", id }, { type: "Brands", id: "LIST" }]
    }),

    // Delete a brand by ID
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, id) => [{ type: "Brands", id }, { type: "Brands", id: "LIST" }]
    })
  })
})

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useLazyGetBrandsQuery
} = brandSlice
