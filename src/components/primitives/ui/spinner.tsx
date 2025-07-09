import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-solid border-current border-r-transparent theme-transition",
  {
    variants: {
      variant: {
        default: "text-azul-respira",
        secondary: "text-roxo-titulo",
        success: "text-verde-pipa",
        warning: "text-amarelo-pipa",
        destructive: "text-vermelho-kids",
      },
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

export const Spinner = ({ className, variant, size, label, ...props }: SpinnerProps) => {
  return (
    <div
      className={cn(spinnerVariants({ variant, size, className }))}
      role="status"
      aria-label={label || "Loading"}
      {...props}
    >
      <span className="sr-only">{label || "Loading"}</span>
    </div>
  )
}

Spinner.displayName = "Spinner" 