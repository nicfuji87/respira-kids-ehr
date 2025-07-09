import * as React from "react"
import { Badge } from "@/components/primitives/badge"

// StatusBadge - NÍVEL 2: Combinação de primitivos
// Componente para exibir status com cores apropriadas

export interface StatusBadgeProps {
  status: 'ativo' | 'inativo' | 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className
}) => {
  const getVariant = (status: string) => {
    switch (status) {
      case 'ativo':
      case 'active':
      case 'completed':
        return 'success'
      case 'inativo':
      case 'inactive':
        return 'secondary'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getLabel = (status: string) => {
    switch (status) {
      case 'ativo':
      case 'active':
        return 'Ativo'
      case 'inativo':
      case 'inactive':
        return 'Inativo'
      case 'pending':
        return 'Pendente'
      case 'completed':
        return 'Concluído'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <Badge variant={getVariant(status)} className={className}>
      {getLabel(status)}
    </Badge>
  )
} 