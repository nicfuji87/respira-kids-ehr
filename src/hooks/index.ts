// AI dev note: Barrel exports para hooks personalizados organizados por domínio
// Facilita importações e mantém consistência no projeto

// Auth hooks
export { 
  useAuth, 
  usePermissions, 
  useContextPermissions, 
  useRoutePermissions 
} from './auth'

// Common utility hooks
export { useMask, useCep } from './common'

// Types
export type { PermissionMethods } from './auth'
export type { MaskType, CepData, Address } from './common'

// AI dev note: Estrutura organizada por domínio para melhor escalabilidade 