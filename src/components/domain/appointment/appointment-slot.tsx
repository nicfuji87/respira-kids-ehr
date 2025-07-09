import * as React from "react"
import { Card, CardContent } from "@/components/primitives/card"
import { Badge } from "@/components/primitives/badge"
import { cn } from "@/lib/utils"

// AppointmentSlot - NÍVEL 3: Componente específico do negócio
// TODO: Implementar funcionalidade completa

export interface AppointmentSlotProps {
  appointment: {
    id: string
    time: string
    patientName?: string
    status: 'available' | 'booked' | 'completed' | 'cancelled'
    duration?: number
  }
  className?: string
  onClick?: () => void
}

export const AppointmentSlot: React.FC<AppointmentSlotProps> = ({
  appointment,
  className,
  onClick
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available': return 'success'
      case 'booked': return 'default'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível'
      case 'booked': return 'Agendado'
      case 'completed': return 'Concluído'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md theme-transition",
        {
          'border-green-200': appointment.status === 'available',
          'border-blue-200': appointment.status === 'booked',
          'border-gray-200': appointment.status === 'completed',
          'border-red-200': appointment.status === 'cancelled'
        },
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{appointment.time}</p>
            {appointment.patientName && (
              <p className="text-sm text-gray-600">{appointment.patientName}</p>
            )}
            {appointment.duration && (
              <p className="text-xs text-gray-500">{appointment.duration} min</p>
            )}
          </div>
          <Badge variant={getStatusVariant(appointment.status)}>
            {getStatusLabel(appointment.status)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
} 