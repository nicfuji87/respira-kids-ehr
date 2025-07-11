import { z } from 'zod'

// AI dev note: Schemas centralizados de autenticação com validações customizadas em português
// Inclui CPF, telefone, regex patterns reutilizáveis e funções helper para máscaras

// ========================================
// REGEX PATTERNS REUTILIZÁVEIS
// ========================================

export const REGEX_PATTERNS = {
  // CPF: 000.000.000-00 ou 00000000000
  CPF: /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/,
  
  // Telefone: (11) 99999-9999 ou 11999999999
  TELEFONE: /^(\(?\d{2}\)?\s?)\d{4,5}-?\d{4}$/,
  
  // CEP: 00000-000 ou 00000000
  CEP: /^\d{5}-?\d{3}$/,
  
  // Apenas letras e espaços (nomes)
  APENAS_LETRAS: /^[a-zA-ZÀ-ÿ\s]+$/,
  
  // Senha forte: min 8 chars, 1 maiúscula, 1 minúscula, 1 número
  SENHA_FORTE: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
} as const

// ========================================
// FUNÇÕES HELPER PARA MÁSCARAS
// ========================================

export const maskHelpers = {
  /**
   * Aplica máscara de CPF: 000.000.000-00
   */
  cpfMask: (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  },

  /**
   * Aplica máscara de telefone: (11) 99999-9999
   */
  telefoneMask: (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  },

  /**
   * Aplica máscara de CEP: 00000-000
   */
  cepMask: (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  },

  /**
   * Remove todos os caracteres não numéricos
   */
  onlyNumbers: (value: string): string => {
    return value.replace(/\D/g, '')
  },

  /**
   * Capitaliza primeira letra de cada palavra
   */
  capitalizeName: (value: string): string => {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

// ========================================
// VALIDAÇÕES CUSTOMIZADAS
// ========================================

/**
 * Validação de CPF
 */
export const cpfValidation = z
  .string()
  .min(1, 'CPF é obrigatório')
  .regex(REGEX_PATTERNS.CPF, 'CPF deve ter formato válido')
  .refine((cpf) => {
    // Remove caracteres especiais
    const numbers = cpf.replace(/\D/g, '')
    
    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false
    
    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i)
    }
    let firstDigit = (sum * 10) % 11
    if (firstDigit === 10) firstDigit = 0
    if (firstDigit !== parseInt(numbers[9])) return false
    
    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i)
    }
    let secondDigit = (sum * 10) % 11
    if (secondDigit === 10) secondDigit = 0
    if (secondDigit !== parseInt(numbers[10])) return false
    
    return true
  }, 'CPF inválido')

/**
 * Validação de telefone
 */
export const telefoneValidation = z
  .string()
  .min(1, 'Telefone é obrigatório')
  .regex(REGEX_PATTERNS.TELEFONE, 'Telefone deve ter formato válido')
  .refine((phone) => {
    const numbers = phone.replace(/\D/g, '')
    return numbers.length === 10 || numbers.length === 11
  }, 'Telefone deve ter 10 ou 11 dígitos')

/**
 * Validação de CEP
 */
export const cepValidation = z
  .string()
  .min(1, 'CEP é obrigatório')
  .regex(REGEX_PATTERNS.CEP, 'CEP deve ter formato válido')
  .refine((cep) => {
    const numbers = cep.replace(/\D/g, '')
    return numbers.length === 8
  }, 'CEP deve ter 8 dígitos')

/**
 * Validação de senha forte
 */
export const senhaForteValidation = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(REGEX_PATTERNS.SENHA_FORTE, 
    'Senha deve conter: 1 maiúscula, 1 minúscula, 1 número'
  )

// ========================================
// SCHEMAS DE AUTENTICAÇÃO
// ========================================

/**
 * Schema para login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter formato válido')
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
  
  rememberMe: z.boolean().default(false)
})

/**
 * Schema para registro (Step 1)
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter formato válido')
    .toLowerCase(),
  
  password: senhaForteValidation,
  
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  
  acceptTerms: z
    .boolean()
    .refine(val => val === true, {
      message: 'É necessário aceitar os termos de uso'
    })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

/**
 * Schema para completar perfil após aprovação
 */
export const completeProfileSchema = z.object({
  // Dados pessoais básicos
  nome_completo: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .regex(REGEX_PATTERNS.APENAS_LETRAS, 'Nome deve conter apenas letras'),
  
  cpf: cpfValidation,
  
  telefone: telefoneValidation,
  
  data_nascimento: z
    .string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 18 && age <= 100
    }, 'Idade deve estar entre 18 e 100 anos'),
  
  genero: z.enum(['masculino', 'feminino', 'outro'], {
    errorMap: () => ({ message: 'Gênero é obrigatório' })
  }),

  // Endereço
  cep: cepValidation,
  
  logradouro: z
    .string()
    .min(1, 'Logradouro é obrigatório')
    .min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
  
  numero: z
    .string()
    .min(1, 'Número é obrigatório'),
  
  bairro: z
    .string()
    .min(1, 'Bairro é obrigatório')
    .min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  
  cidade: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  
  estado: z
    .string()
    .min(1, 'Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres'),
  
  complemento: z.string().optional(),

  // Dados profissionais (condicional)
  tipo: z.enum(['profissional', 'responsavel'], {
    errorMap: () => ({ message: 'Tipo de usuário é obrigatório' })
  }),
  
  numero_conselho: z.string().optional(),
  
  especialidade: z.string().optional(),
  
  bio: z.string().optional()

}).refine((data) => {
  // Se é profissional, número do conselho e especialidade são obrigatórios
  if (data.tipo === 'profissional') {
    return !!(data.numero_conselho && data.especialidade)
  }
  return true
}, {
  message: 'Número do conselho e especialidade são obrigatórios para profissionais',
  path: ['numero_conselho']
})

/**
 * Schema para reset de senha
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter formato válido')
    .toLowerCase()
})

/**
 * Schema para atualizar senha
 */
export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória'),
  
  newPassword: senhaForteValidation,
  
  confirmNewPassword: z
    .string()
    .min(1, 'Confirmação da nova senha é obrigatória')

}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmNewPassword']
})

/**
 * Schema para atualizar perfil
 */
export const updateProfileSchema = z.object({
  nome_completo: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .regex(REGEX_PATTERNS.APENAS_LETRAS, 'Nome deve conter apenas letras'),
  
  telefone: telefoneValidation,
  
  bio: z.string().optional(),
  
  // Endereço
  cep: cepValidation,
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Estado deve ter 2 caracteres'),
  complemento: z.string().optional(),
  
  // Dados profissionais (se aplicável)
  numero_conselho: z.string().optional(),
  especialidade: z.string().optional()
})

// ========================================
// TIPOS TYPESCRIPT
// ========================================

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

// ========================================
// EXPORTS PARA FACILITAR IMPORTAÇÃO
// ========================================

export const authSchemas = {
  login: loginSchema,
  register: registerSchema,
  completeProfile: completeProfileSchema,
  resetPassword: resetPasswordSchema,
  updatePassword: updatePasswordSchema,
  updateProfile: updateProfileSchema
} as const

export const validations = {
  cpf: cpfValidation,
  telefone: telefoneValidation,
  cep: cepValidation,
  senhaForte: senhaForteValidation
} as const 