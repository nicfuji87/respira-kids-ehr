import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ==================== CUSTOMIZAÇÕES TEMA RESPIRA KIDS ====================
// - Variantes adaptadas para usar CSS variables do tema Respira KIDS
// - Touch targets mínimos de 44px para mobile-friendly
// - Classe theme-transition para transições suaves
// - Cores personalizadas baseadas na paleta Respira KIDS

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium theme-transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Tema Respira KIDS: Azul principal com texto roxo
        default:
          "bg-[hsl(var(--azul-respira))] text-[hsl(var(--roxo-titulo))] shadow hover:bg-[hsl(var(--azul-respira))]/90",
        
        // Tema Respira KIDS: Vermelho kids com contraste adequado
        destructive:
          "bg-[hsl(var(--vermelho-kids))] text-[hsl(var(--roxo-titulo))] shadow-sm hover:bg-[hsl(var(--vermelho-kids))]/90",
        
        // Tema Respira KIDS: Contorno com azul respira
        outline:
          "border border-[hsl(var(--azul-respira))] bg-background shadow-sm hover:bg-[hsl(var(--bege-fundo))] hover:text-[hsl(var(--roxo-titulo))]",
        
        // Tema Respira KIDS: Fundo bege com texto roxo
        secondary:
          "bg-[hsl(var(--bege-fundo))] text-[hsl(var(--roxo-titulo))] shadow-sm hover:bg-[hsl(var(--bege-fundo))]/80",
        
        // Tema Respira KIDS: Hover com bege suave
        ghost: 
          "hover:bg-[hsl(var(--bege-fundo))] hover:text-[hsl(var(--roxo-titulo))]",
        
        // Tema Respira KIDS: Link com azul respira
        link: 
          "text-[hsl(var(--azul-respira))] underline-offset-4 hover:underline",
      },
      size: {
        // Mobile-friendly: Mínimo 44px de altura para touch targets
        default: "h-11 px-4 py-2 min-h-[44px]",
        sm: "h-10 rounded-md px-3 text-xs min-h-[44px]",
        lg: "h-12 rounded-md px-8 min-h-[44px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
