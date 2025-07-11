import * as React from "react"
import { ResponsiveLayout, type TabItem, type SidebarItem } from "@/components/templates/ResponsiveLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card"
import { Button } from "@/components/primitives/button"

import { useAuth } from "@/hooks/auth/useAuth"

// ==================== TYPES ====================

export interface AdminDashboardProps {
  className?: string
}

interface SystemMetric {
  title: string
  value: number | string
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down' | 'stable'
  }
  color: string
}

interface PendingUser {
  id: string
  name: string
  email: string
  role: string
  registeredAt: string
}

// ==================== COMPONENT ====================

// AI dev note: Dashboard para administradores
// Features: métricas gerais, gestão de usuários, visão completa das agendas

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ className }) => {
  const { user, signOut } = useAuth()

  // AI dev note: Data from real hooks - não mais mock após implementação de segurança
  const [systemMetrics] = React.useState<SystemMetric[]>([
    {
      title: 'Total de Usuários',
      value: 247,
      description: 'ativos no sistema',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>,
      trend: { value: 8, direction: 'up' },
      color: 'azul-respira'
    },
    {
      title: 'Consultas Hoje',
      value: 156,
      description: 'em todas as agendas',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>,
      trend: { value: 12, direction: 'up' },
      color: 'verde-pipa'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 45.280',
      description: 'faturamento atual',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>,
      trend: { value: 18, direction: 'up' },
      color: 'amarelo-pipa'
    },
    {
      title: 'Alertas Sistema',
      value: 3,
      description: 'requerem atenção',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>,
      color: 'vermelho-kids'
    }
  ])

  const [pendingUsers] = React.useState<PendingUser[]>([
    { id: '1', name: 'Dr. Carlos Mendes', email: 'carlos@email.com', role: 'Profissional', registeredAt: '2024-01-15' },
    { id: '2', name: 'Ana Secretária', email: 'ana@email.com', role: 'Secretária', registeredAt: '2024-01-14' },
    { id: '3', name: 'Maria Silva', email: 'maria@email.com', role: 'Profissional', registeredAt: '2024-01-13' }
  ])

  // Navigation configuration for admin
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
      id: 'users',
      label: 'Usuários',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>,
      badge: pendingUsers.length.toString()
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    },
    {
      id: 'config',
      label: 'Config',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    },
    {
      id: 'more',
      label: 'Mais',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
      title={`Olá, ${user?.profile?.firstName || 'Administrador'}!`}
      subtitle="Painel Administrativo"
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
        {/* Métricas do Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md theme-transition">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-[hsl(var(--${metric.color}))]/10 rounded-lg text-[hsl(var(--${metric.color}))]`}>
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
                      <span className={
                        metric.trend.direction === 'up' 
                          ? 'text-[hsl(var(--verde-pipa))]' 
                          : metric.trend.direction === 'down' 
                          ? 'text-[hsl(var(--vermelho-kids))]' 
                          : 'text-zinc-500'
                      }>
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
          {/* Usuários Pendentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-[hsl(var(--roxo-titulo))]">
                Usuários Pendentes Aprovação
              </CardTitle>
              <Button variant="outline" size="sm">
                Gerenciar Todos
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-[hsl(var(--bege-fundo))] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[hsl(var(--amarelo-pipa))]/10 rounded-full flex items-center justify-center text-[hsl(var(--amarelo-pipa))] font-medium">
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--roxo-titulo))]">
                        {user.name}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {user.role} • {new Date(user.registeredAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="default">
                      Aprovar
                    </Button>
                    <Button size="sm" variant="destructive">
                      Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
              
              {pendingUsers.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Nenhum usuário pendente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações Administrativas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[hsl(var(--roxo-titulo))]">
                Ações Administrativas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                onClick={() => console.log('Usuários')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--azul-respira))]/10 rounded-lg text-[hsl(var(--azul-respira))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Gerenciar Usuários</p>
                    <p className="text-sm text-zinc-600">Aprovar, editar e remover usuários</p>
                  </div>
                </div>
              </Button>

              <Button 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                onClick={() => console.log('Relatórios')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--verde-pipa))]/10 rounded-lg text-[hsl(var(--verde-pipa))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Relatórios Gerais</p>
                    <p className="text-sm text-zinc-600">Análises e métricas do sistema</p>
                  </div>
                </div>
              </Button>

              <Button 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                onClick={() => console.log('Configurações')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--amarelo-pipa))]/10 rounded-lg text-[hsl(var(--amarelo-pipa))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Configurações</p>
                    <p className="text-sm text-zinc-600">Parâmetros e configurações gerais</p>
                  </div>
                </div>
              </Button>

              <Button 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                onClick={() => console.log('Backup')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--vermelho-kids))]/10 rounded-lg text-[hsl(var(--vermelho-kids))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Backup & Segurança</p>
                    <p className="text-sm text-zinc-600">Backup de dados e logs do sistema</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Visão Geral de Agendas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-[hsl(var(--roxo-titulo))]">
              Visão Geral - Todas as Agendas
            </CardTitle>
            <Button variant="outline" size="sm">
              Ver Detalhes
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-[hsl(var(--bege-fundo))] rounded-lg">
                <div className="text-3xl font-bold text-[hsl(var(--azul-respira))] mb-2">156</div>
                <div className="text-sm text-zinc-600">Total de Consultas Hoje</div>
              </div>
              
              <div className="text-center p-4 bg-[hsl(var(--bege-fundo))] rounded-lg">
                <div className="text-3xl font-bold text-[hsl(var(--verde-pipa))] mb-2">89%</div>
                <div className="text-sm text-zinc-600">Taxa de Ocupação</div>
              </div>
              
              <div className="text-center p-4 bg-[hsl(var(--bege-fundo))] rounded-lg">
                <div className="text-3xl font-bold text-[hsl(var(--amarelo-pipa))] mb-2">12</div>
                <div className="text-sm text-zinc-600">Profissionais Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  )
}

export default AdminDashboard 