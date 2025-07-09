import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Respira KIDS themed Alert component
// Customizations: theme color variants for different alert types, better visual hierarchy
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm theme-transition [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        // Default/info variant using azul-respira
        default: 
          "bg-[hsl(var(--azul-respira))]/10 border-[hsl(var(--azul-respira))]/20 text-zinc-900 [&>svg]:text-[hsl(var(--azul-respira))]",
        // Success variant using verde-pipa
        success:
          "bg-[hsl(var(--verde-pipa))]/20 border-[hsl(var(--verde-pipa))]/30 text-zinc-900 [&>svg]:text-[hsl(var(--verde-pipa))]",
        // Warning variant using amarelo-pipa
        warning:
          "bg-[hsl(var(--amarelo-pipa))]/20 border-[hsl(var(--amarelo-pipa))]/30 text-zinc-900 [&>svg]:text-[hsl(var(--amarelo-pipa))]",
        // Destructive variant using vermelho-kids
        destructive:
          "bg-[hsl(var(--vermelho-kids))]/10 border-[hsl(var(--vermelho-kids))]/20 text-[hsl(var(--vermelho-kids))] [&>svg]:text-[hsl(var(--vermelho-kids))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      // Respira KIDS title styling
      "mb-1 font-medium leading-none tracking-tight text-[hsl(var(--roxo-titulo))]",
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Better readability with proper line height
      "text-sm text-zinc-700 [&_p]:leading-relaxed",
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
