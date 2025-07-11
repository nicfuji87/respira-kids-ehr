// AI dev note: Barrel exports para schemas organizados por domínio
// Facilita importações e mantém consistência no projeto

// Auth schemas
export {
  REGEX_PATTERNS,
  maskHelpers,
  loginSchema,
  registerSchema,
  completeProfileSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema,
  authSchemas,
  validations
} from './auth'

// Auth schema types
export type {
  LoginFormData,
  RegisterFormData,
  CompleteProfileFormData,
  ResetPasswordFormData,
  UpdatePasswordFormData,
  UpdateProfileFormData
} from './auth'

// AI dev note: Estrutura organizada por domínio para melhor escalabilidade 