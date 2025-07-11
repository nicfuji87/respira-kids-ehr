// AI dev note: Constantes gerais da aplicação

export const APP_CONFIG = {
  NAME: 'Respira KIDS EHR',
  DESCRIPTION: 'Sistema de Prontuário Eletrônico para Fisioterapia Respiratória Pediátrica',
  VERSION: '1.0.0',
  AUTHOR: 'Respira KIDS',
  
  // URLs
  WEBSITE: 'https://respira-kids.com.br',
  SUPPORT_EMAIL: 'suporte@respira-kids.com.br',
  
  // Limites
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_UPLOAD: 5,
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 segundos
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const 