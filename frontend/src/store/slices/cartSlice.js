import { createSlice } from "@reduxjs/toolkit"
import { loadCartFromLocalStorage } from "~/utils/cartStorage"

const initialState = {
  items: loadCartFromLocalStorage() // Load từ localStorage
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload
      const quantity = newItem.quantity || 1

      const existingItem = state.items.find(item => item.id === newItem.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ ...newItem, quantity })
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      if (quantity < 1) return
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.quantity = quantity
      }
    },
    clearCart: (state) => {
      state.items = []
    }
  }
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
export const selectItemCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)
