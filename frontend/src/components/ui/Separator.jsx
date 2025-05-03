import { cn } from "~/lib/utils"

const Separator = ({ orientation = "horizontal", className = "", ...props }) => {
  const isHorizontal = orientation === "horizontal"

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        isHorizontal ? "h-px w-full" : "w-px h-full",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
