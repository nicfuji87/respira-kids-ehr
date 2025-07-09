/**
 * Component Registry - Respira Kids EHR
 * 
 * Sistema de registro de componentes organizados por hierarquia:
 * - Primitives: Componentes básicos reutilizáveis
 * - Composed: Componentes que combinam primitivos
 * - Domain: Componentes específicos do domínio EHR
 * - Templates: Layouts e estruturas de página
 * 
 * @example
 * ```typescript
 * import { findComponent, COMPONENT_REGISTRY } from 'src/components/_registry/component-map'
 * 
 * const button = findComponent('Button')
 * const loginForm = COMPONENT_REGISTRY.domain.auth.LoginForm
 * ```
 */

// ==================== TYPES ====================

export type ComponentCategory = 'primitives' | 'composed' | 'domain' | 'templates'

export type ComponentLevel = 'basic' | 'intermediate' | 'advanced'

export interface ComponentMeta {
  name: string
  category: ComponentCategory
  level: ComponentLevel
  description: string
  path: string
  dependencies: string[]
  examples?: string[]
  deprecated?: boolean
  version: string
}

export interface DomainCategory {
  auth: Record<string, ComponentMeta>
  patient: Record<string, ComponentMeta>
  appointment: Record<string, ComponentMeta>
  financial: Record<string, ComponentMeta>
  stock: Record<string, ComponentMeta>
  dashboard: Record<string, ComponentMeta>
  webhooks: Record<string, ComponentMeta>
  config: Record<string, ComponentMeta>
  profile: Record<string, ComponentMeta>
  contracts: Record<string, ComponentMeta>
}

export interface ComponentRegistry {
  primitives: Record<string, ComponentMeta>
  composed: Record<string, ComponentMeta>
  domain: DomainCategory
  templates: Record<string, ComponentMeta>
}

// ==================== REGISTRY ====================

