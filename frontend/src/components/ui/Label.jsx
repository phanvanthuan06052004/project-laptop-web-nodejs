const labelVariants = {
  variant: {
    default: "text-foreground",
    destructive: "text-destructive",
    muted: "text-muted-foreground"
  },
  size: {
    default: "text-sm",
    sm: "text-xs"
  }
}

const Label = ({
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  const Component = "label"

  const variantClasses =
      labelVariants.variant[variant] || labelVariants.variant.default
  const sizeClasses = labelVariants.size[size] || labelVariants.size.default

  return (
    <Component
      className={`${variantClasses} ${sizeClasses} block font-medium ${className}`}
      {...props}
    />
  )
}

Label.displayName = "Label"

export { Label }
