import { useAuth } from './useAuth'
import type { UserRole } from '@/config/constants/auth.constants'

// AI dev note: Permissions simplificadas - apenas as realmente utilizadas na aplicação

/**
 * Métodos de permissão disponíveis (apenas essenciais)
 */
export interface PermissionMethods {
  // Aprovação de usuários (usado em UserApprovalPage)
  canApproveUsers: () => boolean
  canManageSystem: () => boolean
  
  // Permissões básicas
  canAccessAdminPanel: () => boolean
  canViewDashboard: () => boolean
}

/**
 * Permissões por role (simplificadas)
 */
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['approve:users', 'manage:system', 'access:admin', 'view:dashboard'],
  profissional: ['view:dashboard'],
  secretaria: ['view:dashboard']
}

/**
 * Implementação vazia para estados não autenticados
 */
const emptyPermissions: PermissionMethods = {
  canApproveUsers: () => false,
  canManageSystem: () => false,
  canAccessAdminPanel: () => false,
  canViewDashboard: () => false
}

/**
 * Hook principal de permissões
 */
export function usePermissions(): PermissionMethods {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return emptyPermissions
  }

  const userPermissions = ROLE_PERMISSIONS[user.role as UserRole] || []
  
  const hasPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => userPermissions.includes(permission))
  }

  return {
    canApproveUsers: () => {
      return user.role === 'admin' && 
        hasPermission(['approve:users'])
    },

    canManageSystem: () => {
      return user.role === 'admin' && 
        hasPermission(['manage:system'])
    },

    canAccessAdminPanel: () => {
      return user.role === 'admin' && 
        hasPermission(['access:admin'])
    },

    canViewDashboard: () => {
      return hasPermission(['view:dashboard'])
    }
  }
}

/**
 * Hook de permissões contextuais (simplificado)
 */
export function useContextPermissions() {
  const permissions = usePermissions()
  
  return {
    // Apenas contextos realmente utilizados
    'user-approval': {
      canView: permissions.canApproveUsers(),
      canCreate: permissions.canApproveUsers(),
      canEdit: permissions.canApproveUsers(),
      canDelete: permissions.canApproveUsers()
    }
  }
}

/**
 * Hook de permissões de rota (simplificado)
 */
export function useRoutePermissions() {
  const permissions = usePermissions()
  
  return {
    '/admin': permissions.canAccessAdminPanel(),
    '/admin/users': permissions.canApproveUsers(),
    '/dashboard': permissions.canViewDashboard()
  }
}

// AI dev note: Arquivo drasticamente simplificado - apenas permissões essenciais em uso
// Outras permissões serão adicionadas conforme necessário durante desenvolvimento 