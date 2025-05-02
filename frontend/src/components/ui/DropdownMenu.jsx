import React, { useState, useEffect, useRef, useContext, createContext } from "react"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "~/lib/utils"

// Create a context to manage dropdown state
const DropdownContext = createContext({
  isOpen: false,
  setIsOpen: () => {}
})

// Main Dropdown Component
export const DropdownMenu = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen)
    }
  }, [isOpen, onOpenChange])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left" ref={menuRef}>
        {React.Children.map(children, child => {
          if (!child) return null

          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child, {
              onClick: () => setIsOpen(!isOpen),
              "aria-expanded": isOpen
            })
          }

          if (child.type === DropdownMenuContent) {
            return isOpen ? React.cloneElement(child) : null
          }

          return child
        })}
      </div>
    </DropdownContext.Provider>
  )
}

// Trigger Component
export const DropdownMenuTrigger = ({ children, className, ...props }) => {
  return (
    <button
      type="button"
      className={cn("inline-flex justify-center items-center", className)}
      {...props}
    >
      {children}
    </button>
  )
}

// Content Component (main dropdown content)
export const DropdownMenuContent = ({ children, className, align = "end", sideOffset = 4, ...props }) => {
  const contentRef = useRef(null)

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-lg",
        alignmentClasses[align],
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
      {...props}
    >
      {children}
    </div>
  )
}

// Menu Item
export const DropdownMenuItem = ({ children, className, inset, onClick, ...props }) => {
  const { setIsOpen } = useContext(DropdownContext)
  const handleClick = (e) => {
    // Close the dropdown
    setIsOpen(false)

    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
        inset && "pl-8",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Checkbox Item
export const DropdownMenuCheckboxItem = ({ children, className, checked, onCheckedChange, ...props }) => {
  const handleClick = () => {
    if (onCheckedChange) {
      onCheckedChange(!checked)
    }
  }

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  )
}

// Radio Item
export const DropdownMenuRadioItem = ({ children, className, checked, onCheckedChange, value, ...props }) => {
  const handleClick = () => {
    if (onCheckedChange) {
      onCheckedChange(value)
    }
  }

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </button>
  )
}

// Radio Group
export const DropdownMenuRadioGroup = ({ children, value, onValueChange }) => {
  return (
    <div>
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuRadioItem) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onCheckedChange: () => onValueChange && onValueChange(child.props.value)
          })
        }
        return child
      })}
    </div>
  )
}

// Label
export const DropdownMenuLabel = ({ children, className, inset, ...props }) => {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Separator
export const DropdownMenuSeparator = ({ className, ...props }) => {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  )
}

// Shortcut
export const DropdownMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}

// Group
export const DropdownMenuGroup = ({ children, className, ...props }) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

// Create a sub context for nested dropdowns
const DropdownSubContext = createContext({
  isOpen: false,
  setIsOpen: () => {}
})

// Sub components (for nested menus)
export const DropdownMenuSub = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false)
  const subMenuRef = useRef(null)

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen)
    }
  }, [isOpen, onOpenChange])

  // Handle clicks inside submenu specifically
  useEffect(() => {
    function handleClickOutside(event) {
      if (subMenuRef.current && !subMenuRef.current.contains(event.target)) {
        // Only close if clicking outside this submenu but not on its trigger
        const trigger = subMenuRef.current.querySelector("[aria-expanded=\"true\"]")
        if (!trigger || !trigger.contains(event.target)) {
          setIsOpen(false)
        }
      }
    }

    if (isOpen) {
      // Use capture to ensure this fires before parent handlers
      document.addEventListener("mousedown", handleClickOutside, true)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [isOpen])

  return (
    <DropdownSubContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative" ref={subMenuRef}>
        {React.Children.map(children, child => {
          if (!child) return null

          if (child.type === DropdownMenuSubTrigger) {
            return React.cloneElement(child, {
              onClick: (e) => {
                e.stopPropagation() // Prevent parent dropdown from closing
                setIsOpen(!isOpen)
              },
              "aria-expanded": isOpen
            })
          }

          if (child.type === DropdownMenuSubContent) {
            return isOpen ? React.cloneElement(child) : null
          }

          return child
        })}
      </div>
    </DropdownSubContext.Provider>
  )
}

// Sub Trigger
export const DropdownMenuSubTrigger = ({ children, className, inset, ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </button>
  )
}

// Sub Content
export const DropdownMenuSubContent = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-lg ml-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Portal - simplified version
export const DropdownMenuPortal = ({ children }) => {
  return <>{children}</>
}

export {
}
