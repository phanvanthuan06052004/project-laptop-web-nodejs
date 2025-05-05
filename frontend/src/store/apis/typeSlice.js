import { BASE_URL } from "~/constants/fe.constant"
import { apiSlice } from "./apiSlice"

export const typeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTypes: builder.query({
      query: ({ page = 1, limit = 10, search = "", sort = "name", order = "asc" }) => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("limit", limit.toString())
        if (search) params.append("search", search)
        if (sort) params.append("sort", sort)
        if (order) params.append("order", order)
        return `${BASE_URL}/type?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [
            ...result.types.map(({ _id }) => ({ type: "Types", id: _id })),
            { type: "Types", id: "LIST" }
          ]
          : [{ type: "Types", id: "LIST" }]
    }),

    getTypeById: builder.query({
      query: (typeId) => `${BASE_URL}/type/${typeId}`,
      providesTags: (result, error, id) => [{ type: "Types", id }]
    }),

    createType: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/type`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Types", id: "LIST" }]
    }),

    updateType: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/type/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Types", id: arg.id },
        { type: "Types", id: "LIST" }
      ]
    }),

    deleteType: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/type/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Types", id: arg },
        { type: "Types", id: "LIST" }
      ]
    })
  })
})

export const {
  useGetTypesQuery,
  useLazyGetTypesQuery,
  useGetTypeByIdQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation
} = typeSlice
