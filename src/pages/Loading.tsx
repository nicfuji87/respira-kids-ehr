import * as React from "react"
import { cn } from "@/lib/utils"

// ==================== TYPES ====================

export interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'overlay' | 'inline' | 'minimal'
  message?: string
  showMessage?: boolean
  showProgress?: boolean
  progress?: number
  fullScreen?: boolean
}

// ==================== COMPONENT ====================

export const Loading: React.FC<LoadingProps> = ({
  className,
  size = 'md',
  variant = 'default',
  message = 'Carregando...',
  showMessage = true,
  showProgress = false,
  progress = 0,
  fullScreen = false
}) => {
  // Tamanhos do spinner
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  // Container principal baseado na variante
  const containerClasses = {
    default: 'flex flex-col items-center justify-center p-8',
    overlay: 'fixed inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center z-50',
    inline: 'flex items-center gap-3 py-2',
    minimal: 'flex items-center justify-center'
  }

  // Componente do Spinner
  const Spinner = () => (
    <div className={cn(
      "relative flex items-center justify-center",
      sizeClasses[size]
    )}>
      {/* Círculo externo com rotação */}
      <div className={cn(
        "absolute inset-0 rounded-full border-4 border-transparent border-t-[hsl(var(--azul-respira))] border-r-[hsl(var(--verde-pipa))]",
        "animate-spin"
      )}></div>
      
      {/* Círculo do meio com respira-pulse */}
      <div className={cn(
        "absolute inset-2 rounded-full border-2 border-transparent border-t-[hsl(var(--amarelo-pipa))] border-l-[hsl(var(--vermelho-kids))]",
        "animate-respira-pulse"
      )}></div>
      
      {/* Centro com gradiente */}
      <div className={cn(
        "w-3 h-3 rounded-full",
        "bg-gradient-to-br from-[hsl(var(--azul-respira))] to-[hsl(var(--verde-pipa))]",
        "animate-respira-pulse"
      )} style={{ animationDelay: '0.5s' }}></div>
    </div>
  )

  // Componente da Barra de Progresso
  const ProgressBar = () => (
    showProgress && (
      <div className="w-full max-w-xs bg-zinc-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[hsl(var(--azul-respira))] to-[hsl(var(--verde-pipa))] rounded-full theme-transition"
          style={{ 
            width: `${Math.min(100, Math.max(0, progress))}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        ></div>
      </div>
    )
  )

  // Componente da Mensagem
  const Message = () => (
    showMessage && message && (
      <div className="text-center space-y-2">
        <p className={cn(
          "font-medium text-[hsl(var(--roxo-titulo))]",
          {
            'text-sm': size === 'sm',
            'text-base': size === 'md',
            'text-lg': size === 'lg',
            'text-xl': size === 'xl'
          }
        )}>
          {message}
        </p>
        
        {showProgress && (
          <p className="text-sm text-zinc-600">
            {progress}% concluído
          </p>
        )}
      </div>
    )
  )

  // Elementos decorativos para variantes não-minimal
  const DecorativeElements = () => (
    variant !== 'minimal' && variant !== 'inline' && (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Bolhas animadas */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-[hsl(var(--amarelo-pipa))]/10 rounded-full blur-xl animate-respira-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-[hsl(var(--verde-pipa))]/10 rounded-full blur-xl animate-respira-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/6 w-8 h-8 bg-[hsl(var(--azul-respira))]/10 rounded-full blur-xl animate-respira-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Partículas flutuantes */}
        <div className="absolute top-1/5 right-1/3 w-2 h-2 bg-[hsl(var(--amarelo-pipa))]/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/5 left-1/3 w-1.5 h-1.5 bg-[hsl(var(--verde-pipa))]/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-[hsl(var(--azul-respira))]/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>
    )
  )

  // Renderização do componente baseado na variante
  if (variant === 'inline') {
    return (
      <div className={cn(containerClasses[variant], className)}>
        <Spinner />
        <Message />
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn(containerClasses[variant], className)}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={cn(
      containerClasses[variant],
      {
        'min-h-screen bg-gradient-to-br from-[hsl(var(--bege-fundo))] to-white': 
          fullScreen || variant === 'default',
        'bg-[hsl(var(--bege-fundo))]/95': 
          variant === 'overlay'
      },
      "theme-transition relative",
      className
    )}>
      <DecorativeElements />
      
      {/* Container do conteúdo */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Spinner />
        <Message />
        <ProgressBar />
        
        {/* Indicador de pontos animados */}
        {variant === 'default' && (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[hsl(var(--azul-respira))] rounded-full animate-respira-pulse"></div>
            <div className="w-2 h-2 bg-[hsl(var(--verde-pipa))] rounded-full animate-respira-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-[hsl(var(--amarelo-pipa))] rounded-full animate-respira-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== SPECIALIZED VARIANTS ====================

// Loading de tela cheia
export const FullScreenLoading: React.FC<Omit<LoadingProps, 'variant' | 'fullScreen'>> = (props) => (
  <Loading {...props} variant="default" fullScreen />
)

// Loading overlay (para usar sobre conteúdo existente)
export const OverlayLoading: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="overlay" />
)

// Loading inline (para usar dentro de componentes)
export const InlineLoading: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="inline" />
)

// Loading minimal (apenas o spinner)
export const MinimalLoading: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="minimal" />
)

// Hook para controlar loading
export const useLoading = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string>('Carregando...')
  const [progress, setProgress] = React.useState<number>(0)

  const showLoading = React.useCallback((loadingMessage?: string) => {
    setMessage(loadingMessage || 'Carregando...')
    setProgress(0)
    setIsLoading(true)
  }, [])

  const hideLoading = React.useCallback(() => {
    setIsLoading(false)
    setProgress(0)
  }, [])

  const updateProgress = React.useCallback((newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)))
  }, [])

  const updateMessage = React.useCallback((newMessage: string) => {
    setMessage(newMessage)
  }, [])

  return {
    isLoading,
    message,
    progress,
    showLoading,
    hideLoading,
    updateProgress,
    updateMessage
  }
}

export default Loading 