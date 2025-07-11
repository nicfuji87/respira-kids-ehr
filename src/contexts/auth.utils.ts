// AI dev note: Tipos e utilitários de autenticação - movidos para resolver fast-refresh

import { createContext } from 'react'
import type { UserRole as BaseUserRole } from '@/config/constants/auth.constants'
import { ROLES, ROLE_PERMISSIONS } from '@/config/constants/auth.constants'
import type { Person } from '@/types'

// ==================== TYPES ====================

export type UserRole = BaseUserRole

export type UserStatus = 'ativo' | 'bloqueado' | 'pending'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  avatar?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  permissions: string[]
  profile: {
    firstName: string
    lastName: string
    cpfCnpj?: string
    birthDate?: string
    address?: {
      street: string
      number: string
      city: string
      state: string
      zipCode: string
    }
  }
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthState {
  user: User | null
  person: Person | null // AI dev note: Adicionar referência Person para migração
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  lastActivity: Date | null
  role: UserRole | null
  profileComplete: boolean
  isApproved: boolean
}

export interface AuthMethods {
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, nome: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User['profile']>) => Promise<void>
  checkProfileCompletion: () => boolean
  clearError: () => void
}

export interface AuthHelpers {
  hasRole: (role: UserRole | UserRole[]) => boolean
  hasPermission: (permission: string | string[]) => boolean
  isActive: () => boolean
  hasCompleteProfile: () => boolean
  getUserRole: () => UserRole | null
  canAccess: (requiredRoles?: UserRole[], requiredPermissions?: string[]) => boolean
  getUserInitials: () => string
  getFullName: () => string
}

export interface AuthContextValue extends AuthState, AuthMethods, AuthHelpers {}

// ==================== PERMISSION UTILITIES ====================

export function getRolePermissions(role: UserRole): string[] {
  return [...(ROLE_PERMISSIONS[role] || [])]
}

export function hasRolePermission(role: UserRole, permission: string): boolean {
  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}

// ==================== ROLE UTILITIES ====================

export function isAdmin(role: UserRole): boolean {
  return role === ROLES.ADMIN
}

export function isProfessional(role: UserRole): boolean {
  return role === ROLES.PROFISSIONAL
}

export function isSecretary(role: UserRole): boolean {
  return role === ROLES.SECRETARIA
}

// ==================== VALIDATION UTILITIES ====================

export function validateRole(role: string): role is UserRole {
  return Object.values(ROLES).includes(role as UserRole)
}

export function canApproveUsers(role: UserRole): boolean {
  return hasRolePermission(role, 'approve:users')
}

export function canManageSystem(role: UserRole): boolean {
  return hasRolePermission(role, 'manage:system')
}

// ==================== CONTEXT ====================

export const AuthContext = createContext<AuthContextValue | null>(null)

export default AuthContext 