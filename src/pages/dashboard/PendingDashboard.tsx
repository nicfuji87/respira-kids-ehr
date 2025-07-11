import * as React from "react"
import { ResponsiveLayout } from "@/components/templates/ResponsiveLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card"
import { Button } from "@/components/primitives/button"
import { Badge } from "@/components/primitives/badge"
import { useAuth } from "@/hooks/auth/useAuth"


// ==================== TYPES ====================

export interface PendingDashboardProps {
  className?: string
}

// ==================== COMPONENT ====================

// AI dev note: Dashboard para usuários aguardando aprovação
// Exibe status de pendência e próximos passos para o usuário

export const PendingDashboard: React.FC<PendingDashboardProps> = ({ className }) => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <ResponsiveLayout
      title="Aguardando Aprovação"
      showBackButton={false}
      className={className}
      headerActions={[
        {
          id: 'signout',
          label: 'Sair',
          variant: 'ghost',
          onClick: handleSignOut,
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )
        }
      ]}
      showBottomTabs={false}
      showSidebar={false}
    >
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bege-fundo))] to-white">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          {/* Status Card */}
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[hsl(var(--amarelo-pipa))]/20 to-[hsl(var(--azul-respira))]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[hsl(var(--amarelo-pipa))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-[hsl(var(--roxo-titulo))]">
                Cadastro em Análise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="warning" className="text-sm px-3 py-1">
                Aguardando Aprovação
              </Badge>
              
              <p className="text-zinc-600 leading-relaxed">
                Olá <strong>{user?.profile?.firstName || 'Usuário'}</strong>! 
                Seu cadastro foi recebido e está sendo analisado pela nossa equipe administrativa.
              </p>
              
              <div className="bg-[hsl(var(--bege-fundo))] rounded-lg p-4 text-left space-y-2">
                <h4 className="font-medium text-[hsl(var(--roxo-titulo))]">Dados do Cadastro:</h4>
                <div className="text-sm text-zinc-600 space-y-1">
                  <p><span className="font-medium">Nome:</span> {user?.profile?.firstName} {user?.profile?.lastName}</p>
                  <p><span className="font-medium">Email:</span> {user?.email}</p>
                  <p><span className="font-medium">Cadastrado em:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Passos Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[hsl(var(--roxo-titulo))] flex items-center gap-2">
                <svg className="w-5 h-5 text-[hsl(var(--azul-respira))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--verde-pipa))]/10 rounded-lg">
                  <div className="w-6 h-6 bg-[hsl(var(--verde-pipa))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-[hsl(var(--roxo-titulo))]">Análise Administrativa</h5>
                    <p className="text-sm text-zinc-600">Nossa equipe está verificando seus dados e documentos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--amarelo-pipa))]/10 rounded-lg">
                  <div className="w-6 h-6 bg-[hsl(var(--amarelo-pipa))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-[hsl(var(--roxo-titulo))]">Aprovação e Definição de Perfil</h5>
                    <p className="text-sm text-zinc-600">Após aprovação, você receberá um email para completar seu cadastro.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[hsl(var(--azul-respira))]/10 rounded-lg">
                  <div className="w-6 h-6 bg-[hsl(var(--azul-respira))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-[hsl(var(--roxo-titulo))]">Acesso ao Sistema</h5>
                    <p className="text-sm text-zinc-600">Após completar o cadastro, você terá acesso completo ao sistema.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Importantes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[hsl(var(--roxo-titulo))] flex items-center gap-2">
                <svg className="w-5 h-5 text-[hsl(var(--amarelo-pipa))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[hsl(var(--azul-respira))] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>O processo de aprovação geralmente leva até 24 horas</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[hsl(var(--azul-respira))] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Você receberá notificações por email sobre o status</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[hsl(var(--azul-respira))] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Mantenha seu email acessível para receber as instruções</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[hsl(var(--azul-respira))] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Em caso de dúvidas, entre em contato com nossa equipe</span>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="min-h-[44px]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Verificar Status
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="min-h-[44px]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair da Conta
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}

export default PendingDashboard 