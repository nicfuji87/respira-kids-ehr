// AI dev note: Barrel exports para types organizados por domínio
// Facilita importações e mantém consistência no projeto

// Auth types (apenas formulários, usuários agora são Person)
export type { 
  LoginFormData,
  RegisterFormData,
  CompleteProfileFormData,
  ResetPasswordFormData,
  UpdatePasswordFormData,
  UpdateProfileFormData
} from './auth'

// Person types (sistema unificado de pessoas + usuários)
export type {
  PersonType,
  Company,
  Address,
  FonteIndicacao,
  PessoaIndicacao,
  Person,
  PersonResponsibility,
  PersonWithRelations,
  PersonWithResponsibilities,
  PersonFormData,
  PersonProfessionalView
} from './person'

// Appointment types
export { AppointmentStatus } from './appointment'
export type {
  AppointmentStatus as AppointmentStatusType,
  Appointment,
  CreateAppointment,
  UpdateAppointment
} from './appointment'

// Patient types (mantidos para compatibilidade)
export type {
  Patient,
  PatientAddress,
  PatientMedicalInfo,
  CreatePatient,
  UpdatePatient
} from './patient'

// Common types
export type {
  Variant,
  Size,
  LoadingState,
  ApiResponse,
  SelectOption,
  PaginationConfig
} from './common'

// AI dev note: Usuários agora são Person com role, is_approved, profile_complete 