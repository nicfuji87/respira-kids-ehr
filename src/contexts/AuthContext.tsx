import React from 'react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser, AuthError } from '@supabase/supabase-js'
import { ROLES } from '@/config/constants/auth.constants'
import { 
  type User, 
  type UserRole, 
  type AuthState, 
  type AuthContextValue,
  getRolePermissions,
  AuthContext 
} from './auth.utils'

// ==================== PROVIDER ====================

export interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ==================== STATE ====================
  
  const [state, setState] = React.useState<AuthState>({
    user: null,
    person: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    lastActivity: null,
    role: null,
    profileComplete: false,
    isApproved: false
  })

  // ==================== HELPER FUNCTIONS ====================

  const fetchUserProfile = React.useCallback(async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('pessoas')
        .select(`
          *,
          tipo_pessoa:pessoa_tipos(*)
        `)
        .eq('auth_user_id', userId)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        const user: User = {
          id: data.id,
          email: data.email || '',
          name: data.nome || '',
          role: data.role || ROLES.PROFISSIONAL,
          status: data.is_approved ? 'ativo' : 'pending',
          approvedAt: data.is_approved ? data.updated_at : undefined,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          lastLoginAt: new Date().toISOString(),
          permissions: getRolePermissions(data.role || ROLES.PROFISSIONAL),
          profile: {
            firstName: data.nome ? data.nome.split(' ')[0] : '',
            lastName: data.nome ? data.nome.split(' ').slice(1).join(' ') : '',
            cpfCnpj: data.cpf_cnpj
          }
        }

        setState(prev => ({
          ...prev,
          user,
          person: data,
          isAuthenticated: true,
          isLoading: false,
          lastActivity: new Date(),
          role: data.role || ROLES.PROFISSIONAL,
          profileComplete: data.profile_complete || false,
          isApproved: data.is_approved || false
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar perfil'
      }))
    }
  }, [])

  const createUserProfile = React.useCallback(async (supabaseUser: SupabaseUser, nome: string): Promise<void> => {
    try {
      const { data: tipoProfissional } = await supabase
        .from('pessoa_tipos')
        .select('id')
        .eq('codigo', 'profissional')
        .single()

      const { error } = await supabase
        .from('pessoas')
        .insert({
          auth_user_id: supabaseUser.id,
          nome: nome,
          email: supabaseUser.email!,
          id_tipo_pessoa: tipoProfissional?.id,
          role: ROLES.PROFISSIONAL,
          is_approved: false,
          profile_complete: false
        })

      if (error) {
        throw error
      }

      await fetchUserProfile(supabaseUser.id)
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao criar perfil'
      }))
    }
  }, [fetchUserProfile])

  const signInWithEmail = React.useCallback(async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      if (data.user) {
        await fetchUserProfile(data.user.id)
      }
      
    } catch (error) {
      const authError = error as AuthError
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError.message || 'Erro de autenticação'
      }))
      throw error
    }
  }, [fetchUserProfile])

  const signInWithGoogle = React.useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        throw error
      }
      
    } catch (error) {
      const authError = error as AuthError
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError.message || 'Erro de autenticação'
      }))
      throw error
    }
  }, [])

  const signUp = React.useCallback(async (email: string, password: string, nome: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nome,
            role: ROLES.PROFISSIONAL,
          }
        }
      })

      if (error) {
        throw error
      }

      if (data.user) {
        await createUserProfile(data.user, nome)
      }
      
    } catch (error) {
      const authError = error as AuthError
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError.message || 'Erro de autenticação'
      }))
      throw error
    }
  }, [createUserProfile])

  const signOut = React.useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      setState({
        user: null,
        person: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        lastActivity: null,
        role: null,
        profileComplete: false,
        isApproved: false
      })
      
    } catch (error) {
      const authError = error as AuthError
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError.message || 'Erro de autenticação'
      }))
      throw error
    }
  }, [])

  const resetPassword = React.useCallback(async (email: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      setState(prev => ({ ...prev, isLoading: false }))
      
    } catch (error) {
      const authError = error as AuthError
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError.message || 'Erro de autenticação'
      }))
      throw error
    }
  }, [])

  const updateProfile = React.useCallback(async (data: Partial<User['profile']>): Promise<void> => {
    if (!state.user) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { error } = await supabase
        .from('pessoas')
        .update({
          nome: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
          cpf_cnpj: data.cpfCnpj,
          profile_complete: true
        })
        .eq('auth_user_id', state.user.id)

      if (error) {
        throw error
      }
      
      setState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          profile: { ...prev.user.profile, ...data },
          updatedAt: new Date().toISOString(),
        } : null,
        isLoading: false,
        profileComplete: true
      }))
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar perfil'
      }))
      throw error
    }
  }, [state.user])

  const checkProfileCompletion = React.useCallback((): boolean => {
    if (!state.user) return false
    
    const { profile } = state.user
    const { firstName, lastName, cpfCnpj } = profile
    
    return !!(cpfCnpj && firstName && lastName)
  }, [state.user])

  const clearError = React.useCallback((): void => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const hasRole = React.useCallback((role: UserRole | UserRole[]): boolean => {
    if (!state.user) return false
    
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(state.user.role)
  }, [state.user])

  const hasPermission = React.useCallback((permission: string | string[]): boolean => {
    if (!state.user) return false
    
    const permissions = Array.isArray(permission) ? permission : [permission]
    return permissions.every(perm => state.user!.permissions.includes(perm))
  }, [state.user])

  const isActive = React.useCallback((): boolean => {
    return state.user?.status === 'ativo'
  }, [state.user])

  const hasCompleteProfile = React.useCallback((): boolean => {
    return state.profileComplete
  }, [state.profileComplete])

  const getUserRole = React.useCallback((): UserRole | null => {
    return state.role
  }, [state.role])

  const canAccess = React.useCallback((
    requiredRoles?: UserRole[], 
    requiredPermissions?: string[]
  ): boolean => {
    if (!state.isAuthenticated || !isActive()) return false
    
    if (requiredRoles && requiredRoles.length > 0) {
      if (!hasRole(requiredRoles)) return false
    }
    
    if (requiredPermissions && requiredPermissions.length > 0) {
      if (!hasPermission(requiredPermissions)) return false
    }
    
    return true
  }, [state.isAuthenticated, isActive, hasRole, hasPermission])

  const getUserInitials = React.useCallback((): string => {
    if (!state.user) return ''
    
    const firstName = state.user.profile.firstName || ''
    const lastName = state.user.profile.lastName || ''
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }, [state.user])

  const getFullName = React.useCallback((): string => {
    if (!state.user) return ''
    
    return `${state.user.profile.firstName} ${state.user.profile.lastName}`.trim()
  }, [state.user])

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            person: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastActivity: null,
            role: null,
            profileComplete: false,
            isApproved: false
          })
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          await fetchUserProfile(session.user.id)
        }
      }
    )

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao inicializar autenticação'
        }))
      }
    }

    initializeAuth()

    return () => subscription.unsubscribe()
  }, [fetchUserProfile])

  const contextValue: AuthContextValue = {
    ...state,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    checkProfileCompletion,
    clearError,
    hasRole,
    hasPermission,
    isActive,
    hasCompleteProfile,
    getUserRole,
    canAccess,
    getUserInitials,
    getFullName
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Re-export types for external use
export type { UserRole, AuthContextValue } from './auth.utils' 