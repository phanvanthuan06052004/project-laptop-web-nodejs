/* eslint-disable no-console */
export const THEME_KEY = "theme"

export const saveThemeToLocalStorage = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (err) {
    console.error("Lỗi lưu theme:", err)
  }
}

export const loadThemeFromLocalStorage = () => {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    return "light"
  } catch (err) {
    console.error("Lỗi đọc theme:", err)
    return "light"
  }
}

export const applyThemeToDocument = (theme) => {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.setAttribute("data-theme", theme)
}
