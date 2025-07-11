import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth/useAuth'
import { supabase } from '@/lib/supabase'
import FullScreenLoading from '@/pages/common/Loading'
import { Alert, AlertDescription } from '@/components/primitives/alert'
import { AlertCircle } from 'lucide-react'

// ==================== TYPES ====================

interface CallbackState {
  isLoading: boolean
  error: string | null
  status: 'processing' | 'creating_user' | 'checking_approval' | 'redirecting' | 'error'
}

// ==================== COMPONENT ====================

export const CallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isApproved, profileComplete } = useAuth()
  
  const [state, setState] = React.useState<CallbackState>({
    isLoading: true,
    error: null,
    status: 'processing'
  })

  // ==================== HANDLERS ====================

  const handleGoogleCallback = React.useCallback(async () => {
    try {
      setState(prev => ({ ...prev, status: 'processing' }))

      // Verificar se há sessão ativa
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw sessionError
      }

      if (!session?.user) {
        throw new Error('Nenhuma sessão encontrada após login')
      }

      setState(prev => ({ ...prev, status: 'creating_user' }))

      // Verificar se o usuário já existe na tabela users (por email)
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email!)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      // Se não existe, criar o usuário em estado PENDENTE
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            // AI dev note: auth_user_id será null até admin aprovar
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
            role: 'profissional', // Sugestão inicial, admin pode alterar
            is_approved: false, // Aguardando aprovação
            profile_complete: false // Perfil será completado após aprovação
          })

        if (insertError) {
          throw insertError
        }
      }

      setState(prev => ({ ...prev, status: 'checking_approval' }))

      // Aguardar um pouco para o contexto de autenticação ser atualizado
      await new Promise(resolve => setTimeout(resolve, 1000))

      setState(prev => ({ ...prev, status: 'redirecting' }))

      // AI dev note: Flow correto - Google OAuth sempre redireciona para awaiting approval
      // Usuário só consegue acessar sistema após admin aprovar (preencher user_id + aprovado_em)
      navigate('/auth/awaiting-approval', { replace: true })

    } catch (error) {
      console.error('Erro no callback do Google:', error)
      
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no callback',
        status: 'error'
      })
    }
  }, [navigate])

  // ==================== EFFECTS ====================

  // Processar callback quando componente monta
  React.useEffect(() => {
    handleGoogleCallback()
  }, [handleGoogleCallback])

  // Monitorar mudanças no estado de autenticação
  React.useEffect(() => {
    if (isAuthenticated && state.status !== 'error') {
      // Se já autenticado, redirecionar baseado no estado
      if (!isApproved) {
        navigate('/auth/awaiting-approval', { replace: true })
      } else if (!profileComplete) {
        navigate('/auth/complete-registration', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, isApproved, profileComplete, navigate, state.status])

  // ==================== RENDER ====================

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-fundo via-white to-bege-fundo/50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/images/logos/logo-respira-kids.png" 
                alt="Respira Kids" 
                className="h-16 w-auto"
              />
            </div>
          </div>

          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Erro na autenticação:</strong> {state.error}
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-4">
            <button
              onClick={() => navigate('/auth/login', { replace: true })}
              className="w-full bg-azul-respira text-white px-6 py-3 rounded-md font-medium hover:bg-azul-respira/90 transition-colors"
            >
              Voltar para Login
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-600 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Status de carregamento
  const statusMessages = {
    processing: 'Processando login...',
    creating_user: 'Criando perfil de usuário...',
    checking_approval: 'Verificando aprovação...',
    redirecting: 'Redirecionando...',
    error: 'Erro no processamento'
  }

  return (
    <FullScreenLoading 
      message={statusMessages[state.status]} 
    />
  )
}

export default CallbackPage 