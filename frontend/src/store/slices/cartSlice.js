import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: []
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
      const id = action.payload
      state.items = state.items.filter(item => item.id !== id)
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
// export const selectCartTotal = (state) =>
//   state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
// export const selectItemCount = (state) =>
//   state.cart.items.reduce((count, item) => count + item.quantity, 0)
export const selectItemCount = (state) => state + 1
export const selectCartTotal = (state) => state + 1
