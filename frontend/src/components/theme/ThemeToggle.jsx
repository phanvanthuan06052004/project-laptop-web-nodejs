import { Moon, Sun } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "~/store/slices/themeSlice"
import { Button } from "~/components/ui/button"

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.theme)

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => dispatch(toggleTheme())}
      className="w-10 h-10 !rounded-full border-primary/20"
    >
      {theme === "light" ? (
        <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all text-amber-500" />
      ) : (
        <Moon className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all text-blue-400" />
      )}
    </Button>
  )
}

export default ThemeToggle
