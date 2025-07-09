import { useState } from "react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives"
import { 
  FormField,
  ActionMenu,
  StatusBadge,
  ActionCard,
  SearchInput,
  DataTable,
  HamburgerMenu,
  TabButton,
  NavigationGuard,
  BreadcrumbNav
} from "@/components/composed"
import { 
  Home, 
  Users, 
  Calendar, 
  Settings,
  Edit,
  Trash2,
  Copy,
} from "lucide-react"

export const ComponentsComposed = () => {
  const [searchValue, setSearchValue] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  })

  const sampleData = [
    { id: 1, name: "João Silva", email: "joao@email.com", status: "active" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", status: "inactive" },
    { id: 3, name: "Pedro Oliveira", email: "pedro@email.com", status: "pending" },
  ]

  const tableColumns = [
    { 
      key: "name" as keyof typeof sampleData[0], 
      header: "Nome", 
      cell: (row: typeof sampleData[0]) => row.name 
    },
    { 
      key: "email" as keyof typeof sampleData[0], 
      header: "Email", 
      cell: (row: typeof sampleData[0]) => row.email 
    },
    { 
      key: "status" as keyof typeof sampleData[0], 
      header: "Status", 
      cell: (row: typeof sampleData[0]) => <StatusBadge status={row.status as any} />
    },
  ]

  const actionMenuItems = [
    { 
      icon: <Edit className="h-4 w-4" />, 
      label: "Editar", 
      onClick: () => console.log("Editar") 
    },
    { 
      icon: <Copy className="h-4 w-4" />, 
      label: "Duplicar", 
      onClick: () => console.log("Duplicar") 
    },
    { 
      icon: <Trash2 className="h-4 w-4" />, 
      label: "Excluir", 
      onClick: () => console.log("Excluir"),
      variant: "destructive" as const
    },
  ]

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Componentes", href: "/components" },
    { label: "Compostos", isActive: true },
  ]

  const tabItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", badgeCount: 0 },
    { id: "users", icon: Users, label: "Usuários", badgeCount: 5 },
    { id: "calendar", icon: Calendar, label: "Agenda", badgeCount: 12 },
    { id: "settings", icon: Settings, label: "Config", badgeCount: 0 },
  ]

  return (
    <div className="min-h-screen bg-bege-fundo p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-roxo-titulo text-center">
              🧩 Respira KIDS - Componentes Compostos
            </CardTitle>
            <p className="text-center text-gray-600">
              Visualização de todos os componentes compostos do sistema
            </p>
          </CardHeader>
        </Card>

        {/* Breadcrumb Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Breadcrumb Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BreadcrumbNav items={breadcrumbItems} />
            <BreadcrumbNav items={breadcrumbItems} showHomeIcon={false} />
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Form Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nome Completo"
                htmlFor="name"
                required
              >
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-azul-respira"
                  placeholder="Digite seu nome"
                />
              </FormField>

              <FormField
                label="Email"
                htmlFor="email"
                error={formData.email && !formData.email.includes('@') ? 'Email inválido' : ''}
                required
              >
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-azul-respira"
                  placeholder="Digite seu email"
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Search Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Search Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Buscar pacientes..."
              onSearch={() => console.log('Buscar:', searchValue)}
            />
            <p className="text-sm text-gray-600">
              Valor atual: {searchValue || 'Nenhum'}
            </p>
          </CardContent>
        </Card>

        {/* Status Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Status Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <StatusBadge status="active" />
              <StatusBadge status="inactive" />
              <StatusBadge status="pending" />
              <StatusBadge status="cancelled" />
              <StatusBadge status="completed" />
            </div>
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Action Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <ActionMenu 
                items={actionMenuItems}
                trigger={<Button variant="outline">Ações do Paciente</Button>}
              />
              <ActionMenu 
                items={actionMenuItems}
                trigger={<Button variant="ghost" size="icon">⋮</Button>}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Action Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionCard
                title="Novo Paciente"
                subtitle="Cadastrar novo paciente no sistema"
                actions={<Button size="sm" onClick={() => console.log('Novo paciente')}>Criar</Button>}
              />
              <ActionCard
                title="Agendamento"
                subtitle="Agendar nova consulta"
                actions={<Button size="sm" onClick={() => console.log('Agendamento')}>Agendar</Button>}
              />
              <ActionCard
                title="Relatório"
                subtitle="Gerar relatório financeiro"
                actions={<Button size="sm" onClick={() => console.log('Relatório')}>Gerar</Button>}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tab Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Tab Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex border-b">
              {tabItems.map((item) => (
                <TabButton
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeTab === item.id}
                  badgeCount={item.badgeCount}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Tab ativo: <strong>{activeTab}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={sampleData}
              columns={tableColumns}
            />
          </CardContent>
        </Card>

        {/* Hamburger Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Hamburger Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsMenuOpen(true)}>
              Abrir Menu Mobile
            </Button>
            <HamburgerMenu
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen(false)}
              onNavigate={(route) => console.log('Navegar para:', route)}
              userRole="admin"
            />
          </CardContent>
        </Card>

        {/* Navigation Guard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Navigation Guard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <NavigationGuard allowedRoles={['admin']} requireAuth={false}>
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">
                    ✅ Conteúdo visível para admin (sem autenticação)
                  </p>
                </div>
              </NavigationGuard>

              <NavigationGuard allowedRoles={['doctor']} requireAuth={false}>
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">
                    ❌ Conteúdo bloqueado para non-doctor
                  </p>
                </div>
              </NavigationGuard>

              <NavigationGuard requireAuth={false}>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800">
                    ℹ️ Conteúdo público (sem restrições)
                  </p>
                </div>
              </NavigationGuard>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ComponentsComposed 