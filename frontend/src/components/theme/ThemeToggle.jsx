import { Moon, Sun } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "~/store/slices/themeSlice"
import { Button } from "~/components/ui/button"
import { useTransition } from "react"

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.theme)
  // eslint-disable-next-line no-unused-vars
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        startTransition(() => {
          dispatch(toggleTheme())
        })
      }}
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
