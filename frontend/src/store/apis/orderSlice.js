import { BASE_URL } from "~/constants/fe.constant"
import { apiSlice } from "./apiSlice"

export const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page = 1, limit = 10, sort = "createdAt", order = "desc", status = "", search = "" }) => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("limit", limit.toString())
        if (sort) params.append("sort", sort)
        if (order) params.append("order", order)
        if (status) params.append("status", status)
        if (search) params.append("search", search)

        return `${BASE_URL}/orders?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.orders.map(({ _id }) => ({ type: "Orders", id: _id })), { type: "Orders", id: "LIST" }]
          : [{ type: "Orders", id: "LIST" }],
    }),

    getOrderById: builder.query({
      query: (orderId) => `${BASE_URL}/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    getUserOrders: builder.query({
      query: (userId) => `${BASE_URL}/orders?userId=${userId}`,
      providesTags: [{ type: "Orders", id: "USER" }],
    }),

    createOrder: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/orders`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Orders", id: "LIST" },
        { type: "Orders", id: "USER" },
      ],
    }),

    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/orders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Orders", id: arg.id },
        { type: "Orders", id: "LIST" },
        { type: "Orders", id: "USER" },
      ],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Orders", id: arg },
        { type: "Orders", id: "LIST" },
        { type: "Orders", id: "USER" },
      ],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetUserOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderSlice
