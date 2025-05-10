import { apiSlice } from "./apiSlice"

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    cancelTransaction: builder.mutation({
      query: (paymentLinkId) => ({
        url: "/payments/cancel-transaction",
        method: "POST",
        body: { paymentLinkId }
      })
    })
  })
})

export const { useCancelTransactionMutation } = paymentApiSlice
