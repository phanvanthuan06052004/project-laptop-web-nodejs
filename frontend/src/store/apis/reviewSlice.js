import { apiSlice } from "./apiSlice"

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: ({ productId, page = 1, limit = 10 }) => ({
        url: `/reviews?productId=${productId}&page=${page}&limit=${limit}`,
        method: "GET"
      }),
      providesTags: ["Review"]
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Review", "Product"]
    }),

    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Review", "Product"]
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Review", "Product"]
    }),

    toggleLike: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/like`,
        method: "POST"
      }),
      invalidatesTags: ["Review"]
    })
  })
})

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useToggleLikeMutation
} = reviewApi 