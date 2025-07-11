// AI dev note: Configurações de ambiente

interface EnvConfig {
  // Ambiente
  NODE_ENV: string
  DEV: boolean
  PROD: boolean
  
  // Supabase
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  
  // URLs
  API_URL: string
  FRONTEND_URL: string
  
  // Configurações
  ENABLE_ANALYTICS: boolean
  ENABLE_ERROR_REPORTING: boolean
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
}

// Validação de variáveis de ambiente obrigatórias
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const

// Verificar se todas as variáveis obrigatórias estão definidas
for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${envVar}`)
  }
}

export const env: EnvConfig = {
  // Ambiente
  NODE_ENV: import.meta.env.MODE || 'development',
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // URLs
  API_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_SUPABASE_URL,
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  
  // Configurações
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  LOG_LEVEL: (import.meta.env.VITE_LOG_LEVEL as EnvConfig['LOG_LEVEL']) || 'info',
}

// Log de configuração em desenvolvimento
if (env.DEV) {
  console.log('🔧 Configuração de ambiente:', {
    NODE_ENV: env.NODE_ENV,
    API_URL: env.API_URL,
    FRONTEND_URL: env.FRONTEND_URL,
    ENABLE_ANALYTICS: env.ENABLE_ANALYTICS,
    LOG_LEVEL: env.LOG_LEVEL,
  })
} 