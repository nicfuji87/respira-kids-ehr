import * as React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/primitives/card"
import { cn } from "@/lib/utils"

// ActionCard - NÍVEL 2: Combinação de primitivos
// Segue template obrigatório para componentes compostos

export interface ActionCardProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  children,
  actions,
  className
}) => {
  return (
    <Card className={cn("theme-transition", className)}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-[hsl(var(--roxo-titulo))]">{title}</h3>
        {subtitle && (
          <p className="text-sm text-zinc-600">{subtitle}</p>
        )}
      </CardHeader>
      
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
      
      {actions && (
        <CardFooter className="flex gap-2">
          {actions}
        </CardFooter>
      )}
    </Card>
  )
} 