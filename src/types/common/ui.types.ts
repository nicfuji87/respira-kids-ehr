// AI dev note: Tipos comuns de UI e utilitários

/**
 * Tipos de variantes para componentes
 */
export type Variant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'

/**
 * Tamanhos padrão
 */
export type Size = 'default' | 'sm' | 'lg' | 'icon'

/**
 * Estados de loading
 */
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

/**
 * Resposta de API genérica
 */
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  success: boolean
  message?: string
}

/**
 * Opções para select/dropdown
 */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

/**
 * Configuração de paginação
 */
export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  totalPages: number
} 