import * as React from "react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { Heart, Shield, Mail, Phone, MapPin } from "lucide-react"

// AI dev note: Layout padronizado para páginas de autenticação
// Usa gradiente suave, tema Respira KIDS e é 100% responsivo

export interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  showLogo?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function AuthLayout({
  children,
  title,
  description,
  showLogo = true,
  maxWidth = 'md',
  className
}: AuthLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-bege-fundo via-white to-azul-respira/10",
      "flex flex-col",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_var(--azul-respira)_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      {/* Header com Logo */}
      {showLogo && (
        <header className="relative z-10 w-full pt-8 pb-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <Link
                to="/"
                className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-azul-respira to-roxo-titulo rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-roxo-titulo">
                    Respira KIDS
                  </h1>
                  <p className="text-sm text-azul-respira -mt-1">
                    Cuidando com amor
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Conteúdo Principal */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className={cn(
          "w-full",
          maxWidthClasses[maxWidth],
          "animate-in fade-in-50 slide-in-from-bottom-4 duration-700"
        )}>
          {/* Título e Descrição Opcional */}
          {(title || description) && (
            <div className="text-center mb-8">
              {title && (
                <h2 className="text-3xl font-bold text-roxo-titulo mb-2">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-muted-foreground text-lg">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Conteúdo das Páginas */}
          <div className="transform transition-all duration-500 hover:scale-[1.02]">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            {/* Links Úteis */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/about"
                className="text-muted-foreground hover:text-azul-respira transition-colors"
              >
                Sobre Nós
              </Link>
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-azul-respira transition-colors"
              >
                Privacidade
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-azul-respira transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                to="/support"
                className="text-muted-foreground hover:text-azul-respira transition-colors"
              >
                Suporte
              </Link>
            </div>

            {/* Informações de Contato */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>contato@respirakids.com</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>São Paulo, SP</span>
              </div>
            </div>

            {/* Recursos de Segurança */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Ambiente seguro e protegido</span>
            </div>

            {/* Copyright */}
            <div className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} Respira KIDS. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Elements para Animação */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-amarelo-pipa/30 rounded-full animate-pulse" />
      <div className="absolute top-40 right-16 w-3 h-3 bg-verde-pipa/30 rounded-full animate-pulse delay-300" />
      <div className="absolute bottom-32 left-20 w-2 h-2 bg-azul-respira/30 rounded-full animate-pulse delay-700" />
      <div className="absolute bottom-20 right-10 w-1 h-1 bg-roxo-titulo/30 rounded-full animate-pulse delay-1000" />
    </div>
  )
}

// Componente de Loading para usar no AuthLayout
export function AuthLayoutLoading() {
  return (
    <AuthLayout showLogo={false}>
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-azul-respira to-roxo-titulo rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-medium text-roxo-titulo">
              Carregando...
            </h2>
            <p className="text-sm text-muted-foreground">
              Aguarde um momento
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

// Componente de Erro para usar no AuthLayout
export function AuthLayoutError({ 
  title = "Ops! Algo deu errado",
  message = "Ocorreu um erro inesperado. Tente novamente.",
  onRetry
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <AuthLayout>
      <div className="text-center p-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-roxo-titulo mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground mb-6">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-azul-respira text-white rounded-lg hover:bg-azul-respira/90 transition-colors"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    </AuthLayout>
  )
} 