import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import authSlice from "./slices/authSlice"
import cartSlice from "./slices/cartSlice"
import productSlice from "./slices/productSlice"
import { apiSlice } from "./apis/apiSlice"
import { saveCartToLocalStorage } from "~/utils/cartStorage"

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    product: productSlice,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

// Lưu localStorage khi cart.items thay đổi
let prevItems = []

store.subscribe(() => {
  const state = store.getState()
  const currentItems = state.cart.items

  if (JSON.stringify(prevItems) !== JSON.stringify(currentItems)) {
    saveCartToLocalStorage(currentItems)
    prevItems = currentItems
  }
})

setupListeners(store.dispatch)

export { store }
