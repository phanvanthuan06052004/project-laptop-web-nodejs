/* eslint-disable no-console */
import { apiSlice } from "./apiSlice"
import { BASE_URL } from "~/constants/fe.constant"

export const commentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByParentId: builder.query({
      query: ({ productId, parentId }) => {
        const params = new URLSearchParams()
        params.append("productId", productId)
        if (parentId) {
          params.append("parentId", parentId)
        } else {
          params.append("parentId", "null")
        }
        return `${BASE_URL}/comment?${params.toString()}`
      },
      transformResponse: (response) => {
        console.log("Raw API response:", response)
        return {
          comments: Array.isArray(response) ? response.map(comment => ({
            ...comment,
            username: comment.user?.displayname || "Anonymous"
          })) : []
        }
      },
      providesTags: (result, error, arg) => {
        if (result?.comments) {
          return [
            ...result.comments.map((comment) => ({ type: "Comment", id: comment._id })),
            { type: "Comment", id: `PRODUCT-${arg.productId}` },
            ...(arg.parentId ? [{ type: "Comment", id: `PARENT-${arg.parentId}` }] : []),
            { type: "Comment", id: "LIST" }
          ]
        }
        return [
          { type: "Comment", id: `PRODUCT-${arg.productId}` },
          ...(arg.parentId ? [{ type: "Comment", id: `PARENT-${arg.parentId}` }] : []),
          { type: "Comment", id: "LIST" }
        ]
      }
    }),

    createComment: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/comment`,
        method: "POST",
        body: data
      }),
      invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: "Comment", id: `PRODUCT-${arg.productId}` },
          { type: "Comment", id: "LIST" }
        ]
        if (arg.parentId) {
          tags.push({ type: "Comment", id: `PARENT-${arg.parentId}` })
        }
        return tags
      }
    }),

    updateComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `${BASE_URL}/comment/${id}`,
        method: "PATCH",
        body: { content }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comment", id: arg.id }
      ]
    }),

    deleteComment: builder.mutation({
      query: ({ productId, commentId }) => ({
        url: `${BASE_URL}/comment?productId=${productId}&commentId=${commentId}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comment", id: arg.commentId },
        { type: "Comment", id: `PRODUCT-${arg.productId}` },
        { type: "Comment", id: "LIST" },
        ...(arg.parentId ? [{ type: "Comment", id: `PARENT-${arg.parentId}` }] : [])
      ]
    })
  })
})

export const {
  useGetCommentsByParentIdQuery,
  useLazyGetCommentsByParentIdQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation
} = commentSlice