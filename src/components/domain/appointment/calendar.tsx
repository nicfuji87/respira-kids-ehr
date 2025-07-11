import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/primitives"
import { AppointmentCard } from "./appointment-card"
import type { Appointment } from "./appointment-card"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"

export interface CalendarProps {
  appointments: Appointment[]
  onDateSelect?: (date: Date) => void
  onAppointmentClick?: (appointment: Appointment) => void
  selectedDate?: Date
  className?: string
}

export const Calendar = ({
  appointments,
  onDateSelect,
  onAppointmentClick,
  selectedDate = new Date(),
  className
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(selectedDate)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getMonthData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstWeekday = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days = []
    
    // Dias do mês anterior
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({ date, isCurrentMonth: true })
    }
    
    // Dias do próximo mês
    const remainingDays = 42 - days.length // 6 semanas × 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({ date, isCurrentMonth: false })
    }

    return days
  }

  const getAppointmentsForDate = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return appointments.filter(appointment => 
      appointment.date === dateString
    )
  }, [appointments])

  const getDayAppointments = useMemo(() => {
    return getAppointmentsForDate(currentDate)
  }, [currentDate, getAppointmentsForDate])

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleDateClick = (date: Date) => {
    setCurrentDate(date)
    onDateSelect?.(date)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === currentDate.toDateString()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-roxo-titulo">
            Calendário de Consultas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('month')}
              className={view === 'month' ? 'bg-azul-respira text-white' : ''}
            >
              Mês
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('day')}
              className={view === 'day' ? 'bg-azul-respira text-white' : ''}
            >
              Dia
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {view === 'month' ? (
          <div className="space-y-4">
            {/* Cabeçalho dos dias da semana */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grade do calendário */}
            <div className="grid grid-cols-7 gap-2">
              {getMonthData().map(({ date, isCurrentMonth }, index) => {
                const dayAppointments = getAppointmentsForDate(date)
                
                return (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                      ${isSelected(date) ? 'ring-2 ring-azul-respira' : ''}
                      ${isToday(date) ? 'bg-azul-respira text-white' : ''}
                    `}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="text-xs p-1 bg-azul-respira text-white rounded truncate"
                          title={`${appointment.time} - ${appointment.patientName}`}
                        >
                          {appointment.time} {appointment.patientName}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                {currentDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              <div className="text-sm text-gray-500">
                {getDayAppointments.length} consulta(s)
              </div>
            </div>
            
            {getDayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Nenhuma consulta agendada para este dia</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getDayAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={onAppointmentClick}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

Calendar.displayName = "Calendar" 