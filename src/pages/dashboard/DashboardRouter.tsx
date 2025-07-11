import * as React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/auth/useAuth"

import FullScreenLoading from "@/pages/common/Loading"

// ==================== LAZY LOADED DASHBOARDS ====================

// AI dev note: Lazy loading dashboards para melhor performance
// Cada dashboard é carregado apenas quando necessário baseado no role do usuário

const PendingDashboard = React.lazy(() => import('./PendingDashboard'))
const ProfessionalDashboard = React.lazy(() => import('./ProfessionalDashboard'))
const SecretaryDashboard = React.lazy(() => import('./SecretaryDashboard'))
const AdminDashboard = React.lazy(() => import('./AdminDashboard'))

// ==================== ERROR BOUNDARY ====================

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class DashboardErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bege-fundo))] to-white flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[hsl(var(--vermelho-kids))]/20 to-[hsl(var(--amarelo-pipa))]/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[hsl(var(--vermelho-kids))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5 17l14-14M5 3l14 14" />
              </svg>
            </div>

            <div className="space-y-3">
              <h1 className="text-xl font-bold text-[hsl(var(--roxo-titulo))]">
                Erro no Dashboard
              </h1>
              <p className="text-sm text-zinc-600">
                Ocorreu um erro ao carregar seu dashboard. Tente recarregar a página.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[hsl(var(--azul-respira))] text-white px-4 py-3 rounded-md font-medium hover:bg-[hsl(var(--azul-respira))]/90 theme-transition min-h-[44px]"
            >
              Recarregar Dashboard
            </button>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 p-3 bg-zinc-100 rounded-md text-left">
                <summary className="font-medium text-zinc-900 cursor-pointer text-sm">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 text-xs text-zinc-600 whitespace-pre-wrap break-words">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// ==================== LOADING SKELETON ====================

const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bege-fundo))] to-white">
    <div className="animate-pulse space-y-6 p-6">
      {/* Header skeleton */}
      <div className="h-8 bg-zinc-200 rounded-md w-1/3"></div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-zinc-200 rounded-lg"></div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-zinc-200 rounded w-full"></div>
        <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
)

// ==================== DASHBOARD ROUTER ====================

export interface DashboardRouterProps {
  className?: string
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({ className }) => {
  const { user, isAuthenticated, isLoading, role, profileComplete, isApproved } = useAuth()

  // AI dev note: Verificações de segurança antes de renderizar dashboard
  // Garante que apenas usuários autenticados e aprovados acessem dashboards

  // Loading state
  if (isLoading) {
    return <FullScreenLoading message="Carregando dashboard..." />
  }

  // Não autenticado - redireciona para login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  // Usuário sem aprovação - dashboard pendente
  if (!isApproved || !role) {
    return (
      <DashboardErrorBoundary>
        <React.Suspense fallback={<DashboardSkeleton />}>
          <PendingDashboard />
        </React.Suspense>
      </DashboardErrorBoundary>
    )
  }

  // Perfil incompleto - redireciona para completar cadastro
  if (!profileComplete) {
    return <Navigate to="/auth/complete-registration" replace />
  }

  // Router baseado no role do usuário
  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return (
          <React.Suspense fallback={<DashboardSkeleton />}>
            <AdminDashboard />
          </React.Suspense>
        )

      case 'profissional':
        return (
          <React.Suspense fallback={<DashboardSkeleton />}>
            <ProfessionalDashboard />
          </React.Suspense>
        )

      case 'secretaria':
        return (
          <React.Suspense fallback={<DashboardSkeleton />}>
            <SecretaryDashboard />
          </React.Suspense>
        )

      default:
        // Role não reconhecido - redireciona para login
        console.error('Role não reconhecido:', role)
        return <Navigate to="/auth/login" replace />
    }
  }

  return (
    <DashboardErrorBoundary>
      <div className={className}>
        {renderDashboard()}
      </div>
    </DashboardErrorBoundary>
  )
}

export default DashboardRouter 