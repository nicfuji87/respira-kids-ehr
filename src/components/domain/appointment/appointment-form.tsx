import { useState } from "react"
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives"
import { FormField } from "@/components/composed"
import type { Appointment } from "./appointment-card"


export interface AppointmentFormData {
  patientId: string
  doctorId: string
  date: string
  time: string
  duration: number
  type: 'consulta' | 'retorno' | 'exame' | 'procedimento'
  location?: string
  notes?: string
}

export interface AppointmentFormProps {
  appointment?: Appointment
  patients: Array<{ id: string; name: string; phone?: string }>
  doctors: Array<{ id: string; name: string; specialty: string }>
  locations?: string[]
  onSubmit: (data: AppointmentFormData) => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export const AppointmentForm = ({
  appointment,
  patients,
  doctors,
  locations = [],
  onSubmit,
  onCancel,
  isLoading = false,
  className
}: AppointmentFormProps) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    duration: 30,
    type: 'consulta',
    location: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const typeLabels = {
    consulta: 'Consulta',
    retorno: 'Retorno',
    exame: 'Exame',
    procedimento: 'Procedimento'
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Paciente é obrigatório'
    if (!formData.doctorId) newErrors.doctorId = 'Médico é obrigatório'
    if (!formData.date) newErrors.date = 'Data é obrigatória'
    if (!formData.time) newErrors.time = 'Horário é obrigatório'
    if (!formData.duration || formData.duration < 15) {
      newErrors.duration = 'Duração deve ser pelo menos 15 minutos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    onSubmit(formData)
  }

  const handleChange = (field: keyof AppointmentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-roxo-titulo">
          {appointment ? 'Editar Consulta' : 'Agendar Nova Consulta'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Paciente"
              error={errors.patientId}
              required
              htmlFor="patientId"
            >
              <Select
                value={formData.patientId}
                onValueChange={(value) => handleChange('patientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Médico"
              error={errors.doctorId}
              required
              htmlFor="doctorId"
            >
              <Select
                value={formData.doctorId}
                onValueChange={(value) => handleChange('doctorId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Data"
              error={errors.date}
              required
              htmlFor="date"
            >
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormField>

            <FormField
              label="Horário"
              error={errors.time}
              required
              htmlFor="time"
            >
              <Select
                value={formData.time}
                onValueChange={(value) => handleChange('time', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {getTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Duração (min)"
              error={errors.duration}
              required
              htmlFor="duration"
            >
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                min="15"
                step="15"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Tipo de consulta"
              error={errors.type}
              required
              htmlFor="type"
            >
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value as AppointmentFormData['type'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {locations.length > 0 && (
              <FormField
                label="Local"
                error={errors.location}
                htmlFor="location"
              >
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>

          <FormField
            label="Observações"
            error={errors.notes}
            htmlFor="notes"
          >
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Observações sobre a consulta..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul-respira"
            />
          </FormField>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : (appointment ? 'Atualizar' : 'Agendar')}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

AppointmentForm.displayName = "AppointmentForm" 