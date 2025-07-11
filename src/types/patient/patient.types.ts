// AI dev note: Tipos relacionados a pacientes

/**
 * Interface de paciente
 */
export interface Patient {
  id: string
  full_name: string
  birth_date: string
  cpf?: string
  phone?: string
  responsible_name?: string
  responsible_phone?: string
  responsible_email?: string
  address?: PatientAddress
  medical_info?: PatientMedicalInfo
  created_at: string
  updated_at: string
}

/**
 * Endereço do paciente
 */
export interface PatientAddress {
  cep: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  complemento?: string
}

/**
 * Informações médicas do paciente
 */
export interface PatientMedicalInfo {
  allergies?: string[]
  medications?: string[]
  conditions?: string[]
  notes?: string
}

/**
 * Tipo para criação de paciente
 */
export type CreatePatient = Omit<Patient, 'id' | 'created_at' | 'updated_at'>

/**
 * Tipo para atualização de paciente
 */
export type UpdatePatient = Partial<Omit<Patient, 'id'>> & { id: string } 