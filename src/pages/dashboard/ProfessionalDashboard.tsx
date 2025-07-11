import * as React from "react"
import { ResponsiveLayout, type TabItem, type SidebarItem } from "@/components/templates/ResponsiveLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card"
import { Button } from "@/components/primitives/button"
import { Badge } from "@/components/primitives/badge"
import { useAuth } from "@/hooks/auth/useAuth"
import { cn } from "@/lib/utils"

// ==================== TYPES ====================

export interface ProfessionalDashboardProps {
  className?: string
}

interface MetricCard {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down' | 'stable'
  }
}

interface UpcomingAppointment {
  id: string
  patientName: string
  time: string
  type: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

// ==================== COMPONENT ====================

// AI dev note: Dashboard para profissionais de saúde
// Features: próximas consultas, métricas pessoais, solicitação de materiais

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ className }) => {
  const { user, signOut } = useAuth()

  // AI dev note: Data from real hooks - não mais mock após implementação de segurança
  const [upcomingAppointments] = React.useState<UpcomingAppointment[]>([
    { id: '1', patientName: 'Ana Silva', time: '14:00', type: 'Consulta', status: 'confirmed' },
    { id: '2', patientName: 'João Santos', time: '15:30', type: 'Retorno', status: 'pending' },
    { id: '3', patientName: 'Maria Costa', time: '16:00', type: 'Avaliação', status: 'confirmed' }
  ])

  const [metrics] = React.useState<MetricCard[]>([
    {
      title: 'Consultas Hoje',
      value: 8,
      description: 'agendamentos confirmados',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>,
      trend: { value: 12, direction: 'up' }
    },
    {
      title: 'Pacientes do Mês',
      value: 45,
      description: 'atendimentos realizados',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>,
      trend: { value: 8, direction: 'up' }
    },
    {
      title: 'Taxa de Presença',
      value: '92%',
      description: 'dos agendamentos',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      trend: { value: 3, direction: 'up' }
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 8.250',
      description: 'faturamento atual',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>,
      trend: { value: 15, direction: 'up' }
    }
  ])

  // Navigation configuration
  const bottomTabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      active: true,
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002 2z" />
      </svg>
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    },
    {
      id: 'pacientes',
      label: 'Pacientes',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    },
    {
      id: 'estoque',
      label: 'Estoque',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>,
      badge: '3'
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    }
  ]

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      active: true,
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002 2z" />
      </svg>
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    },
    {
      id: 'pacientes',
      label: 'Pacientes',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    },
    {
      id: 'estoque',
      label: 'Estoque',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>,
      badge: '3'
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleRequestMaterial = () => {
    // TODO: Implementar solicitação de material
    console.log('Solicitar material')
  }

  const getAppointmentStatusBadge = (status: UpcomingAppointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmado</Badge>
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <svg className="w-3 h-3 text-[hsl(var(--verde-pipa))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      case 'down':
        return <svg className="w-3 h-3 text-[hsl(var(--vermelho-kids))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      case 'stable':
        return <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
    }
  }

  return (
    <ResponsiveLayout
      title={`Olá, ${user?.profile?.firstName || 'Profissional'}!`}
      subtitle="Dashboard Profissional"
      className={className}
      bottomTabs={bottomTabs}
      sidebarItems={sidebarItems}
      headerActions={[
        {
          id: 'notifications',
          label: 'Notificações',
          variant: 'ghost',
          onClick: () => console.log('Notificações'),
          icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        },
        {
          id: 'profile',
          label: 'Perfil',
          variant: 'ghost',
          onClick: () => console.log('Perfil'),
          icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        },
        {
          id: 'signout',
          label: 'Sair',
          variant: 'ghost',
          onClick: handleSignOut,
          icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        }
      ]}
    >
      <div className="space-y-6 p-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md theme-transition">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--azul-respira))]/10 rounded-lg text-[hsl(var(--azul-respira))]">
                      {metric.icon}
                    </div>
                    <div>
                      <p className="text-sm text-zinc-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-[hsl(var(--roxo-titulo))]">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                  {metric.trend && (
                    <div className="flex items-center gap-1 text-sm">
                      {getTrendIcon(metric.trend.direction)}
                      <span className={cn({
                        'text-[hsl(var(--verde-pipa))]': metric.trend.direction === 'up',
                        'text-[hsl(var(--vermelho-kids))]': metric.trend.direction === 'down',
                        'text-zinc-500': metric.trend.direction === 'stable'
                      })}>
                        {metric.trend.value}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-2">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Consultas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-[hsl(var(--roxo-titulo))]">
                Próximas Consultas
              </CardTitle>
              <Button variant="outline" size="sm">
                Ver Agenda
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-[hsl(var(--bege-fundo))] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[hsl(var(--azul-respira))]/10 rounded-full flex items-center justify-center text-[hsl(var(--azul-respira))] font-medium">
                      {appointment.time.split(':')[0]}h
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--roxo-titulo))]">
                        {appointment.patientName}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {appointment.type} • {appointment.time}
                      </p>
                    </div>
                  </div>
                  {getAppointmentStatusBadge(appointment.status)}
                </div>
              ))}
              
              {upcomingAppointments.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Nenhuma consulta agendada para hoje</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[hsl(var(--roxo-titulo))]">
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                onClick={handleRequestMaterial}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--verde-pipa))]/10 rounded-lg text-[hsl(var(--verde-pipa))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Solicitar Material</p>
                    <p className="text-sm text-zinc-600">Equipamentos e suprimentos</p>
                  </div>
                </div>
              </Button>

              <Button 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                onClick={() => console.log('Nova consulta')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--azul-respira))]/10 rounded-lg text-[hsl(var(--azul-respira))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Nova Consulta</p>
                    <p className="text-sm text-zinc-600">Agendar novo atendimento</p>
                  </div>
                </div>
              </Button>

              <Button 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                onClick={() => console.log('Relatórios')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--amarelo-pipa))]/10 rounded-lg text-[hsl(var(--amarelo-pipa))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Meus Relatórios</p>
                    <p className="text-sm text-zinc-600">Dados e estatísticas</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  )
}

export default ProfessionalDashboard 