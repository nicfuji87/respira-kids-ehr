import * as React from "react"
import { Button } from "@/components/primitives/button"
import { cn } from "@/lib/utils"

// ==================== TYPES ====================

export interface NotFoundProps {
  className?: string
  title?: string
  message?: string
  showBackButton?: boolean
  onBackClick?: () => void
  customAction?: React.ReactNode
}

// ==================== COMPONENT ====================

export const NotFound: React.FC<NotFoundProps> = ({
  className,
  title = "Ops! Página não encontrada",
  message = "A página que você está procurando não existe ou foi movida. Que tal voltarmos para um lugar seguro?",
  showBackButton = true,
  onBackClick,
  customAction
}) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      // Fallback: tentar voltar no histórico ou ir para home
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = '/'
      }
    }
  }

  const handleHomeClick = () => {
    window.location.href = '/'
  }

  return (
    <div className={cn(
      // Container principal com altura total e centralização
      "min-h-screen bg-gradient-to-br from-[hsl(var(--bege-fundo))] to-white",
      "flex flex-col items-center justify-center px-4 py-8",
      "theme-transition",
      className
    )}>
      {/* Container do conteúdo */}
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Ilustração 404 */}
        <div className="relative">
          {/* Círculo de fundo com gradiente */}
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-[hsl(var(--azul-respira))]/20 to-[hsl(var(--verde-pipa))]/20 rounded-full flex items-center justify-center relative overflow-hidden">
            
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-4 left-4 w-6 h-6 bg-[hsl(var(--amarelo-pipa))]/30 rounded-full animate-respira-pulse"></div>
            <div className="absolute bottom-6 right-6 w-4 h-4 bg-[hsl(var(--verde-pipa))]/40 rounded-full animate-respira-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-4 w-3 h-3 bg-[hsl(var(--azul-respira))]/30 rounded-full animate-respira-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Número 404 */}
            <div className="text-6xl md:text-7xl font-bold text-[hsl(var(--roxo-titulo))] relative z-10">
              4
              <span className="text-[hsl(var(--azul-respira))]">0</span>
              <span className="text-[hsl(var(--verde-pipa))]">4</span>
            </div>
            
            {/* Emoji flutuante */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce">
              🌟
            </div>
          </div>
          
          {/* Sombra suave */}
          <div className="absolute inset-0 top-4 w-48 h-48 mx-auto bg-[hsl(var(--azul-respira))]/5 rounded-full blur-xl -z-10"></div>
        </div>

        {/* Título */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[hsl(var(--roxo-titulo))] leading-tight">
            {title}
          </h1>
          
          <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Ações */}
        <div className="space-y-4">
          {customAction ? (
            customAction
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={handleBackClick}
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar
                </Button>
              )}
              
              <Button
                onClick={handleHomeClick}
                className="w-full sm:w-auto min-w-[120px]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Ir para Início
              </Button>
            </div>
          )}
        </div>

        {/* Dica amigável */}
        <div className="bg-[hsl(var(--azul-respira))]/5 border border-[hsl(var(--azul-respira))]/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-[hsl(var(--azul-respira))]/10 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-[hsl(var(--azul-respira))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-zinc-700">
              <p className="font-medium mb-1">💡 Dica:</p>
              <p>Verifique se o endereço está correto ou use o menu de navegação para encontrar o que você precisa.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos de fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Bolhas flutuantes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[hsl(var(--verde-pipa))]/5 rounded-full blur-xl animate-respira-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[hsl(var(--amarelo-pipa))]/5 rounded-full blur-xl animate-respira-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-[hsl(var(--azul-respira))]/5 rounded-full blur-xl animate-respira-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  )
}

export default NotFound 