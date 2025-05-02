import { Check, ChevronRight, Circle } from "lucide-react"

const DropdownMenu = ({ children, className }) => (
  <div className={`z-50 ${className}`}>{children}</div>
)

const DropdownMenuTrigger = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`p-2 ${className}`}>
    {children}
  </button>
)

const DropdownMenuContent = ({ children, className, sideOffset = 4 }) => (
  <div
    className={`z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className}`}
    style={{ marginTop: `${sideOffset}px` }}
  >
    {children}
  </div>
)

const DropdownMenuItem = ({ children, className, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ${className}`}
  >
    {children}
  </button>
)

const DropdownMenuCheckboxItem = ({ children, checked, onChange, className }) => (
  <div
    className={`relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ${className}`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
    />
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Check className="h-4 w-4" />}
    </span>
    {children}
  </div>
)

const DropdownMenuRadioItem = ({ children, checked, onChange, className }) => (
  <div
    className={`relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ${className}`}
  >
    <input
      type="radio"
      checked={checked}
      onChange={onChange}
      className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
    />
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Circle className="h-2 w-2 fill-current" />}
    </span>
    {children}
  </div>
)

const DropdownMenuLabel = ({ children, className }) => (
  <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>
    {children}
  </div>
)

const DropdownMenuSeparator = ({ className }) => (
  <div className={`-mx-1 my-1 h-px bg-muted ${className}`} />
)

const DropdownMenuShortcut = ({ children, className }) => (
  <span className={`ml-auto text-xs tracking-widest opacity-60 ${className}`}>
    {children}
  </span>
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut
}
