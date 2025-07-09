import * as React from "react"

// ==================== TYPES ====================

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient'

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  avatar?: string
  phone?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  permissions: string[]
  profile: {
    firstName: string
    lastName: string
    cpf?: string
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
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  lastActivity: Date | null
}

export interface AuthMethods {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (updates: Partial<User['profile']>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

export interface AuthHelpers {
  hasRole: (role: UserRole | UserRole[]) => boolean
  hasPermission: (permission: string | string[]) => boolean
  isActive: () => boolean
  canAccess: (requiredRoles?: UserRole[], requiredPermissions?: string[]) => boolean
  getUserInitials: () => string
  getFullName: () => string
}

export interface AuthContextValue extends AuthState, AuthMethods, AuthHelpers {}

// ==================== CONTEXT ====================

const AuthContext = React.createContext<AuthContextValue | null>(null)

// ==================== PROVIDER ====================

export interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ==================== STATE ====================
  
  const [state, setState] = React.useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    lastActivity: null
  })

  // ==================== METHODS ====================

  const login = React.useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // TODO: Implementar lógica real de login
      // Por enquanto, simula um login com delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user - será substituído pela resposta real da API
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'Dr. João Silva',
        role: 'doctor',
        status: 'active',
        avatar: undefined,
        phone: '(11) 99999-9999',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        permissions: ['read:patients', 'write:patients', 'read:appointments', 'write:appointments'],
        profile: {
          firstName: 'João',
          lastName: 'Silva',
          cpf: '123.456.789-00',
          birthDate: '1980-01-01',
          address: {
            street: 'Rua das Flores',
            number: '123',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
          }
        }
      }

      setState(prev => ({
        ...prev,
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        lastActivity: new Date()
      }))

      // TODO: Salvar token no localStorage/sessionStorage se rememberMe for true
      console.log('Login realizado com sucesso (placeholder)')
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer login'
      }))
      throw error
    }
  }, [])

  const logout = React.useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // TODO: Implementar lógica real de logout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        lastActivity: null
      })

      // TODO: Remover token do storage
      console.log('Logout realizado com sucesso (placeholder)')
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer logout'
      }))
      throw error
    }
  }, [])

  const refreshToken = React.useCallback(async (): Promise<void> => {
    // TODO: Implementar refresh do token
    console.log('Refresh token (placeholder)')
  }, [])

  const updateProfile = React.useCallback(async (updates: Partial<User['profile']>): Promise<void> => {
    if (!state.user) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // TODO: Implementar atualização real do perfil
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          profile: { ...prev.user.profile, ...updates },
          updatedAt: new Date().toISOString()
        } : null,
        isLoading: false
      }))

      console.log('Perfil atualizado com sucesso (placeholder)', updates)
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar perfil'
      }))
      throw error
    }
  }, [state.user])

  const changePassword = React.useCallback(async (_currentPassword: string, _newPassword: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // TODO: Implementar mudança real de senha
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setState(prev => ({ ...prev, isLoading: false }))
      console.log('Senha alterada com sucesso (placeholder)')
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao alterar senha'
      }))
      throw error
    }
  }, [])

  const resetPassword = React.useCallback(async (email: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // TODO: Implementar reset real de senha
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setState(prev => ({ ...prev, isLoading: false }))
      console.log('Email de reset enviado com sucesso (placeholder)', email)
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao enviar email de reset'
      }))
      throw error
    }
  }, [])

  const clearError = React.useCallback((): void => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // ==================== HELPERS ====================

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
    return state.user?.status === 'active'
  }, [state.user])

  const canAccess = React.useCallback((
    requiredRoles?: UserRole[], 
    requiredPermissions?: string[]
  ): boolean => {
    if (!state.isAuthenticated || !isActive()) return false
    
    // Verificar roles se especificados
    if (requiredRoles && requiredRoles.length > 0) {
      if (!hasRole(requiredRoles)) return false
    }
    
    // Verificar permissões se especificadas
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

  // ==================== EFFECTS ====================

  // Inicialização do contexto - verificar se há token salvo
  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        // TODO: Verificar se há token salvo e validá-lo
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setState(prev => ({ ...prev, isLoading: false }))
        console.log('Contexto de auth inicializado (placeholder)')
        
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao inicializar autenticação'
        }))
      }
    }

    initializeAuth()
  }, [])

  // Atualizar última atividade periodicamente
  React.useEffect(() => {
    if (!state.isAuthenticated) return

    const interval = setInterval(() => {
      setState(prev => ({ ...prev, lastActivity: new Date() }))
    }, 60000) // A cada minuto

    return () => clearInterval(interval)
  }, [state.isAuthenticated])

  // ==================== CONTEXT VALUE ====================

  const contextValue: AuthContextValue = React.useMemo(() => ({
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    lastActivity: state.lastActivity,
    
    // Methods
    login,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    resetPassword,
    clearError,
    
    // Helpers
    hasRole,
    hasPermission,
    isActive,
    canAccess,
    getUserInitials,
    getFullName
  }), [
    state,
    login,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    resetPassword,
    clearError,
    hasRole,
    hasPermission,
    isActive,
    canAccess,
    getUserInitials,
    getFullName
  ])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// ==================== HOOK ====================

export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
}

// ==================== EXPORTS ====================

export default AuthContext 