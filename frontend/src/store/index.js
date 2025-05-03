import { setupListeners } from "@reduxjs/toolkit/query"
import { configureStore } from "@reduxjs/toolkit"

import authSlice from "./slices/authSlice"
import cartSlice from "./slices/authSlice"
import { apiSlice } from "./apis/apiSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    [apiSlice.reducerPath]: apiSlice.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

setupListeners(store.dispatch)
