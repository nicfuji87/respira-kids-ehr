// AI dev note: Configuração de cores do tema Respira KIDS

export const theme = {
  colors: {
    // Cores principais do Respira KIDS
    'azul-respira': '#4A90E2',
    'verde-pipa': '#7ED321',
    'amarelo-pipa': '#F5A623',
    'vermelho-kids': '#D0021B',
    'roxo-titulo': '#6B46C1',
    
    // Variações
    'azul-respira-light': '#7BB3F0',
    'azul-respira-dark': '#2E5A87',
    'verde-pipa-light': '#A8E86A',
    'verde-pipa-dark': '#5CB71D',
    
    // Sistema
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutros
    gray: {
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
    
    // Backgrounds
    background: '#FFFFFF',
    'background-secondary': '#F8FAFC',
    'background-muted': '#F1F5F9',
    
    // Borders
    border: '#E2E8F0',
    'border-light': '#F1F5F9',
    'border-strong': '#CBD5E1',
    
    // Text
    foreground: '#0F172A',
    'text-muted': '#64748B',
    'text-subtle': '#94A3B8',
  }
} as const

export type ThemeColor = keyof typeof theme.colors 