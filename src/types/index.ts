// ==================== CONSTANTS ====================

/**
 * Status de agendamentos
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
 * Status de pagamentos
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus]

/**
 * Status de estoque
 */
export const StockStatus = {
  AVAILABLE: 'available',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  EXPIRED: 'expired',
  DISCONTINUED: 'discontinued'
} as const

export type StockStatus = typeof StockStatus[keyof typeof StockStatus]

/**
 * Status de webhooks
 */
export const WebhookStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ERROR: 'error',
  PENDING: 'pending'
} as const

export type WebhookStatus = typeof WebhookStatus[keyof typeof WebhookStatus]

// ==================== TYPES ====================

/**
 * Roles de usuário no sistema
 */
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'financial'

// ==================== INTERFACES ====================

/**
 * Interface de usuário (compatível com Supabase profiles)
 */
export interface User {
  /** ID único do usuário */
  id: string
  /** Email do usuário */
  email: string
  /** Nome completo */
  full_name: string
  /** Role/função no sistema */
  role: UserRole
  /** URL do avatar */
  avatar_url?: string
  /** Telefone */
  phone?: string
  /** CPF */
  cpf?: string
  /** CRM (para médicos) */
  crm?: string
  /** Status ativo/inativo */
  is_active: boolean
  /** Data de criação */
  created_at: string
  /** Data de última atualização */
  updated_at: string
}

/**
 * Interface de paciente
 */
export interface Patient {
  /** ID único do paciente */
  id: string
  /** Nome completo */
  full_name: string
  /** Data de nascimento */
  birth_date: string
  /** CPF */
  cpf: string
  /** RG */
  rg?: string
  /** Sexo */
  gender: 'male' | 'female' | 'other'
  /** Telefone */
  phone?: string
  /** Email */
  email?: string
  /** Endereço completo */
  address?: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
  }
  /** Nome da mãe */
  mother_name?: string
  /** Nome do pai */
  father_name?: string
  /** Plano de saúde */
  insurance?: {
    company: string
    plan: string
    card_number: string
    validity?: string
  }
  /** Alergias conhecidas */
  allergies?: string[]
  /** Medicamentos em uso */
  medications?: string[]
  /** Observações médicas */
  medical_notes?: string
  /** Status ativo/inativo */
  is_active: boolean
  /** Data de criação */
  created_at: string
  /** Data de última atualização */
  updated_at: string
}

/**
 * Interface de agendamento
 */
export interface Appointment {
  /** ID único do agendamento */
  id: string
  /** ID do paciente */
  patient_id: string
  /** Dados do paciente */
  patient?: Patient
  /** ID do médico */
  doctor_id: string
  /** Dados do médico */
  doctor?: User
  /** Data e hora do agendamento */
  appointment_date: string
  /** Duração em minutos */
  duration: number
  /** Tipo de consulta */
  type: 'consultation' | 'return' | 'emergency' | 'procedure'
  /** Status do agendamento */
  status: AppointmentStatus
  /** Motivo da consulta */
  reason?: string
  /** Observações */
  notes?: string
  /** Valor da consulta */
  price?: number
  /** Data de criação */
  created_at: string
  /** Data de última atualização */
  updated_at: string
}

/**
 * Interface de item de estoque
 */
export interface StockItem {
  /** ID único do item */
  id: string
  /** Nome do produto */
  name: string
  /** Descrição */
  description?: string
  /** Código de barras */
  barcode?: string
  /** Categoria */
  category: 'medication' | 'equipment' | 'supply' | 'vaccine'
  /** Quantidade atual */
  quantity: number
  /** Quantidade mínima */
  min_quantity: number
  /** Unidade de medida */
  unit: 'unit' | 'box' | 'bottle' | 'kg' | 'liter'
  /** Preço de compra */
  purchase_price?: number
  /** Preço de venda */
  sale_price?: number
  /** Fornecedor */
  supplier?: string
  /** Data de validade */
  expiry_date?: string
  /** Lote */
  batch?: string
  /** Status do item */
  status: StockStatus
  /** Localização no estoque */
  location?: string
  /** Data de criação */
  created_at: string
  /** Data de última atualização */
  updated_at: string
}

