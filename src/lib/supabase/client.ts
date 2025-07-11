import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '@/config/database'

// Cliente público (para uso no frontend)
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
)

// AI dev note: Banco limpo e simples - apenas public schema
// Usar apenas supabase.from('table_name') para todas as operações 