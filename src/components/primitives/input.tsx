import * as React from "react"

import { cn } from "@/lib/utils"

// Respira KIDS themed Input component
// Customizations: mobile-friendly min height (44px), theme colors, smooth transitions
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles with mobile-friendly sizing (min 44px height)
          "flex min-h-[44px] h-11 w-full rounded-md px-3 py-2 text-base",
          // Respira KIDS theme colors using CSS variables
          "border border-zinc-300 bg-white text-zinc-900",
          "hover:border-[hsl(var(--azul-respira))] focus:border-[hsl(var(--azul-respira))]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--azul-respira))]/20",
          "placeholder:text-zinc-500",
          // Theme transition for smooth interactions
          "theme-transition",
          // File input specific styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-900",
          // Disabled state with reduced opacity
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50",
          // Responsive text sizing
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
