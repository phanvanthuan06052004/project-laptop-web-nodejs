// frontend/src/store/apis/couponSlice.js
import { apiSlice } from "./apiSlice"

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupon/apply",
        method: "POST",
        body: data
      })
    })
  })
})

export const { useApplyCouponMutation } = couponApiSlice