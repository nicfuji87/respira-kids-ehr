import { useAuth } from "@/contexts/AuthContext"
import { Spinner } from "@/components/primitives"
import { LoginForm } from "./login-form"
import type { UserRole } from "@/contexts/AuthContext"

export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  requiredPermissions?: string[]
  fallback?: React.ReactNode
  redirectTo?: string
  showLogin?: boolean
}

export const ProtectedRoute = ({
  children,
  requiredRoles,
  requiredPermissions,
  fallback,
  showLogin = true
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, canAccess } = useAuth()

  // Mostrar loading durante verificação de auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bege-fundo">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-roxo-titulo">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Usuário não autenticado
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    if (showLogin) {
      return (
        <div className="flex h-screen items-center justify-center bg-bege-fundo p-4">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      )
    }
    
    return (
      <div className="flex h-screen items-center justify-center bg-bege-fundo">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-roxo-titulo mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600">
            Você precisa estar logado para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  // Verificar permissões específicas
  if (!canAccess(requiredRoles, requiredPermissions)) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <div className="flex h-screen items-center justify-center bg-bege-fundo">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-roxo-titulo mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  // Usuário autenticado e com permissões adequadas
  return <>{children}</>
}

ProtectedRoute.displayName = "ProtectedRoute" 