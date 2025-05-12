import React, { forwardRef } from "react"
import { cn } from "~/lib/utils" // Assuming you have this utility

const Checkbox = forwardRef(({ className, onCheckedChange, indeterminate, ...props }, ref) => (
  <div className="relative flex items-center">
    <input
      type="checkbox"
      className={cn(
        "peer h-4 w-4 shrink-0 rounded border border-primary ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary",
        className
      )}
      ref={ref}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
    <svg
      className={cn(
        "absolute left-0.5 top-0.5 h-3 w-3 text-primary opacity-0 peer-data-[state=checked]:opacity-100",
        indeterminate && "opacity-100"
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {indeterminate ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      )}
    </svg>
  </div>
))

Checkbox.displayName = "Checkbox"

export { Checkbox }