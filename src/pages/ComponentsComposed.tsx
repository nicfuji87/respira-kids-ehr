import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Form
} from "@/components/primitives"
import { 
  FormFieldWrapper,
  ActionMenu,
  StatusBadge,
  ActionCard,
  SearchInput,
  DataTable,
  MobileMenu,
  NavigationTabs,
  PageBreadcrumb,
  NavigationGuard
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

// Schema de validação para demonstração
const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido")
})

type FormData = z.infer<typeof formSchema>

export const ComponentsComposed = () => {
  const [searchValue, setSearchValue] = useState("")

  // React Hook Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  })

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
  }

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

  const navigationTabs = [
    { 
      id: "dashboard", 
      icon: Home, 
      label: "Dashboard", 
      badgeCount: 0,
      content: <div className="p-4 bg-blue-50 rounded-md">Conteúdo do Dashboard</div>
    },
    { 
      id: "users", 
      icon: Users, 
      label: "Usuários", 
      badgeCount: 5,
      content: <div className="p-4 bg-green-50 rounded-md">Lista de Usuários</div>
    },
    { 
      id: "calendar", 
      icon: Calendar, 
      label: "Agenda", 
      badgeCount: 12,
      content: <div className="p-4 bg-yellow-50 rounded-md">Calendário de Eventos</div>
    },
    { 
      id: "settings", 
      icon: Settings, 
      label: "Config", 
      badgeCount: 0,
      content: <div className="p-4 bg-gray-50 rounded-md">Configurações do Sistema</div>
    },
  ]

  return (
    <div className="min-h-screen bg-bege-fundo p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-roxo-titulo text-center">
              🧩 Respira KIDS - Componentes Compostos (shadcn)
            </CardTitle>
            <p className="text-center text-gray-600">
              Visualização de todos os componentes compostos baseados em shadcn/ui
            </p>
          </CardHeader>
        </Card>

        {/* Page Breadcrumb */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Page Breadcrumb (shadcn)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PageBreadcrumb items={breadcrumbItems} />
            <PageBreadcrumb items={breadcrumbItems} showHomeIcon={false} />
          </CardContent>
        </Card>

        {/* Modern Form Fields (react-hook-form + shadcn) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Form Fields (Modern - react-hook-form + shadcn)</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldWrapper
                    control={form.control}
                    name="name"
                    label="Nome Completo"
                    required
                  >
                    {(field) => (
                      <Input
                        {...field}
                        placeholder="Digite seu nome"
                        className="w-full"
                      />
                    )}
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    control={form.control}
                    name="email"
                    label="Email"
                    description="Será usado para notificações"
                    required
                  >
                    {(field) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Digite seu email"
                        className="w-full"
                      />
                    )}
                  </FormFieldWrapper>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Enviar</Button>
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Limpar
                  </Button>
                </div>
              </form>
            </Form>
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

        {/* Navigation Tabs (shadcn) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Navigation Tabs (shadcn)</CardTitle>
          </CardHeader>
          <CardContent>
            <NavigationTabs
              tabs={navigationTabs}
              defaultValue="dashboard"
            />
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

        {/* Mobile Menu (shadcn) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roxo-titulo">Mobile Menu (shadcn)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <MobileMenu
                userRole="admin"
                onNavigate={(route) => console.log('Navegar para:', route)}
              />
              <span className="text-sm text-gray-600">
                Menu lateral usando Sheet do shadcn
              </span>
            </div>
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