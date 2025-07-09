import * as React from "react"
import { Card, CardHeader, CardContent } from "@/components/primitives/card"
import { Badge } from "@/components/primitives/badge"
import { cn } from "@/lib/utils"

// FinancialCard - NÍVEL 3: Componente específico do negócio
// TODO: Implementar funcionalidade completa

export interface FinancialCardProps {
  transaction: {
    id: string
    amount: number
    type: 'income' | 'expense'
    description: string
    date: string
    status: 'pending' | 'completed' | 'cancelled'
  }
  className?: string
  onClick?: () => void
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  transaction,
  className,
  onClick
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <Card 
      className={cn("cursor-pointer hover:shadow-md theme-transition", className)}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{transaction.description}</h3>
          <Badge variant={getStatusVariant(transaction.status)}>
            {transaction.status === 'completed' ? 'Pago' : 
             transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className={cn(
            "text-xl font-bold",
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          )}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </p>
          <p className="text-sm text-gray-600">{transaction.date}</p>
        </div>
      </CardContent>
    </Card>
  )
} 