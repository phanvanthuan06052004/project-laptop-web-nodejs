/* eslint-disable no-unused-vars */
import { apiSlice } from "./apiSlice"

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all coupons with pagination, filtering, and sorting
    getCoupons: builder.query({
      query: ({ page = 1, limit = 10, sort = "createdAt", order = "desc", search = "" }) => ({
        url: "/coupon",
        params: {
          page,
          limit,
          sort,
          order,
          ...(search && { search }) // Sử dụng 'search' thay vì 'code' để khớp với backend
        }
      }),
      providesTags: [{ type: "Coupons", id: "LIST" }]
    }),

    getAllAdmin: builder.query({
      query: ({ page = 1, limit = 10, sort = "createdAt", order = "desc", search = "" }) => ({
        url: "/coupon/admin",
        params: {
          page,
          limit,
          sort,
          order,
          ...(search && { search })
        }
      }),
      transformResponse: (response) => ({
        coupons: response.coupons || [],
        pagination: response.pagination || {
          totalItems: 0,
          currentPage: 1,
          totalPages: 0,
          itemsPerPage: 10
        }
      }),
      providesTags: (result) =>
        result && result.coupons
          ? [
            ...result.coupons.map(({ _id }) => ({ type: "Coupons", id: _id })),
            { type: "Coupons", id: "LIST" }
          ]
          : [{ type: "Coupons", id: "LIST" }]
    }),

    // Get a coupon by ID
    getCouponById: builder.query({
      query: (id) => `/coupon/${id}`,
      providesTags: (result, error, id) => [{ type: "Coupons", id }]
    }),

    // Get a coupon by code
    getCouponByCode: builder.query({
      query: (code) => `/coupon/code/${code}`,
      providesTags: (result, error, code) => [{ type: "Coupons", id: result?._id }]
    }),

    // Create a new coupon
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon",
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Coupons", id: "LIST" }]
    }),

    // Update a coupon by ID
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/coupon/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Coupons", id }, { type: "Coupons", id: "LIST" }]
    }),

    // Delete a coupon by ID
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupon/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, id) => [{ type: "Coupons", id }, { type: "Coupons", id: "LIST" }]
    }),

    // Apply a coupon
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/apply",
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Coupons", id: "LIST" }]
    }),

    // Cancel a coupon
    cancelCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/cancel",
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Coupons", id: "LIST" }]
    })
  })
})

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useGetCouponByCodeQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
  useCancelCouponMutation,
  useGetAllAdminQuery,
  useLazyGetAllAdminQuery
} = couponApiSlice