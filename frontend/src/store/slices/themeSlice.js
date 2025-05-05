import { createSlice } from "@reduxjs/toolkit"

import {
  loadThemeFromLocalStorage,
  saveThemeToLocalStorage,
  applyThemeToDocument
} from "~/utils/themeStorage"

const initialState = {
  theme: loadThemeFromLocalStorage()
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
      saveThemeToLocalStorage(state.theme)
      applyThemeToDocument(state.theme)
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      saveThemeToLocalStorage(state.theme)
      applyThemeToDocument(state.theme)
    }
  }
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
