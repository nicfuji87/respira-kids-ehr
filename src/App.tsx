import * as React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { FullScreenLoading } from "@/pages/Loading"
import { NotFound } from "@/pages/NotFound"
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

            {process.env.NODE_ENV === 'development' && this.state.error && (
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

// Componente placeholder para páginas em desenvolvimento
const PlaceholderPage: React.FC<{ pageName: string }> = ({ pageName }) => (
  <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bege-fundo))] to-white flex flex-col items-center justify-center px-4 py-8">
    <div className="max-w-md w-full text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-[hsl(var(--azul-respira))]/10 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-[hsl(var(--azul-respira))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-[hsl(var(--roxo-titulo))]">
          {pageName}
        </h1>
        <p className="text-base text-zinc-600">
          Esta página está em desenvolvimento e será implementada em breve.
        </p>
      </div>
      <div className="flex gap-1 justify-center">
        <div className="w-2 h-2 bg-[hsl(var(--azul-respira))] rounded-full animate-respira-pulse"></div>
        <div className="w-2 h-2 bg-[hsl(var(--verde-pipa))] rounded-full animate-respira-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-[hsl(var(--amarelo-pipa))] rounded-full animate-respira-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
)

// Função helper para criar lazy components com fallback
const createLazyPage = (pagePath: string, pageName: string) => 
  React.lazy(async () => {
    try {
      return await import(/* @vite-ignore */ pagePath)
    } catch {
      return { default: () => <PlaceholderPage pageName={pageName} /> }
    }
  })

// Páginas principais que serão carregadas sob demanda
const HomePage = createLazyPage("@/pages/HomePage", "Página Inicial")
const LoginPage = createLazyPage("@/pages/LoginPage", "Login")
const DashboardPage = createLazyPage("@/pages/DashboardPage", "Dashboard")
const ComponentsPreview = React.lazy(() => import("@/pages/ComponentsPreview"))
const ComponentsComposed = React.lazy(() => import("@/pages/ComponentsComposed"))

// ==================== PROTECTED ROUTE COMPONENT ====================

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login" 
}) => {
  // TODO: Implementar lógica de proteção usando useAuth
  // const { isAuthenticated } = useAuth()
  
  // Por enquanto, permite acesso a todas as rotas (placeholder)
  const isAuthenticated = false // Será substituído pela lógica real

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

// ==================== MAIN APP COMPONENT ====================

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<FullScreenLoading message="Carregando aplicação..." />}>
      <Routes>
        {/* Rota pública - Home */}
        <Route 
          path="/" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando página inicial..." />}>
              <HomePage />
            </React.Suspense>
          } 
        />

        {/* Rota pública - Login */}
        <Route 
          path="/login" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando login..." />}>
              <LoginPage />
            </React.Suspense>
          } 
        />

        {/* Rota de desenvolvimento - Visualização de Componentes */}
        <Route 
          path="/components" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando componentes..." />}>
              <ComponentsPreview />
            </React.Suspense>
          } 
        />

        {/* Rota de desenvolvimento - Componentes Compostos */}
        <Route 
          path="/components-composed" 
          element={
            <React.Suspense fallback={<FullScreenLoading message="Carregando componentes compostos..." />}>
              <ComponentsComposed />
            </React.Suspense>
          } 
        />

        {/* Rotas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<FullScreenLoading message="Carregando dashboard..." />}>
                <DashboardPage />
              </React.Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Redirecionamentos */}
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

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
      <BrowserRouter>
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
