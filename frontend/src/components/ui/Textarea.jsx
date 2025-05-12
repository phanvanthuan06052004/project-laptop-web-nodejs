import React, { forwardRef } from "react"
import { Label } from "./label" // Assuming your Label component is in './label'
import { cn } from "~/lib/utils" // Assuming you have a utility function for class merging

const textareaVariants = {
  variant: {
    default:
      "border border-input bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  },
  size: {
    default: "h-24  py-2 px-3 w-[100%]",
    sm: "h-20 py-1.5 px-2 text-sm",
    lg: "h-36 py-3 px-4 text-base",
  },
  resize: {
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
    none: "resize-none",
  },
}

const Textarea = forwardRef(
  (
    {
      className,
      label,
      variant = "default",
      size = "default",
      resize = "vertical", // Default to vertical resizing
      error = false,
      ...props
    },
    ref
  ) => {
    const variantClasses =
      textareaVariants.variant[variant] || textareaVariants.variant.default
    const sizeClasses =
      textareaVariants.size[size] || textareaVariants.size.default
    const resizeClasses =
      textareaVariants.resize[resize] || textareaVariants.resize.vertical
    const errorClasses = error
      ? "border-destructive focus-visible:ring-destructive"
      : ""

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          className={cn(
            variantClasses,
            sizeClasses,
            resizeClasses,
            errorClasses,
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
