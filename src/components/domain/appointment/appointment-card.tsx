import { Card, CardContent, Badge } from "@/components/primitives"
import { ActionMenu } from "@/components/composed"
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react"

export interface Appointment {
  id: string
  patientName: string
  doctorName: string
  date: string
  time: string
  duration: number
  type: 'consulta' | 'retorno' | 'exame' | 'procedimento'
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
  location?: string
  notes?: string
  patientPhone?: string
}

export interface AppointmentCardProps {
  appointment: Appointment
  onEdit?: (appointment: Appointment) => void
  onCancel?: (appointment: Appointment) => void
  onStart?: (appointment: Appointment) => void
  onComplete?: (appointment: Appointment) => void
  onConfirm?: (appointment: Appointment) => void
  className?: string
}

export const AppointmentCard = ({
  appointment,
  onEdit,
  onCancel,
  onStart,
  onComplete,
  onConfirm,
  className
}: AppointmentCardProps) => {
  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      agendado: 'bg-gray-100 text-gray-800',
      confirmado: 'bg-azul-respira text-white',
      em_andamento: 'bg-amarelo-pipa text-black',
      concluido: 'bg-verde-pipa text-white',
      cancelado: 'bg-vermelho-kids text-white'
    }
    return colors[status]
  }

  const getStatusLabel = (status: Appointment['status']) => {
    const labels = {
      agendado: 'Agendado',
      confirmado: 'Confirmado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado'
    }
    return labels[status]
  }

  const getTypeLabel = (type: Appointment['type']) => {
    const labels = {
      consulta: 'Consulta',
      retorno: 'Retorno',
      exame: 'Exame',
      procedimento: 'Procedimento'
    }
    return labels[type]
  }

  const getActions = () => {
    const actions = []

    if (appointment.status === 'agendado' && onConfirm) {
      actions.push({
        label: 'Confirmar',
        onClick: () => onConfirm(appointment),
        icon: <Calendar className="h-4 w-4" />
      })
    }

    if (appointment.status === 'confirmado' && onStart) {
      actions.push({
        label: 'Iniciar',
        onClick: () => onStart(appointment),
        icon: <Clock className="h-4 w-4" />
      })
    }

    if (appointment.status === 'em_andamento' && onComplete) {
      actions.push({
        label: 'Concluir',
        onClick: () => onComplete(appointment),
        icon: <Clock className="h-4 w-4" />
      })
    }

    if (onEdit && appointment.status !== 'concluido') {
      actions.push({
        label: 'Editar',
        onClick: () => onEdit(appointment),
        icon: <User className="h-4 w-4" />
      })
    }

    if (onCancel && appointment.status !== 'concluido' && appointment.status !== 'cancelado') {
      actions.push({
        label: 'Cancelar',
        onClick: () => onCancel(appointment),
        variant: 'destructive' as const,
        icon: <Calendar className="h-4 w-4" />
      })
    }

    return actions
  }

  return (
    <Card className={`${className} theme-transition`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-roxo-titulo">
                {appointment.patientName}
              </h3>
              <Badge className={getStatusColor(appointment.status)}>
                {getStatusLabel(appointment.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {getTypeLabel(appointment.type)} • Dr. {appointment.doctorName}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(appointment.date).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {appointment.time} ({appointment.duration}min)
              </div>
            </div>
          </div>
          
          {getActions().length > 0 && (
            <ActionMenu items={getActions()} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {appointment.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{appointment.location}</span>
            </div>
          )}
          {appointment.patientPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{appointment.patientPhone}</span>
            </div>
          )}
        </div>

        {appointment.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{appointment.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

AppointmentCard.displayName = "AppointmentCard" 