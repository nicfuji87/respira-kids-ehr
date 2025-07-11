import { useMemo } from 'react'
import { ROLE_PERMISSIONS } from '@/config/constants/auth.constants'
import { useAuth } from '@/hooks/auth/useAuth'
import type { UserRole } from '@/config/constants/auth.constants'

export const usePermissions = () => {
  const { user } = useAuth()
  
  const permissions = useMemo(() => {
    if (!user) return [] as string[]
    return [...(ROLE_PERMISSIONS[user.role as UserRole] || [])]
  }, [user])

  const hasPermission = useMemo(() => {
    return (permission: string) => permissions.includes(permission)
  }, [permissions])

  const hasAnyPermission = useMemo(() => {
    return (permissionList: string[]) => 
      permissionList.some(permission => permissions.includes(permission))
  }, [permissions])

  const hasAllPermissions = useMemo(() => {
    return (permissionList: string[]) => 
      permissionList.every(permission => permissions.includes(permission))
  }, [permissions])

  // Permissions específicas comuns
  const canManageUsers = useMemo(() => hasPermission('manage:users'), [hasPermission])
  const canApproveUsers = useMemo(() => hasPermission('approve:users'), [hasPermission])
  const canViewReports = useMemo(() => hasPermission('view:reports'), [hasPermission])
  const canManageAppointments = useMemo(() => hasPermission('manage:appointments'), [hasPermission])
  const canManagePatients = useMemo(() => hasPermission('manage:patients'), [hasPermission])
  const canManageFinances = useMemo(() => hasPermission('manage:finances'), [hasPermission])
  const canManageSystem = useMemo(() => hasPermission('manage:system'), [hasPermission])

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canManageUsers,
    canApproveUsers,
    canViewReports,
    canManageAppointments,
    canManagePatients,
    canManageFinances,
    canManageSystem
  }
} 