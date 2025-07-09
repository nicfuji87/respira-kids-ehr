import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export interface NavigationGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  requireAuth?: boolean
  redirectTo?: string
}

export const NavigationGuard = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo = "/login"
}: NavigationGuardProps) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  // Se não requer autenticação, permite acesso
  if (!requireAuth) {
    return <>{children}</>
  }

  // Se requer autenticação mas não está logado, redireciona para login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Se não especificou roles, permite acesso para qualquer usuário autenticado
  if (allowedRoles.length === 0) {
    return <>{children}</>
  }

  // Verifica se o usuário tem a role permitida
  const hasPermission = allowedRoles.includes(user?.role || '')

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

NavigationGuard.displayName = "NavigationGuard" 