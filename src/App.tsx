import * as React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { useAuth } from "@/hooks/auth/useAuth"
import FullScreenLoading from "@/pages/common/Loading"
import NotFound from "@/pages/common/NotFound"
import "@/index.css"

// ==================== ERROR BOUNDARY ====================

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
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
    console.error('App Error Boundary caught an error:', error, errorInfo)
    
    // TODO: Integrar com serviço de monitoramento de erros (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bege-fundo))] to-white flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Ícone de erro */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[hsl(var(--vermelho-kids))]/20 to-[hsl(var(--amarelo-pipa))]/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[hsl(var(--vermelho-kids))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-[hsl(var(--roxo-titulo))]">
                Ops! Algo deu errado
              </h1>
              <p className="text-base text-zinc-600">
                Encontramos um erro inesperado. Nossa equipe foi notificada e está trabalhando para corrigir o problema.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[hsl(var(--azul-respira))] text-white px-6 py-3 rounded-md font-medium hover:bg-[hsl(var(--azul-respira))]/90 theme-transition min-h-[44px]"
            >
              Tentar Novamente
            </button>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 p-4 bg-zinc-100 rounded-md text-left">
                <summary className="font-medium text-zinc-900 cursor-pointer">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 text-xs text-zinc-600 whitespace-pre-wrap break-words">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
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

// ==================== LAZY LOADED COMPONENTS ====================





// Páginas principais que serão carregadas sob demanda
const DashboardRouter = React.lazy(() => import("@/pages/dashboard/DashboardRouter"))

// Páginas de autenticação (já implementadas)
const LoginPage = React.lazy(() => import("@/pages/auth/LoginPage"))
const RegisterPage = React.lazy(() => import("@/pages/auth/RegisterPage"))
const ResetPasswordPage = React.lazy(() => import("@/pages/auth/ResetPasswordPage"))
const AwaitingApprovalPage = React.lazy(() => import("@/pages/auth/AwaitingApprovalPage"))
const CompleteRegistrationPage = React.lazy(() => import("@/pages/auth/CompleteRegistrationPage"))
const CallbackPage = React.lazy(() => import("@/pages/auth/CallbackPage"))

// Páginas administrativas
const UserApprovalPage = React.lazy(() => import("@/pages/admin/UserApprovalPage"))

// ==================== PROTECTED ROUTE COMPONENT ====================

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = "/auth/login" 
}) => {
  // AI dev note: Autenticação real implementada com Supabase e RLS
  const { isAuthenticated } = useAuth()

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

// ==================== ROOT REDIRECT COMPONENT ====================

const RootRedirect: React.FC = () => {
  // AI dev note: Redirecionamento baseado em estado real de autenticação Supabase
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <FullScreenLoading message="Verificando autenticação..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/auth/login" replace />
}

// ==================== MAIN APP COMPONENT ====================

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<FullScreenLoading message="Carregando aplicação..." />}>
      <Routes>
        {/* Rota raiz - Redirecionamento baseado em autenticação */}
        <Route 
          path="/" 
          element={<RootRedirect />} 
        />

        {/* Rotas de autenticação */}
        <Route 
          path="/auth/login" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando login..." />}>
              <LoginPage />
            </React.Suspense>
          } 
        />
        <Route 
          path="/auth/register" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando cadastro..." />}>
              <RegisterPage />
            </React.Suspense>
          } 
        />
        <Route 
          path="/auth/reset-password" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando recuperação..." />}>
              <ResetPasswordPage />
            </React.Suspense>
          } 
        />
        <Route 
          path="/auth/awaiting-approval" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando..." />}>
              <AwaitingApprovalPage />
            </React.Suspense>
          } 
        />
        <Route 
          path="/auth/complete-registration" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando..." />}>
              <CompleteRegistrationPage />
            </React.Suspense>
          } 
        />
        <Route 
          path="/auth/callback" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Processando login..." />}>
              <CallbackPage />
            </React.Suspense>
          } 
        />



        {/* Rotas protegidas - Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<FullScreenLoading message="Carregando dashboard..." />}>
                <DashboardRouter />
              </React.Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Rotas protegidas - Administrativas */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<FullScreenLoading message="Carregando usuários..." />}>
                <UserApprovalPage />
              </React.Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Redirecionamentos */}
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  )
}

// ==================== APP ROOT COMPONENT ====================

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <div className="respira-kids-app">
            {/* Container principal da aplicação */}
            <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bege-fundo))] to-white">
              <AppRoutes />
            </div>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
