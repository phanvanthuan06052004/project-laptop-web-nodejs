/* eslint-disable no-console */
const CART_KEY = "cart_items"

export const saveCartToLocalStorage = (cartItems) => {
  try {
    const serializedCart = JSON.stringify(cartItems)
    localStorage.setItem(CART_KEY, serializedCart)
  } catch (err) {
    console.error("Lỗi khi lưu giỏ hàng vào localStorage:", err)
  }
}

export const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem(CART_KEY)
    return serializedCart ? JSON.parse(serializedCart) : []
  } catch (err) {
    console.error("Lỗi khi đọc giỏ hàng từ localStorage:", err)
    return []
  }
}
