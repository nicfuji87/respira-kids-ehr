// AI dev note: Constantes relacionadas à interface do usuário

export const COLORS = {
  // Cores principais do tema Respira KIDS
  PRIMARY: {
    'azul-respira': '#4A90E2',
    'verde-pipa': '#7ED321',
    'amarelo-pipa': '#F5A623',
    'vermelho-kids': '#D0021B',
    'roxo-titulo': '#6B46C1',
  },
  
  // Estados
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  
  // Neutros
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const

export const ANIMATIONS = {
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },
  
  EASING: {
    LINEAR: 'linear',
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const

export const TOAST_CONFIG = {
  DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000,
  },
  
  POSITION: 'top-right',
  MAX_TOASTS: 5,
} as const

export const MODAL_CONFIG = {
  BACKDROP_BLUR: true,
  CLOSE_ON_ESCAPE: true,
  CLOSE_ON_BACKDROP: true,
  ANIMATION_DURATION: 300,
} as const 