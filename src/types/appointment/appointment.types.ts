// AI dev note: Tipos relacionados a agendamentos

/**
 * Status de agendamento
 */
export const AppointmentStatus = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
} as const

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus]

/**
 * Interface de agendamento
 */
export interface Appointment {
  id: string
  patient_id: string
  professional_id: string
  scheduled_at: string
  duration: number
  status: AppointmentStatus
  notes?: string
  created_at: string
  updated_at: string
}

/**
 * Tipo para criação de agendamento
 */
export type CreateAppointment = Omit<Appointment, 'id' | 'created_at' | 'updated_at'>

/**
 * Tipo para atualização de agendamento
 */
export type UpdateAppointment = Partial<Omit<Appointment, 'id'>> & { id: string } 