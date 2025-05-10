import { apiSlice } from "./apiSlice"
import { BASE_URL } from "~/constants/fe.constant"

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/auth/`,
        method: "POST",
        body: data
      })
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/auth/register`,
        method: "POST",
        body: data
      })
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: `${BASE_URL}/users/auth/forgot-password`,
        method: "POST",
        body: { email }
      })
    }),

    resetPassword: builder.mutation({
      query: ({ email, code, newPassword }) => ({
        url: `${BASE_URL}/users/auth/reset-password`,
        method: "POST",
        body: { email, code, newPassword }
      })
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApiSlice
