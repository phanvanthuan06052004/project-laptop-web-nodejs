import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { Provider } from "react-redux"
import { store } from "./store"
import "react-toastify/dist/ReactToastify.css"
import { loadThemeFromLocalStorage, applyThemeToDocument } from "~/utils/themeStorage"

applyThemeToDocument(loadThemeFromLocalStorage())

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
