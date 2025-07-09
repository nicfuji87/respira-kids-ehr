import * as React from "react"
import { Card, CardHeader, CardContent } from "@/components/primitives/card"
import { Button } from "@/components/primitives/button"
import { cn } from "@/lib/utils"

// CalendarView - NÍVEL 3: Componente específico do negócio
// TODO: Implementar funcionalidade completa de calendário

export interface CalendarViewProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  appointments?: Array<{
    id: string
    date: string
    time: string
    patientName: string
  }>
  className?: string
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate = new Date(),
  onDateSelect,
  appointments = [],
  className
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Dias vazios do início do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentMonth(newMonth)
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigateMonth('prev')}>
            ←
          </Button>
          <h2 className="text-lg font-semibold capitalize">
            {formatMonthYear(currentMonth)}
          </h2>
          <Button variant="outline" onClick={() => navigateMonth('next')}>
            →
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              className={cn(
                "p-2 text-sm rounded hover:bg-gray-100 theme-transition",
                {
                  'invisible': day === null,
                  'bg-blue-100 text-blue-600': day && 
                    day === selectedDate.getDate() &&
                    currentMonth.getMonth() === selectedDate.getMonth(),
                  'bg-green-50': day && appointments.some(apt => 
                    new Date(apt.date).getDate() === day &&
                    new Date(apt.date).getMonth() === currentMonth.getMonth()
                  )
                }
              )}
              onClick={() => {
                if (day && onDateSelect) {
                  const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                  onDateSelect(newDate)
                }
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 