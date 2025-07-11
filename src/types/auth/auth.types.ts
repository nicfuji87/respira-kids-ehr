// AI dev note: Tipos para formulários de autenticação - usando tipos organizados das constantes
import type { UserRole } from '@/config/constants/auth.constants'

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  nome: string
  role?: UserRole
  acceptTerms: boolean
}

export interface CompleteProfileFormData {
  nome: string
  cpf_cnpj?: string
  telefone?: string
  data_nascimento?: string
  registro_profissional?: string
  especialidade?: string
  // Campos de endereço
  cep?: string
  logradouro?: string
  numero_endereco?: string
  complemento_endereco?: string
  bairro?: string
  cidade?: string
  uf?: string
  // Fontes de indicação
  fontes_indicacao?: string[]
}

export interface ResetPasswordFormData {
  email: string
}

export interface UpdatePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileFormData {
  nome?: string
  cpf_cnpj?: string
  telefone?: string
  data_nascimento?: string
  registro_profissional?: string
  especialidade?: string
  bio_profissional?: string
} 