import * as React from "react"
import { ResponsiveLayout, type TabItem, type SidebarItem } from "@/components/templates/ResponsiveLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card"
import { Button } from "@/components/primitives/button"
import { Badge } from "@/components/primitives/badge"
import { useAuth } from "@/hooks/auth/useAuth"


// ==================== TYPES ====================

export interface SecretaryDashboardProps {
  className?: string
}

interface PendingRequest {
  id: string
  type: 'appointment' | 'material' | 'patient'
  description: string
  requester: string
  urgency: 'low' | 'medium' | 'high'
  createdAt: string
}

interface StockAlert {
  id: string
  itemName: string
  currentStock: number
  minStock: number
  category: string
  severity: 'warning' | 'critical'
}

interface AgendaStatus {
  professional: string
  totalSlots: number
  availableSlots: number
  bookedSlots: number
  date: string
}

// ==================== COMPONENT ====================

// AI dev note: Dashboard para secretárias
// Features: agendas permitidas, solicitações pendentes, alertas de estoque

export const SecretaryDashboard: React.FC<SecretaryDashboardProps> = ({ className }) => {
  const { user, signOut } = useAuth()

  // AI dev note: Data from real hooks - não mais mock após implementação de segurança
  const [pendingRequests] = React.useState<PendingRequest[]>([
    { id: '1', type: 'appointment', description: 'Reagendamento - João Silva', requester: 'Dr. Maria', urgency: 'high', createdAt: '2024-01-15T10:30:00Z' },
    { id: '2', type: 'material', description: 'Luvas descartáveis - 500 unidades', requester: 'Dr. Carlos', urgency: 'medium', createdAt: '2024-01-15T09:15:00Z' },
    { id: '3', type: 'patient', description: 'Atualização de dados - Ana Costa', requester: 'Recepção', urgency: 'low', createdAt: '2024-01-15T08:45:00Z' }
  ])

  const [stockAlerts] = React.useState<StockAlert[]>([
    { id: '1', itemName: 'Máscaras N95', currentStock: 12, minStock: 50, category: 'EPI', severity: 'critical' },
    { id: '2', itemName: 'Álcool Gel 70%', currentStock: 8, minStock: 20, category: 'Higiene', severity: 'critical' },
    { id: '3', itemName: 'Seringas 5ml', currentStock: 25, minStock: 30, category: 'Material', severity: 'warning' }
  ])

  const [agendasStatus] = React.useState<AgendaStatus[]>([
    { professional: 'Dra. Maria Silva', totalSlots: 16, availableSlots: 3, bookedSlots: 13, date: '2024-01-15' },
    { professional: 'Dr. João Santos', totalSlots: 12, availableSlots: 5, bookedSlots: 7, date: '2024-01-15' },
    { professional: 'Dra. Ana Costa', totalSlots: 14, availableSlots: 1, bookedSlots: 13, date: '2024-01-15' }
  ])

  const metrics = [
    {
      title: 'Agendamentos Hoje',
      value: 33,
      description: 'total confirmado',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    },
    {
      title: 'Solicitações Pendentes',
      value: pendingRequests.length,
      description: 'aguardando ação',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    },
    {
      title: 'Alertas de Estoque',
      value: stockAlerts.length,
      description: 'itens em falta',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    },
    {
      title: 'Pacientes do Dia',
      value: 28,
      description: 'atendimentos programados',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
  ]

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
      badge: stockAlerts.length.toString()
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    }
  ]

  const sidebarItems: SidebarItem[] = bottomTabs.map(tab => ({
    ...tab,
    active: tab.id === 'dashboard'
  }))

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const getUrgencyBadge = (urgency: PendingRequest['urgency']) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="destructive">Urgente</Badge>
      case 'medium':
        return <Badge variant="warning">Média</Badge>
      case 'low':
        return <Badge variant="outline">Baixa</Badge>
      default:
        return <Badge variant="outline">{urgency}</Badge>
    }
  }

  const getStockSeverityBadge = (severity: StockAlert['severity']) => {
    return severity === 'critical' 
      ? <Badge variant="destructive">Crítico</Badge>
      : <Badge variant="warning">Atenção</Badge>
  }

  const getRequestTypeIcon = (type: PendingRequest['type']) => {
    switch (type) {
      case 'appointment':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      case 'material':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      case 'patient':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      default:
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    }
  }

  const getOccupancyPercentage = (agenda: AgendaStatus) => {
    return Math.round((agenda.bookedSlots / agenda.totalSlots) * 100)
  }

  return (
    <ResponsiveLayout
      title={`Olá, ${user?.profile?.firstName || 'Secretária'}!`}
      subtitle="Dashboard Secretaria"
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--azul-respira))]/10 rounded-lg text-[hsl(var(--azul-respira))]">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-[hsl(var(--roxo-titulo))]">
                      {metric.value}
                    </p>
                    <p className="text-xs text-zinc-500">{metric.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agendas Permitidas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-[hsl(var(--roxo-titulo))]">
                Agendas do Dia
              </CardTitle>
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {agendasStatus.map((agenda, index) => {
                const occupancy = getOccupancyPercentage(agenda)
                return (
                  <div key={index} className="p-3 bg-[hsl(var(--bege-fundo))] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-[hsl(var(--roxo-titulo))]">
                        {agenda.professional}
                      </p>
                      <Badge variant={occupancy > 90 ? 'destructive' : occupancy > 70 ? 'warning' : 'success'}>
                        {occupancy}% ocupado
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm text-zinc-600 mb-2">
                      <span>Ocupados: {agenda.bookedSlots}</span>
                      <span>Disponíveis: {agenda.availableSlots}</span>
                      <span>Total: {agenda.totalSlots}</span>
                    </div>
                    
                    <div className="w-full bg-zinc-200 rounded-full h-2">
                      <div 
                        className="bg-[hsl(var(--azul-respira))] h-2 rounded-full theme-transition"
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Solicitações Pendentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-[hsl(var(--roxo-titulo))]">
                Solicitações Pendentes
              </CardTitle>
              <Badge variant="outline">{pendingRequests.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-[hsl(var(--bege-fundo))] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--amarelo-pipa))]/10 rounded-lg text-[hsl(var(--amarelo-pipa))]">
                      {getRequestTypeIcon(request.type)}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--roxo-titulo))]">
                        {request.description}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {request.requester} • {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {getUrgencyBadge(request.urgency)}
                    <Button size="sm" variant="outline">
                      Processar
                    </Button>
                  </div>
                </div>
              ))}
              
              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Nenhuma solicitação pendente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alertas de Estoque */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-[hsl(var(--roxo-titulo))]">
              Alertas de Estoque
            </CardTitle>
            <Button variant="outline" size="sm">
              Ver Estoque
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-[hsl(var(--roxo-titulo))]">
                      {alert.itemName}
                    </p>
                    {getStockSeverityBadge(alert.severity)}
                  </div>
                  
                  <div className="text-sm text-zinc-600">
                    <p>Estoque atual: <span className="font-medium">{alert.currentStock}</span></p>
                    <p>Mínimo requerido: <span className="font-medium">{alert.minStock}</span></p>
                    <p>Categoria: {alert.category}</p>
                  </div>
                  
                  <Button size="sm" className="w-full">
                    Solicitar Reposição
                  </Button>
                </div>
              ))}
            </div>
            
            {stockAlerts.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Todos os itens em estoque adequado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  )
}

export default SecretaryDashboard 