export const COMPONENT_REGISTRY: ComponentRegistry = {
  // ========== PRIMITIVES ==========
  primitives: {
    Button: {
      name: 'Button',
      category: 'primitives',
      level: 'basic',
      description: 'Botão básico com variantes e estados',
      path: 'src/components/primitives/Button',
      dependencies: [],
      examples: ['<Button variant="primary">Click me</Button>'],
      version: '1.0.0'
    },
    Input: {
      name: 'Input',
      category: 'primitives',
      level: 'basic',
      description: 'Campo de entrada de texto',
      path: 'src/components/primitives/Input',
      dependencies: [],
      examples: ['<Input placeholder="Digite aqui..." />'],
      version: '1.0.0'
    },
    Label: {
      name: 'Label',
      category: 'primitives',
      level: 'basic',
      description: 'Rótulo para campos de formulário',
      path: 'src/components/primitives/Label',
      dependencies: [],
      examples: ['<Label htmlFor="email">Email</Label>'],
      version: '1.0.0'
    },
    Badge: {
      name: 'Badge',
      category: 'primitives',
      level: 'basic',
      description: 'Indicador de status ou categoria',
      path: 'src/components/primitives/Badge',
      dependencies: [],
      examples: ['<Badge variant="success">Ativo</Badge>'],
      version: '1.0.0'
    },
    Card: {
      name: 'Card',
      category: 'primitives',
      level: 'basic',
      description: 'Container básico para conteúdo',
      path: 'src/components/primitives/Card',
      dependencies: [],
      examples: ['<Card>Conteúdo do card</Card>'],
      version: '1.0.0'
    },
    Modal: {
      name: 'Modal',
      category: 'primitives',
      level: 'intermediate',
      description: 'Janela modal sobreposta',
      path: 'src/components/primitives/Modal',
      dependencies: [],
      examples: ['<Modal isOpen={true}>Conteúdo modal</Modal>'],
      version: '1.0.0'
    },
    Spinner: {
      name: 'Spinner',
      category: 'primitives',
      level: 'basic',
      description: 'Indicador de carregamento',
      path: 'src/components/primitives/Spinner',
      dependencies: [],
      examples: ['<Spinner size="md" />'],
      version: '1.0.0'
    },
    Avatar: {
      name: 'Avatar',
      category: 'primitives',
      level: 'basic',
      description: 'Imagem de perfil circular',
      path: 'src/components/primitives/Avatar',
      dependencies: [],
      examples: ['<Avatar src="/avatar.jpg" alt="Nome" />'],
      version: '1.0.0'
    }
  },

  // ========== COMPOSED ==========
  composed: {
    FormField: {
      name: 'FormField',
      category: 'composed',
      level: 'intermediate',
      description: 'Campo de formulário com label e validação',
      path: 'src/components/composed/FormField',
      dependencies: ['Input', 'Label'],
      examples: ['<FormField name="email" label="Email" />'],
      version: '1.0.0'
    },
    SearchInput: {
      name: 'SearchInput',
      category: 'composed',
      level: 'intermediate',
      description: 'Campo de busca com ícone e filtros',
      path: 'src/components/composed/SearchInput',
      dependencies: ['Input', 'Button'],
      examples: ['<SearchInput placeholder="Buscar pacientes..." />'],
      version: '1.0.0'
    },
    DataTable: {
      name: 'DataTable',
      category: 'composed',
      level: 'advanced',
      description: 'Tabela com paginação e ordenação',
      path: 'src/components/composed/DataTable',
      dependencies: ['Button', 'Badge'],
      examples: ['<DataTable data={patients} columns={columns} />'],
      version: '1.0.0'
    },
    StatusIndicator: {
      name: 'StatusIndicator',
      category: 'composed',
      level: 'intermediate',
      description: 'Indicador de status com cores e ícones',
      path: 'src/components/composed/StatusIndicator',
      dependencies: ['Badge'],
      examples: ['<StatusIndicator status="active" />'],
      version: '1.0.0'
    },
    ActionMenu: {
      name: 'ActionMenu',
      category: 'composed',
      level: 'intermediate',
      description: 'Menu de ações contextuais',
      path: 'src/components/composed/ActionMenu',
      dependencies: ['Button', 'Modal'],
      examples: ['<ActionMenu actions={patientActions} />'],
      version: '1.0.0'
    }
  },

  // ========== DOMAIN ==========
  domain: {
    auth: {
      LoginForm: {
        name: 'LoginForm',
        category: 'domain',
        level: 'intermediate',
        description: 'Formulário de login com validação',
        path: 'src/components/domain/auth/LoginForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<LoginForm onSubmit={handleLogin} />'],
        version: '1.0.0'
      },
      RegisterForm: {
        name: 'RegisterForm',
        category: 'domain',
        level: 'intermediate',
        description: 'Formulário de registro de usuário',
        path: 'src/components/domain/auth/RegisterForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<RegisterForm onSubmit={handleRegister} />'],
        version: '1.0.0'
      },
      ProtectedRoute: {
        name: 'ProtectedRoute',
        category: 'domain',
        level: 'advanced',
        description: 'Componente de proteção de rotas',
        path: 'src/components/domain/auth/ProtectedRoute',
        dependencies: [],
        examples: ['<ProtectedRoute roles={["admin"]}>Content</ProtectedRoute>'],
        version: '1.0.0'
      }
    },
    patient: {
      PatientCard: {
        name: 'PatientCard',
        category: 'domain',
        level: 'intermediate',
        description: 'Card com informações do paciente',
        path: 'src/components/domain/patient/PatientCard',
        dependencies: ['Card', 'Avatar', 'Badge'],
        examples: ['<PatientCard patient={patientData} />'],
        version: '1.0.0'
      },
      PatientForm: {
        name: 'PatientForm',
        category: 'domain',
        level: 'advanced',
        description: 'Formulário de cadastro de paciente',
        path: 'src/components/domain/patient/PatientForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<PatientForm onSubmit={handlePatientSubmit} />'],
        version: '1.0.0'
      },
      PatientList: {
        name: 'PatientList',
        category: 'domain',
        level: 'advanced',
        description: 'Lista de pacientes com filtros',
        path: 'src/components/domain/patient/PatientList',
        dependencies: ['DataTable', 'SearchInput'],
        examples: ['<PatientList patients={patients} />'],
        version: '1.0.0'
      },
      MedicalHistory: {
        name: 'MedicalHistory',
        category: 'domain',
        level: 'advanced',
        description: 'Histórico médico do paciente',
        path: 'src/components/domain/patient/MedicalHistory',
        dependencies: ['Card', 'Badge'],
        examples: ['<MedicalHistory patientId={123} />'],
        version: '1.0.0'
      }
    },
    appointment: {
      AppointmentCard: {
        name: 'AppointmentCard',
        category: 'domain',
        level: 'intermediate',
        description: 'Card de agendamento',
        path: 'src/components/domain/appointment/AppointmentCard',
        dependencies: ['Card', 'StatusIndicator'],
        examples: ['<AppointmentCard appointment={appointmentData} />'],
        version: '1.0.0'
      },
      AppointmentForm: {
        name: 'AppointmentForm',
        category: 'domain',
        level: 'advanced',
        description: 'Formulário de agendamento',
        path: 'src/components/domain/appointment/AppointmentForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<AppointmentForm onSubmit={handleAppointment} />'],
        version: '1.0.0'
      },
      Calendar: {
        name: 'Calendar',
        category: 'domain',
        level: 'advanced',
        description: 'Calendário de agendamentos',
        path: 'src/components/domain/appointment/Calendar',
        dependencies: ['Card', 'Button'],
        examples: ['<Calendar appointments={appointments} />'],
        version: '1.0.0'
      }
    },
    financial: {
      InvoiceCard: {
        name: 'InvoiceCard',
        category: 'domain',
        level: 'intermediate',
        description: 'Card de fatura',
        path: 'src/components/domain/financial/InvoiceCard',
        dependencies: ['Card', 'Badge'],
        examples: ['<InvoiceCard invoice={invoiceData} />'],
        version: '1.0.0'
      },
      PaymentForm: {
        name: 'PaymentForm',
        category: 'domain',
        level: 'advanced',
        description: 'Formulário de pagamento',
        path: 'src/components/domain/financial/PaymentForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<PaymentForm onSubmit={handlePayment} />'],
        version: '1.0.0'
      },
      FinancialReport: {
        name: 'FinancialReport',
        category: 'domain',
        level: 'advanced',
        description: 'Relatório financeiro',
        path: 'src/components/domain/financial/FinancialReport',
        dependencies: ['Card', 'DataTable'],
        examples: ['<FinancialReport period="monthly" />'],
        version: '1.0.0'
      }
    },
    stock: {
      StockCard: {
        name: 'StockCard',
        category: 'domain',
        level: 'intermediate',
        description: 'Card de item do estoque',
        path: 'src/components/domain/stock/StockCard',
        dependencies: ['Card', 'Badge'],
        examples: ['<StockCard item={stockItem} />'],
        version: '1.0.0'
      },
      StockForm: {
        name: 'StockForm',
        category: 'domain',
        level: 'advanced',
        description: 'Formulário de estoque',
        path: 'src/components/domain/stock/StockForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<StockForm onSubmit={handleStock} />'],
        version: '1.0.0'
      },
      InventoryList: {
        name: 'InventoryList',
        category: 'domain',
        level: 'advanced',
        description: 'Lista de inventário',
        path: 'src/components/domain/stock/InventoryList',
        dependencies: ['DataTable', 'SearchInput'],
        examples: ['<InventoryList items={inventory} />'],
        version: '1.0.0'
      }
    },
    dashboard: {
      DashboardCard: {
        name: 'DashboardCard',
        category: 'domain',
        level: 'intermediate',
        description: 'Card de métricas do dashboard',
        path: 'src/components/domain/dashboard/DashboardCard',
        dependencies: ['Card'],
        examples: ['<DashboardCard metric={patientCount} />'],
        version: '1.0.0'
      },
      ChartWidget: {
        name: 'ChartWidget',
        category: 'domain',
        level: 'advanced',
        description: 'Widget de gráfico',
        path: 'src/components/domain/dashboard/ChartWidget',
        dependencies: ['Card'],
        examples: ['<ChartWidget data={chartData} type="line" />'],
        version: '1.0.0'
      },
      StatsOverview: {
        name: 'StatsOverview',
        category: 'domain',
        level: 'advanced',
        description: 'Visão geral de estatísticas',
        path: 'src/components/domain/dashboard/StatsOverview',
        dependencies: ['DashboardCard'],
        examples: ['<StatsOverview stats={overviewStats} />'],
        version: '1.0.0'
      }
    },
    webhooks: {
      WebhookCard: {
        name: 'WebhookCard',
        category: 'domain',
        level: 'intermediate',
        description: 'Card de webhook',
        path: 'src/components/domain/webhooks/WebhookCard',
        dependencies: ['Card', 'StatusIndicator'],
        examples: ['<WebhookCard webhook={webhookData} />'],
        version: '1.0.0'
      },
      WebhookForm: {
        name: 'WebhookForm',
        category: 'domain',
        level: 'advanced',
        description: 'Formulário de webhook',
        path: 'src/components/domain/webhooks/WebhookForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<WebhookForm onSubmit={handleWebhook} />'],
        version: '1.0.0'
      }
    },
    config: {
      ConfigPanel: {
        name: 'ConfigPanel',
        category: 'domain',
        level: 'advanced',
        description: 'Painel de configurações',
        path: 'src/components/domain/config/ConfigPanel',
        dependencies: ['Card', 'FormField'],
        examples: ['<ConfigPanel section="general" />'],
        version: '1.0.0'
      },
      SettingsForm: {
        name: 'SettingsForm',
        category: 'domain',
        level: 'advanced',
        description: 'Formulário de configurações',
        path: 'src/components/domain/config/SettingsForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<SettingsForm onSubmit={handleSettings} />'],
        version: '1.0.0'
      }
    },
    profile: {
      ProfileCard: {
        name: 'ProfileCard',
        category: 'domain',
        level: 'intermediate',
        description: 'Card de perfil do usuário',
        path: 'src/components/domain/profile/ProfileCard',
        dependencies: ['Card', 'Avatar'],
        examples: ['<ProfileCard user={userData} />'],
        version: '1.0.0'
      },
      ProfileForm: {
        name: 'ProfileForm',
        category: 'domain',
        level: 'advanced',
        description: 'Formulário de perfil',
        path: 'src/components/domain/profile/ProfileForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<ProfileForm onSubmit={handleProfile} />'],
        version: '1.0.0'
      }
    },
    contracts: {
      ContractCard: {
        name: 'ContractCard',
        category: 'domain',
        level: 'intermediate',
        description: 'Card de contrato',
        path: 'src/components/domain/contracts/ContractCard',
        dependencies: ['Card', 'StatusIndicator'],
        examples: ['<ContractCard contract={contractData} />'],
        version: '1.0.0'
      },
      ContractForm: {
        name: 'ContractForm',
        category: 'domain',
        level: 'advanced',
        description: 'Formulário de contrato',
        path: 'src/components/domain/contracts/ContractForm',
        dependencies: ['FormField', 'Button'],
        examples: ['<ContractForm onSubmit={handleContract} />'],
        version: '1.0.0'
      }
    }
  },

  // ========== TEMPLATES ==========
  templates: {
    PageLayout: {
      name: 'PageLayout',
      category: 'templates',
      level: 'intermediate',
      description: 'Layout base para páginas',
      path: 'src/components/templates/PageLayout',
      dependencies: [],
      examples: ['<PageLayout title="Dashboard">Content</PageLayout>'],
      version: '1.0.0'
    },
    DashboardLayout: {
      name: 'DashboardLayout',
      category: 'templates',
      level: 'advanced',
      description: 'Layout específico para dashboard',
      path: 'src/components/templates/DashboardLayout',
      dependencies: ['PageLayout'],
      examples: ['<DashboardLayout>Dashboard content</DashboardLayout>'],
      version: '1.0.0'
    },
    AuthLayout: {
      name: 'AuthLayout',
      category: 'templates',
      level: 'intermediate',
      description: 'Layout para páginas de autenticação',
      path: 'src/components/templates/AuthLayout',
      dependencies: [],
      examples: ['<AuthLayout>Login form</AuthLayout>'],
      version: '1.0.0'
    },
    FormLayout: {
      name: 'FormLayout',
      category: 'templates',
      level: 'intermediate',
      description: 'Layout para formulários',
      path: 'src/components/templates/FormLayout',
      dependencies: ['PageLayout'],
      examples: ['<FormLayout title="Novo Paciente">Form</FormLayout>'],
      version: '1.0.0'
    }
  }
}

