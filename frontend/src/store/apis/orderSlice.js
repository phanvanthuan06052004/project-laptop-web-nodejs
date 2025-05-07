// frontend/src/store/apis/orderSlice.js
import { apiSlice } from "./apiSlice"

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData
      })
    }),
    
    checkOrderStatus: builder.query({
      query: (orderId) => `/orders/${orderId}/status`
    })
  })
})

export const {
  useCreateOrderMutation,
  useCheckOrderStatusQuery
} = orderApiSlice