/**
 * Interface financeira
 */
export interface Financial {
  /** ID único da transação */
  id: string
  /** Tipo de transação */
  type: 'income' | 'expense'
  /** Categoria */
  category: 'consultation' | 'medication' | 'equipment' | 'salary' | 'rent' | 'other'
  /** Descrição */
  description: string
  /** Valor */
  amount: number
  /** Status do pagamento */
  status: PaymentStatus
  /** Data de vencimento */
  due_date?: string
  /** Data de pagamento */
  paid_date?: string
  /** Método de pagamento */
  payment_method?: 'cash' | 'card' | 'pix' | 'transfer' | 'check'
  /** ID do paciente (se aplicável) */
  patient_id?: string
  /** Dados do paciente */
  patient?: Patient
  /** ID do agendamento (se aplicável) */
  appointment_id?: string
  /** Observações */
  notes?: string
  /** Data de criação */
  created_at: string
  /** Data de última atualização */
  updated_at: string
}

/**
 * Interface de webhook
 */
export interface Webhook {
  /** ID único do webhook */
  id: string
  /** Nome/identificador */
  name: string
  /** URL de destino */
  url: string
  /** Eventos que disparam o webhook */
  events: string[]
  /** Status do webhook */
  status: WebhookStatus
  /** Headers HTTP customizados */
  headers?: Record<string, string>
  /** Secret para verificação de assinatura */
  secret?: string
  /** Número máximo de tentativas */
  max_retries: number
  /** Timeout em segundos */
  timeout: number
  /** Última tentativa */
  last_attempt?: string
  /** Última resposta bem-sucedida */
  last_success?: string
  /** Contador de falhas */
  failure_count: number
  /** Data de criação */
  created_at: string
  /** Data de última atualização */
  updated_at: string
}

// ==================== UTILITY TYPES ====================

/**
 * Tipo para criação de novo usuário (omite campos gerados automaticamente)
 */
export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at'>

/**
 * Tipo para atualização de usuário (todos os campos opcionais exceto id)
 */
export type UpdateUser = Partial<Omit<User, 'id'>> & { id: string }

/**
 * Tipo para criação de novo paciente
 */
export type CreatePatient = Omit<Patient, 'id' | 'created_at' | 'updated_at'>

/**
 * Tipo para atualização de paciente
 */
export type UpdatePatient = Partial<Omit<Patient, 'id'>> & { id: string }

/**
 * Tipo para criação de novo agendamento
 */
export type CreateAppointment = Omit<Appointment, 'id' | 'patient' | 'doctor' | 'created_at' | 'updated_at'>

/**
 * Tipo para atualização de agendamento
 */
export type UpdateAppointment = Partial<Omit<Appointment, 'id' | 'patient' | 'doctor'>> & { id: string }

/**
 * Tipo para criação de novo item de estoque
 */
export type CreateStockItem = Omit<StockItem, 'id' | 'created_at' | 'updated_at'>

/**
 * Tipo para atualização de item de estoque
 */
export type UpdateStockItem = Partial<Omit<StockItem, 'id'>> & { id: string }

/**
 * Tipo para criação de transação financeira
 */
export type CreateFinancial = Omit<Financial, 'id' | 'patient' | 'created_at' | 'updated_at'>

/**
 * Tipo para atualização de transação financeira
 */
export type UpdateFinancial = Partial<Omit<Financial, 'id' | 'patient'>> & { id: string }

/**
 * Tipo para criação de webhook
 */
export type CreateWebhook = Omit<Webhook, 'id' | 'last_attempt' | 'last_success' | 'failure_count' | 'created_at' | 'updated_at'>

/**
 * Tipo para atualização de webhook
 */
export type UpdateWebhook = Partial<Omit<Webhook, 'id' | 'last_attempt' | 'last_success' | 'failure_count'>> & { id: string } 