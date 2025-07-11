import { useEffect, useState } from "react"
import { Clock, RefreshCw, LogOut, Mail, Calendar, Badge } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "@/hooks/auth/useAuth"
import { FormLayout } from "@/components/templates"
import { Button, Card, CardContent, CardHeader } from "@/components/primitives"
import { Spinner } from "@/components/primitives"


const AwaitingApprovalPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastCheck, setLastCheck] = useState(new Date())
  const { user, signOut, profileComplete } = useAuth()
  const navigate = useNavigate()

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // TODO: Implementar refresh do perfil quando necessário
        setLastCheck(new Date())
      } catch (error) {
        console.error('Erro ao verificar status:', error)
      }
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [])

  // Redirecionar se usuário foi aprovado
  useEffect(() => {
    if (user?.status === 'ativo') {
      if (!profileComplete) {
        navigate('/auth/complete-registration')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, profileComplete, navigate])

  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    try {
      // TODO: Implementar refresh do perfil quando necessário
      setLastCheck(new Date())
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      // TODO: Mostrar erro para o usuário
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/auth/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleContactSupport = () => {
    // Abrir email ou whatsapp
    window.open('mailto:suporte@respirakids.com.br?subject=Solicitação de Aprovação', '_blank')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getRegistrationDate = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt)
    }
    return new Date()
  }

  return (
    <FormLayout
      title="Quase lá!"
      description="Sua conta está sendo analisada pela nossa equipe"
      maxWidth="md"
      className="respira-bg-primary"
    >
      <div className="space-y-6">
        {/* Ilustração central */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-azul-respira to-verde-pipa rounded-full flex items-center justify-center animate-respira-pulse">
            <Clock className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-roxo-titulo">
              Aguardando aprovação
            </h2>
            <p className="text-gray-600 max-w-sm mx-auto">
              Nossa equipe está analisando seus dados. Você receberá um email assim que sua conta for aprovada.
            </p>
          </div>

          {/* Tempo estimado */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amarelo-pipa/10 text-amarelo-pipa text-sm font-medium">
            <Clock className="w-4 h-4 mr-2" />
            Tempo estimado: 24-48 horas
          </div>
        </div>

        {/* Card com informações */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-medium text-roxo-titulo">Informações da Solicitação</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Email</span>
              </div>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Solicitação</span>
              </div>
              <span className="text-sm font-medium">
                {formatDate(getRegistrationDate())}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Status</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amarelo-pipa/10 text-amarelo-pipa">
                <div className="w-2 h-2 bg-amarelo-pipa rounded-full mr-2 animate-pulse" />
                Pendente
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Última verificação</span>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(lastCheck)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Mensagem informativa */}
        <Card className="border-azul-respira/20 bg-azul-respira/5">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-azul-respira rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-roxo-titulo">
                  Você receberá um email de confirmação
                </p>
                <p className="text-sm text-gray-600">
                  Assim que sua conta for aprovada, você receberá um email em{" "}
                  <span className="font-medium">{user?.email}</span> com instruções 
                  para completar seu cadastro.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="space-y-3">
          <Button
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="w-full"
            variant="outline"
          >
            {isRefreshing ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar status
              </>
            )}
          </Button>

          <Button
            onClick={handleContactSupport}
            className="w-full"
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contatar suporte
          </Button>

          <Button
            onClick={handleLogout}
            className="w-full"
            variant="destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </div>

        {/* Indicador de auto-refresh */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Status atualizado automaticamente a cada 30 segundos
          </p>
        </div>
      </div>
    </FormLayout>
  )
}

export default AwaitingApprovalPage 