import { BASE_URL } from "~/constants/fe.constant"
import { apiSlice } from "./apiSlice"

export const cartSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserCart: builder.query({
      query: (userId) => `${BASE_URL}/cart/${userId}`,
      providesTags: (result) =>
        result
          ? [{ type: "Cart", id: "LIST" }]
          : []
    })
    ,

    addItem: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/cart/items`,
        method: "POST",
        body: data
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }]
    }),

    updateQuantity: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: `${BASE_URL}/cart/items/${cartItemId}`,
        method: "PUT",
        body: { quantity }
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }]
    }),

    deleteItem: builder.mutation({
      query: (cartItemId) => ({
        url: `${BASE_URL}/cart/items/${cartItemId}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }]
    }),

    deleteCart: builder.mutation({
      query: (userId) => ({
        url: `${BASE_URL}/cart/${userId}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }]
    })
  })
})

export const {
  useGetUserCartQuery,
  useAddItemMutation,
  useUpdateQuantityMutation,
  useDeleteItemMutation,
  useDeleteCartMutation
} = cartSlice