// ==================== UTILITIES ====================

/**
 * Busca um componente no registry por nome
 * @param name Nome do componente
 * @returns ComponentMeta ou undefined se não encontrado
 */
export function findComponent(name: string): ComponentMeta | undefined {
  // Busca em primitives
  if (COMPONENT_REGISTRY.primitives[name]) {
    return COMPONENT_REGISTRY.primitives[name]
  }
  
  // Busca em composed
  if (COMPONENT_REGISTRY.composed[name]) {
    return COMPONENT_REGISTRY.composed[name]
  }
  
  // Busca em domain
  for (const category of Object.values(COMPONENT_REGISTRY.domain)) {
    if (category[name]) {
      return category[name]
    }
  }
  
  // Busca em templates
  if (COMPONENT_REGISTRY.templates[name]) {
    return COMPONENT_REGISTRY.templates[name]
  }
  
  return undefined
}

/**
 * Busca componentes por categoria
 * @param category Categoria do componente
 * @returns Array de ComponentMeta
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  switch (category) {
    case 'primitives':
      return Object.values(COMPONENT_REGISTRY.primitives)
    case 'composed':
      return Object.values(COMPONENT_REGISTRY.composed)
    case 'domain':
      return Object.values(COMPONENT_REGISTRY.domain).flatMap(cat => Object.values(cat))
    case 'templates':
      return Object.values(COMPONENT_REGISTRY.templates)
    default:
      return []
  }
}

/**
 * Busca componentes por nível de complexidade
 * @param level Nível de complexidade
 * @returns Array de ComponentMeta
 */
