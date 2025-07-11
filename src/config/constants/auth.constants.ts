// AI dev note: Constantes de autenticação e pessoa - removido 'pendente' e adicionado fontes de indicação

// ========== ROLES ==========
export const ROLES = {
  ADMIN: 'admin',
  PROFISSIONAL: 'profissional',
  SECRETARIA: 'secretaria',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// ========== TIPOS DE PESSOA ==========
export const PESSOA_TIPOS = {
  ADMIN: 'admin',
  PROFISSIONAL: 'profissional', 
  SECRETARIA: 'secretaria',
  PACIENTE: 'paciente',
  RESPONSAVEL: 'responsavel',
  EMPRESA: 'empresa',
  FORNECEDOR: 'fornecedor',
  // Removido 'pendente' - controlado por users.is_approved
} as const;

export type PessoaTipo = typeof PESSOA_TIPOS[keyof typeof PESSOA_TIPOS];

// ========== FONTES DE INDICAÇÃO ==========
export const FONTES_INDICACAO = {
  MEDICO_PEDIATRA: 'medico_pediatra',
  INSTAGRAM: 'instagram',
  GOOGLE: 'google',
  INDICACAO_PACIENTE: 'indicacao_paciente',
  FACEBOOK: 'facebook',
  INDICACAO_PROFISSIONAL: 'indicacao_profissional',
  SITE: 'site',
  OUTROS: 'outros',
} as const;

export type FonteIndicacao = typeof FONTES_INDICACAO[keyof typeof FONTES_INDICACAO];

// ========== TIPOS DE RESPONSABILIDADE ==========
export const TIPOS_RESPONSABILIDADE = {
  LEGAL: 'legal',
  FINANCEIRA: 'financeira',
  AMBAS: 'ambas',
} as const;

export type TipoResponsabilidade = typeof TIPOS_RESPONSABILIDADE[keyof typeof TIPOS_RESPONSABILIDADE];

// ========== STATUS DE APROVAÇÃO ==========
export const APPROVAL_STATUS = {
  PENDING: false,
  APPROVED: true,
} as const;

export const PROFILE_STATUS = {
  INCOMPLETE: false,
  COMPLETE: true,
} as const;

export const AUTH_CONFIG = {
  // Tokens
  ACCESS_TOKEN_KEY: 'respira_kids_access_token',
  REFRESH_TOKEN_KEY: 'respira_kids_refresh_token',
  USER_KEY: 'respira_kids_user',
  
  // Timeouts
  TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutos
  LOGIN_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  
  // URLs de redirecionamento
  REDIRECT_AFTER_LOGIN: '/dashboard',
  REDIRECT_AFTER_LOGOUT: '/auth/login',
  REDIRECT_AFTER_REGISTER: '/auth/awaiting-approval',
  REDIRECT_AFTER_APPROVAL: '/auth/complete-registration',
} as const

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'approve:users',
    'manage:system',
    'access:admin',
    'view:dashboard',
    'manage:patients',
    'manage:appointments',
    'manage:financial',
    'manage:stock',
  ],
  [ROLES.PROFISSIONAL]: [
    'view:dashboard',
    'manage:patients',
    'manage:appointments',
    'view:financial',
  ],
  [ROLES.SECRETARIA]: [
    'view:dashboard',
    'view:patients',
    'manage:appointments',
    'view:financial',
  ],
} as const

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SYMBOLS: false,
} as const 