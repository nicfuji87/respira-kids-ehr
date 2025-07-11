import { cva } from "class-variance-authority"

// Respira KIDS themed Badge component variants
export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold theme-transition focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default variant using azul-respira
        default:
          "border-transparent bg-[hsl(var(--azul-respira))] text-white shadow hover:bg-[hsl(var(--azul-respira))]/80 focus:ring-[hsl(var(--azul-respira))]/20",
        // Secondary variant using bege-fundo
        secondary:
          "border-transparent bg-[hsl(var(--bege-fundo))] text-[hsl(var(--roxo-titulo))] hover:bg-zinc-200 focus:ring-zinc-300/20",
        // Destructive variant using vermelho-kids
        destructive:
          "border-transparent bg-[hsl(var(--vermelho-kids))] text-white shadow hover:bg-[hsl(var(--vermelho-kids))]/80 focus:ring-[hsl(var(--vermelho-kids))]/20",
        // Success variant using verde-pipa
        success:
          "border-transparent bg-[hsl(var(--verde-pipa))] text-zinc-900 shadow hover:bg-[hsl(var(--verde-pipa))]/80 focus:ring-[hsl(var(--verde-pipa))]/20",
        // Warning variant using amarelo-pipa
        warning:
          "border-transparent bg-[hsl(var(--amarelo-pipa))] text-zinc-900 shadow hover:bg-[hsl(var(--amarelo-pipa))]/80 focus:ring-[hsl(var(--amarelo-pipa))]/20",
        // Outline variant using roxo-titulo
        outline: 
          "border-[hsl(var(--roxo-titulo))] text-[hsl(var(--roxo-titulo))] hover:bg-[hsl(var(--roxo-titulo))]/10 focus:ring-[hsl(var(--roxo-titulo))]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
) 