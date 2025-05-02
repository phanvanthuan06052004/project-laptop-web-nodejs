import authSlice from "./slices/authSlice"
import { setupListeners } from "@reduxjs/toolkit/query"
import { apiSlice } from "./apis/apiSlice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

setupListeners(store.dispatch)
