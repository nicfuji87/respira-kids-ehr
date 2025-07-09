import * as React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/primitives/card"
import { cn } from "@/lib/utils"

// FormLayout - NÍVEL 4: Layout completo para formulários
// TODO: Implementar funcionalidade completa

export interface FormLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  actions?: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  description,
  actions,
  className,
  maxWidth = 'md'
}) => {
  const getMaxWidthClass = (size: string) => {
    switch (size) {
      case 'sm': return 'max-w-sm'
      case 'md': return 'max-w-md'
      case 'lg': return 'max-w-lg'
      case 'xl': return 'max-w-xl'
      default: return 'max-w-md'
    }
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 flex items-center justify-center p-4",
      className
    )}>
      <div className={cn("w-full", getMaxWidthClass(maxWidth))}>
        <Card>
          {(title || description) && (
            <CardHeader className="text-center">
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              )}
              {description && (
                <p className="text-gray-600 mt-2">{description}</p>
              )}
            </CardHeader>
          )}
          
          <CardContent>
            {children}
          </CardContent>
          
          {actions && (
            <CardFooter>
              {actions}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
} 