export function getComponentsByLevel(level: ComponentLevel): ComponentMeta[] {
  const allComponents: ComponentMeta[] = []
  
  // Adicionar primitives
  allComponents.push(...(Object.values(COMPONENT_REGISTRY.primitives) as ComponentMeta[]))
  
  // Adicionar composed  
  allComponents.push(...(Object.values(COMPONENT_REGISTRY.composed) as ComponentMeta[]))
  
  // Adicionar domain
  Object.values(COMPONENT_REGISTRY.domain).forEach(category => {
    allComponents.push(...(Object.values(category) as ComponentMeta[]))
  })
  
  // Adicionar templates
  allComponents.push(...(Object.values(COMPONENT_REGISTRY.templates) as ComponentMeta[]))
  
  return allComponents.filter(component => component.level === level)
}

/**
 * Obtém todas as dependências de um componente recursivamente
 * @param componentName Nome do componente
 * @returns Array de nomes de dependências
 */
export function getComponentDependencies(componentName: string): string[] {
  const component = findComponent(componentName)
  if (!component) return []
  
  const dependencies = new Set<string>()
  
  function addDependencies(deps: string[]) {
    for (const dep of deps) {
      if (!dependencies.has(dep)) {
        dependencies.add(dep)
        const depComponent = findComponent(dep)
        if (depComponent) {
          addDependencies(depComponent.dependencies)
        }
      }
    }
  }
  
  addDependencies(component.dependencies)
  return Array.from(dependencies)
} 
