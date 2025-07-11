// AI dev note: Barrel exports para hooks de autenticação
export { useAuth } from './useAuth'
export { 
  usePermissions, 
  useContextPermissions, 
  useRoutePermissions 
} from './usePermissions'

// Types
export type { PermissionMethods } from './usePermissions' 