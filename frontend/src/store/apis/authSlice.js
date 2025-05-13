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

    confirmCode: builder.mutation({
      query: ({ email, code }) => ({
        url: `${BASE_URL}/users/auth/confirm-code`,
        method: "POST",
        body: { email, code }
      })
    }),

    resetPassword: builder.mutation({
      query: ({ email, newPassword }) => ({
        url: `${BASE_URL}/users/auth/reset-password`,
        method: "POST",
        body: { email, newPassword }
      })
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useConfirmCodeMutation
} = authApiSlice
