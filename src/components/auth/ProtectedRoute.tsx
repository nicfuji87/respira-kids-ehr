// AI dev note: Componente ProtectedRoute - usando tipos organizados das constantes
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/auth/useAuth"
import type { UserRole } from "@/config/constants/auth.constants"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  requireApproval?: boolean
  requireCompleteProfile?: boolean
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  requireApproval = true,
  requireCompleteProfile = false
}: ProtectedRouteProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    isApproved, 
    profileComplete 
  } = useAuth()

  // Aguardar carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Não autenticado - redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // Aguardando aprovação
  if (requireApproval && !isApproved) {
    return <Navigate to="/auth/awaiting-approval" replace />
  }

  // Perfil incompleto
  if (requireCompleteProfile && !profileComplete) {
    return <Navigate to="/auth/complete-registration" replace />
  }

  // Verificar roles permitidos
  if (allowedRoles && allowedRoles.length > 0 && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
} 