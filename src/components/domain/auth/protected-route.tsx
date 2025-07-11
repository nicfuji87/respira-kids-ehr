// AI dev note: Protected route domain component - usando tipos organizados
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/auth/useAuth"
import type { UserRole } from "@/config/constants/auth.constants"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  requireApproval?: boolean
  requireCompleteProfile?: boolean
  fallbackPath?: string
}

export default function ProtectedRoute({
  children,
  requiredRoles,
  requireApproval = true,
  requireCompleteProfile = false,
  fallbackPath = "/dashboard"
}: ProtectedRouteProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    isApproved, 
    profileComplete 
  } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roxo-principal"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (requireApproval && !isApproved) {
    return <Navigate to="/auth/awaiting-approval" replace />
  }

  if (requireCompleteProfile && !profileComplete) {
    return <Navigate to="/auth/complete-registration" replace />
  }

  if (requiredRoles && user?.role && !requiredRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
} 