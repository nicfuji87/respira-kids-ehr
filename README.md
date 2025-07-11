# 🩺 Respira KIDS EHR — Especificações para Desenvolvimento com IA (stack → Vite + React 18, TypeScript strict, Tailwind CSS, Supabase, shadcn, Cursor Windows).


**Sistema de Prontuário Eletrônico Inteligente para Fisioterapia Respiratória Pediátrica**

> 📋 **Contexto**: Clínica especializada em fisioterapia respiratória pediátrica que precisa de um sistema completo de gestão de pacientes, agendamentos e prontuários eletrônicos com diferentes níveis de acesso.

## 🎯 ESPECIFICAÇÕES DO SISTEMA

### Core Business
- **Domínio**: Fisioterapia respiratória pediátrica
- **Usuários**: Fisioterapeutas, secretárias, administradores
- **Objetivo**: Gestão completa de pacientes, prontuários e operações da clínica

### Módulos Principais
1. **Autenticação & Autorização** (Login com roles)
2. **Dashboard** (Visão geral personalizada por role)
3. **Agenda** (Gestão de agendamentos multi-view)
4. **Pacientes** (Cadastro e prontuários eletrônicos)
5. **Estoque** (Controle de equipamentos, insumos e materiais)
6. **Financeiro** (Controle de pagamentos, faturamento e custos)
7. **Webhooks** (Sistema de notificações e integrações)
8. **Configurações** (Administração do sistema)

## 🧩 SISTEMA DE COMPONENTES HIERÁRQUICO

### ÍNDICE DE COMPONENTES PARA CONSULTA DA IA

```typescript
// src/components/_registry/component-map.ts
export const COMPONENT_REGISTRY = {
  // NÍVEL 1: PRIMITIVOS (shadcn/ui customizados)
  primitives: {
    'Button': { 
      path: 'primitives/button',
      variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      sizes: ['default', 'sm', 'lg', 'icon'],
      usage: 'Botões básicos com tema Respira KIDS'
    },
    'Input': { 
      path: 'primitives/input',
      variants: ['default', 'error'],
      usage: 'Campos de entrada com validação visual'
    },
    'Card': { 
      path: 'primitives/card',
      parts: ['Card', 'CardHeader', 'CardContent', 'CardFooter'],
      usage: 'Containers com elevação e bordas tema'
    },
    'Dialog': { 
      path: 'primitives/dialog',
      parts: ['Dialog', 'DialogTrigger', 'DialogContent', 'DialogHeader'],
      usage: 'Modais e overlays'
    },
    'Form': { 
      path: 'primitives/form',
      parts: ['Form', 'FormField', 'FormItem', 'FormLabel', 'FormControl'],
      usage: 'Sistema de formulários com validação'
    },
    'Table': { 
      path: 'primitives/table',
      parts: ['Table', 'TableHeader', 'TableBody', 'TableRow', 'TableCell'],
      usage: 'Tabelas com tema Respira KIDS'
    },
    'Calendar': { 
      path: 'primitives/calendar',
      usage: 'Calendário base para agendamentos'
    },
    'Badge': { 
      path: 'primitives/badge',
      variants: ['default', 'secondary', 'destructive', 'outline'],
      usage: 'Status e labels pequenos'
    }
  },

  // NÍVEL 2: COMPOSTOS (combinações funcionais)
  composed: {
    'SearchInput': { 
      path: 'composed/search-input',
      uses: ['Input', 'Button', 'Search Icon'],
      usage: 'Input com botão de busca integrado'
    },
    'ActionCard': { 
      path: 'composed/action-card',
      uses: ['Card', 'Button'],
      usage: 'Card com ações no footer'
    },
    'DataTable': { 
      path: 'composed/data-table',
      uses: ['Table', 'Button', 'Input'],
      usage: 'Tabela com paginação, busca e ordenação'
    },
    'FormModal': { 
      path: 'composed/form-modal',
      uses: ['Dialog', 'Form', 'Button'],
      usage: 'Modal com formulário integrado'
    },
    'FileUpload': { 
      path: 'composed/file-upload',
      uses: ['Input', 'Button', 'Card'],
      usage: 'Upload de arquivos com preview'
    },
    'StatusBadge': { 
      path: 'composed/status-badge',
      uses: ['Badge'],
      usage: 'Badge com cores específicas para status'
    },
    'GoogleLoginButton': { 
      path: 'composed/google-login-button',
      uses: ['Button', 'Google Icon'],
      usage: 'Botão de login com Google OAuth'
    },
    'RoleBasedView': { 
      path: 'composed/role-based-view',
      uses: [],
      usage: 'Wrapper para renderização condicional baseada em role'
    }
  },

  // NÍVEL 3: DOMÍNIO (específicos do negócio)
  domain: {
    auth: {
      'AwaitingApprovalScreen': { 
        path: 'domain/auth/awaiting-approval-screen',
        uses: ['Card', 'Alert'],
        usage: 'Tela de aguardando aprovação para novos usuários'
      },
      'CompleteRegistrationForm': { 
        path: 'domain/auth/complete-registration-form',
        uses: ['Form', 'Input', 'Button'],
        usage: 'Formulário para completar cadastro após aprovação'
      },
      'UserApprovalManager': { 
        path: 'domain/auth/user-approval-manager',
        uses: ['DataTable', 'Button', 'StatusBadge'],
        usage: 'Gerenciamento de aprovação de usuários pelo admin'
      }
    },
    patient: {
      'PatientCard': { 
        path: 'domain/patient/patient-card',
        uses: ['ActionCard', 'StatusBadge'],
        usage: 'Card de paciente com ações rápidas (versão completa)'
      },
      'PatientCardRestricted': { 
        path: 'domain/patient/patient-card-restricted',
        uses: ['ActionCard', 'StatusBadge'],
        usage: 'Card de paciente sem informações de contato'
      },
      'PatientForm': { 
        path: 'domain/patient/patient-form',
        uses: ['Form', 'Input', 'Button'],
        usage: 'Formulário completo de paciente'
      },
      'PatientSearch': { 
        path: 'domain/patient/patient-search',
        uses: ['SearchInput', 'DataTable'],
        usage: 'Busca avançada de pacientes'
      },
      'ContactRestrictedView': { 
        path: 'domain/patient/contact-restricted-view',
        uses: ['Card'],
        usage: 'Visualização de dados sem contato para profissionais'
      },
      'AnamneseForm': { 
        path: 'domain/patient/anamnese-form',
        uses: ['Form', 'Textarea', 'Input'],
        usage: 'Formulário completo de anamnese'
      },
      'ClinicalEvolution': { 
        path: 'domain/patient/clinical-evolution',
        uses: ['Form', 'Textarea', 'Button'],
        usage: 'Registro de evolução clínica'
      },
      'DocumentGenerator': { 
        path: 'domain/patient/document-generator',
        uses: ['Dialog', 'Button', 'Select'],
        usage: 'Gerador de documentos (evolução, relatório, atestado)'
      },
      'AttendanceCertificate': { 
        path: 'domain/patient/attendance-certificate',
        uses: ['Form', 'Button'],
        usage: 'Gerador de atestado de comparecimento'
      },
      'AttachmentUpload': { 
        path: 'domain/patient/attachment-upload',
        uses: ['FileUpload', 'Select', 'Badge'],
        usage: 'Upload categorizado (documentos, atestados, sessões)'
      },
      'PatientBillingHistory': { 
        path: 'domain/patient/patient-billing-history',
        uses: ['DataTable', 'StatusBadge', 'Button'],
        usage: 'Histórico de consultas e geração de cobranças do paciente'
      }
    },
    appointment: {
      'AppointmentSlot': { 
        path: 'domain/appointment/appointment-slot',
        uses: ['Card', 'Badge'],
        usage: 'Slot de horário na agenda'
      },
      'CalendarView': { 
        path: 'domain/appointment/calendar-view',
        uses: ['Calendar', 'AppointmentSlot'],
        usage: 'Visualização de calendário com agendamentos'
      },
      'AppointmentForm': { 
        path: 'domain/appointment/appointment-form',
        uses: ['FormModal', 'Calendar'],
        usage: 'Formulário de novo agendamento'
      },
      'AgendaPermissionManager': { 
        path: 'domain/appointment/agenda-permission-manager',
        uses: ['Form', 'Checkbox', 'Button'],
        usage: 'Gerenciamento de permissões de agenda para secretárias'
      }
    },
    financial: {
      'PaymentCard': { 
        path: 'domain/financial/payment-card',
        uses: ['ActionCard', 'StatusBadge'],
        usage: 'Card de pagamento com status'
      },
      'ReceiptGenerator': { 
        path: 'domain/financial/receipt-generator',
        uses: ['Dialog', 'Button'],
        usage: 'Gerador de recibos em PDF'
      },
      'CostBreakdown': { 
        path: 'domain/financial/cost-breakdown',
        uses: ['Card', 'Table'],
        usage: 'Detalhamento de custos com estoque'
      },
      'PersonalFinancialDashboard': { 
        path: 'domain/financial/personal-financial-dashboard',
        uses: ['Card', 'Chart'],
        usage: 'Dashboard financeiro pessoal do profissional'
      },
      'CommissionCalculator': { 
        path: 'domain/financial/commission-calculator',
        uses: ['Form', 'Input', 'Button'],
        usage: 'Configuração e cálculo de comissões'
      },
      'RestrictedFinancialView': { 
        path: 'domain/financial/restricted-financial-view',
        uses: ['Card', 'Table'],
        usage: 'Visão financeira restrita para secretárias'
      },
      'BulkBillingGenerator': { 
        path: 'domain/financial/bulk-billing-generator',
        uses: ['Form', 'DatePicker', 'Checkbox', 'DataTable'],
        usage: 'Geração múltipla de cobranças por período'
      },
      'PatientBillingManager': { 
        path: 'domain/financial/patient-billing-manager',
        uses: ['DataTable', 'Checkbox', 'Button', 'Dialog'],
        usage: 'Gestão de cobranças por paciente específico'
      },
      'BillingPreview': { 
        path: 'domain/financial/billing-preview',
        uses: ['Card', 'Table', 'Button'],
        usage: 'Preview de cobranças antes da geração'
      },
      'BillingSelector': { 
        path: 'domain/financial/billing-selector',
        uses: ['Checkbox', 'Table', 'Filter'],
        usage: 'Seleção de consultas para faturamento'
      }
    },
    stock: {
      'ProductCard': { 
        path: 'domain/stock/product-card',
        uses: ['ActionCard', 'StatusBadge'],
        usage: 'Card de produto com alertas de estoque'
      },
      'StockMovement': { 
        path: 'domain/stock/stock-movement',
        uses: ['Form', 'Input', 'Select'],
        usage: 'Formulário de movimentação de estoque'
      },
      'LowStockAlert': { 
        path: 'domain/stock/low-stock-alert',
        uses: ['Alert', 'Badge'],
        usage: 'Alerta de estoque baixo'
      },
      'ExpiryTracker': { 
        path: 'domain/stock/expiry-tracker',
        uses: ['Table', 'Badge'],
        usage: 'Rastreamento de produtos próximos ao vencimento'
      },
      'StockReport': { 
        path: 'domain/stock/stock-report',
        uses: ['DataTable', 'Chart'],
        usage: 'Relatórios de movimentação e consumo'
      },
      'ConsumptionTracker': { 
        path: 'domain/stock/consumption-tracker',
        uses: ['Card', 'Progress'],
        usage: 'Rastreamento de consumo por paciente/procedimento'
      },
      'MaterialRequestForm': { 
        path: 'domain/stock/material-request-form',
        uses: ['Form', 'Select', 'Input', 'Button'],
        usage: 'Formulário de solicitação de material para sessão'
      },
      'MaterialRequestCard': { 
        path: 'domain/stock/material-request-card',
        uses: ['Card', 'Badge', 'Button'],
        usage: 'Card de solicitação de material com ações'
      },
      'MaterialApprovalManager': { 
        path: 'domain/stock/material-approval-manager',
        uses: ['DataTable', 'Button', 'Dialog'],
        usage: 'Gestão de aprovações de solicitação de material'
      },
      'MaterialRequestHistory': { 
        path: 'domain/stock/material-request-history',
        uses: ['Table', 'StatusBadge', 'Filter'],
        usage: 'Histórico de solicitações de material'
      },
      'PendingRequestsList': { 
        path: 'domain/stock/pending-requests-list',
        uses: ['DataTable', 'Badge', 'Button'],
        usage: 'Lista de solicitações pendentes'
      }
    },
    dashboard: {
      'PersonalFinancialMetrics': { 
        path: 'domain/dashboard/personal-financial-metrics',
        uses: ['Card', 'Chart'],
        usage: 'Métricas financeiras pessoais do profissional'
      },
      'AwaitingApprovalCard': { 
        path: 'domain/dashboard/awaiting-approval-card',
        uses: ['Card', 'Alert'],
        usage: 'Card para usuários aguardando aprovação'
      },
      'QuickSearch': { 
        path: 'domain/dashboard/quick-search',
        uses: ['SearchInput', 'Dialog'],
        usage: 'Busca rápida global (pacientes, consultas)'
      },
      'MaterialRequestWidget': { 
        path: 'domain/dashboard/material-request-widget',
        uses: ['Card', 'Button', 'Form'],
        usage: 'Widget rápido para solicitar material'
      },
      'PendingMaterialRequests': { 
        path: 'domain/dashboard/pending-material-requests',
        uses: ['Card', 'Badge', 'Button'],
        usage: 'Card com solicitações de material pendentes'
      }
    },
    webhooks: {
      'WebhookManager': { 
        path: 'domain/webhooks/webhook-manager',
        uses: ['DataTable', 'Form', 'Button'],
        usage: 'Gerenciamento de configurações de webhook'
      },
      'EventLogger': { 
        path: 'domain/webhooks/event-logger',
        uses: ['Table', 'Badge', 'Filter'],
        usage: 'Log de eventos e auditoria'
      },
      'RetryHandler': { 
        path: 'domain/webhooks/retry-handler',
        uses: ['Button', 'Progress'],
        usage: 'Controle de retry de webhooks falhados'
      },
      'WebhookConfig': { 
        path: 'domain/webhooks/webhook-config',
        uses: ['Form', 'Input', 'Checkbox'],
        usage: 'Configuração individual de webhook'
      }
    },
    config: {
      'ProductCategoryManager': { 
        path: 'domain/config/product-category-manager',
        uses: ['DataTable', 'Form', 'ColorPicker'],
        usage: 'Gestão de categorias de produtos'
      },
      'ProductManager': { 
        path: 'domain/config/product-manager',
        uses: ['Form', 'Select', 'Input'],
        usage: 'Cadastro e gestão de produtos'
      },
      'FinancialAccountManager': { 
        path: 'domain/config/financial-account-manager',
        uses: ['DataTable', 'Form', 'Select'],
        usage: 'Gestão de contas financeiras'
      },
      'PaymentMethodManager': { 
        path: 'domain/config/payment-method-manager',
        uses: ['Form', 'Input', 'Switch'],
        usage: 'Configuração de formas de pagamento'
      },
      'FinancialCategoryManager': { 
        path: 'domain/config/financial-category-manager',
        uses: ['DataTable', 'Form', 'ColorPicker'],
        usage: 'Gestão de categorias financeiras'
      }
    },
    profile: {
      'ProfileSettings': { 
        path: 'domain/profile/profile-settings',
        uses: ['Form', 'Input', 'Button', 'Tabs'],
        usage: 'Configurações gerais do perfil do usuário'
      },
      'PersonalDataForm': { 
        path: 'domain/profile/personal-data-form',
        uses: ['Form', 'Input', 'Button'],
        usage: 'Formulário de dados pessoais'
      },
      'PasswordChangeForm': { 
        path: 'domain/profile/password-change-form',
        uses: ['Form', 'Input', 'Button'],
        usage: 'Formulário para alteração de senha'
      },
      'ApiKeysManager': { 
        path: 'domain/profile/api-keys-manager',
        uses: ['DataTable', 'Form', 'Dialog', 'Switch'],
        usage: 'Gerenciamento de chaves de API pessoais'
      },
      'AsaasIntegration': { 
        path: 'domain/profile/asaas-integration',
        uses: ['Form', 'Input', 'Select', 'Switch'],
        usage: 'Configuração da integração com Asaas'
      },
      'EvolutionApiIntegration': { 
        path: 'domain/profile/evolution-api-integration',
        uses: ['Form', 'Input', 'Button', 'Switch'],
        usage: 'Configuração da integração com Evolution API (WhatsApp)'
      },
      'SmtpConfiguration': { 
        path: 'domain/profile/smtp-configuration',
        uses: ['Form', 'Input', 'Button', 'Switch'],
        usage: 'Configuração de SMTP personalizado'
      },
      'CustomIntegration': { 
        path: 'domain/profile/custom-integration',
        uses: ['Form', 'Input', 'Button'],
        usage: 'Configuração de integrações personalizadas'
      },
      'NotificationSettings': { 
        path: 'domain/profile/notification-settings',
        uses: ['Form', 'Switch', 'Select'],
        usage: 'Configurações de notificações do usuário'
      },
      'IntegrationTest': { 
        path: 'domain/profile/integration-test',
        uses: ['Button', 'Alert', 'Progress'],
        usage: 'Teste de integrações configuradas'
      },
      'UserContractsManager': { 
        path: 'domain/profile/user-contracts-manager',
        uses: ['DataTable', 'Button', 'Dialog'],
        usage: 'Gestão de contratos do usuário'
      },
      'ContractViewer': { 
        path: 'domain/profile/contract-viewer',
        uses: ['Dialog', 'Button'],
        usage: 'Visualizador de contratos em PDF'
      },
      'DocumentUploader': { 
        path: 'domain/profile/document-uploader',
        uses: ['FileUpload', 'Button', 'Progress'],
        usage: 'Upload de documentos assinados'
      }
    },
    contracts: {
      'ContractTemplateManager': { 
        path: 'domain/contracts/contract-template-manager',
        uses: ['DataTable', 'Form', 'Button'],
        usage: 'Gestão de modelos de contrato'
      },
      'ContractEditor': { 
        path: 'domain/contracts/contract-editor',
        uses: ['Form', 'Textarea', 'Button'],
        usage: 'Editor de modelo de contrato com variáveis'
      },
      'VariableSelector': { 
        path: 'domain/contracts/variable-selector',
        uses: ['Select', 'Button', 'Badge'],
        usage: 'Seletor de variáveis para contratos'
      },
      'ContractGenerator': { 
        path: 'domain/contracts/contract-generator',
        uses: ['Form', 'Select', 'Button'],
        usage: 'Gerador de contrato para usuário específico'
      },
      'ContractPreview': { 
        path: 'domain/contracts/contract-preview',
        uses: ['Dialog', 'Button'],
        usage: 'Preview do contrato antes da geração'
      },
      'BucketManager': { 
        path: 'domain/contracts/bucket-manager',
        uses: ['DataTable', 'Button', 'Progress'],
        usage: 'Gestão de arquivos nos buckets'
      },
      'ContractHistory': { 
        path: 'domain/contracts/contract-history',
        uses: ['Table', 'StatusBadge', 'Button'],
        usage: 'Histórico de contratos gerados'
      }
    }
  },

  // NÍVEL 4: TEMPLATES (layouts completos)
  templates: {
    'DashboardLayout': { 
      path: 'templates/dashboard-layout',
      uses: ['Card', 'Button'],
      usage: 'Layout base para dashboards'
    },
    'FormLayout': { 
      path: 'templates/form-layout',
      uses: ['Card', 'Form'],
      usage: 'Layout padrão para formulários'
    },
    'TableLayout': { 
      path: 'templates/table-layout',
      uses: ['DataTable', 'SearchInput'],
      usage: 'Layout para páginas com tabelas'
    }
  }
};

🏗️ Arquitetura Hierárquica (4 Níveis)
Nível 1: Primitivos (src/components/primitives/)
Componentes básicos reutilizáveis baseados em shadcn/ui
Função: Elementos básicos da UI (botões, inputs, cards, etc.)
Baseado em: shadcn/ui com customizações tema RespiraKids
Características:
CSS variables personalizadas (--azul-respira, --roxo-titulo, etc.)
Touch targets mínimos de 44px (mobile-friendly)
Variantes adaptadas ao tema RespiraKids
Transições suaves (theme-transition)
Exemplos:
Apply to README.md
Nível 2: Compostos (src/components/composed/)
Componentes que combinam primitivos para funcionalidades específicas
Função: Combinam primitivos para criar funcionalidades reutilizáveis
Características:
Integração com react-hook-form
Lógica de negócio genérica
Estilização consistente
Reutilizáveis em qualquer domínio
Exemplos:
Apply to README.md
Nível 3: Domínio (src/components/domain/)
Componentes específicos do negócio organizados por área
Função: Componentes específicos para cada área de negócio
Organização por pastas:
auth/ - Autenticação
patient/ - Pacientes
appointment/ - Agendamentos
financial/ - Financeiro
config/ - Configurações
dashboard/ - Dashboard
Exemplos:
Apply to README.md
Nível 4: Templates (src/components/templates/)
Layouts e estruturas de página completas
Função: Estruturas de página e layouts responsivos
Características:
Layout responsivo
Estrutura de navegação
Containers de conteúdo


```css
/* src/index.css - TEMA RESPIRA KIDS PARA SHADCN */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Respira KIDS Color System */
    --background: 44 93% 93%;          /* Bege Fundo */
    --foreground: 292 53% 20%;         /* Roxo Título */
    --card: 0 0% 100%;                 /* Branco */
    --card-foreground: 292 53% 20%;    /* Roxo Título */
    --popover: 0 0% 100%;              /* Branco */
    --popover-foreground: 292 53% 20%; /* Roxo Título */
    --primary: 174 46% 70%;            /* Azul Respira */
    --primary-foreground: 0 0% 100%;   /* Branco */
    --secondary: 13 83% 78%;           /* Vermelho Kids */
    --secondary-foreground: 292 53% 20%; /* Roxo Título */
    --muted: 174 46% 85%;              /* Azul Respira Claro */
    --muted-foreground: 0 0% 48%;      /* Cinza Secundário */
    --accent: 86 49% 77%;              /* Verde Pipa */
    --accent-foreground: 292 53% 20%;  /* Roxo Título */
    --destructive: 0 84% 60%;          /* Vermelho Erro */
    --destructive-foreground: 0 0% 100%; /* Branco */
    --border: 174 46% 85%;             /* Azul Respira Claro */
    --input: 0 0% 100%;                /* Branco */
    --ring: 174 46% 70%;               /* Azul Respira */
    --radius: 0.5rem;
    
    /* Cores específicas Respira KIDS */
    --azul-respira: 174 46% 70%;
    --vermelho-kids: 13 83% 78%;
    --bege-fundo: 44 93% 93%;
    --roxo-titulo: 292 53% 20%;
    --amarelo-pipa: 50 99% 56%;
    --verde-pipa: 86 49% 77%;
    --cinza-secundario: 0 0% 48%;
  }

  .dark {
    --background: 292 53% 8%;          /* Roxo muito escuro */
    --foreground: 44 93% 93%;          /* Bege Fundo */
    --card: 292 53% 12%;               /* Roxo escuro */
    --card-foreground: 44 93% 93%;     /* Bege Fundo */
    --popover: 292 53% 12%;            /* Roxo escuro */
    --popover-foreground: 44 93% 93%;  /* Bege Fundo */
    --primary: 174 46% 70%;            /* Azul Respira (mantém) */
    --primary-foreground: 292 53% 8%;  /* Roxo muito escuro */
    --secondary: 13 83% 78%;           /* Vermelho Kids (mantém) */
    --secondary-foreground: 292 53% 8%; /* Roxo muito escuro */
    --muted: 292 53% 15%;              /* Roxo médio */
    --muted-foreground: 0 0% 70%;      /* Cinza claro */
    --accent: 86 49% 77%;              /* Verde Pipa (mantém) */
    --accent-foreground: 292 53% 8%;   /* Roxo muito escuro */
    --destructive: 0 84% 60%;          /* Vermelho Erro */
    --destructive-foreground: 0 0% 100%; /* Branco */
    --border: 292 53% 20%;             /* Roxo Título */
    --input: 292 53% 15%;              /* Roxo médio */
    --ring: 174 46% 70%;               /* Azul Respira */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Animações específicas Respira KIDS */
@layer utilities {
  .respira-gradient {
    @apply bg-gradient-to-r from-azul-respira to-verde-pipa;
  }
  
  .respira-text-gradient {
    @apply bg-gradient-to-r from-azul-respira to-roxo-titulo bg-clip-text text-transparent;
  }
  
  .theme-transition {
    @apply transition-colors duration-200 ease-in-out;
  }
  
  .animate-respira-pulse {
    animation: respira-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

@keyframes respira-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: .8;
    transform: scale(1.02);
  }
}
```
```css
/* CORES PRIMÁRIAS - SEMPRE USAR ESSAS VARIÁVEIS */
--azul-respira: 174 46% 70%;      /* #92D3C7 - Primária */
--vermelho-kids: 13 83% 78%;      /* #F39D94 - Secundária */
--bege-fundo: 44 93% 93%;         /* #FDF0DE - Background */
--roxo-titulo: 292 53% 20%;       /* #4E1963 - Títulos */
--amarelo-pipa: 50 99% 56%;       /* #FDCD1F - Warning/Destaque */
--verde-pipa: 86 49% 77%;         /* #C6E09F - Success */
--cinza-secundario: 0 0% 48%;     /* #7A7A7A - Texto secundário */
--branco: 0 0% 100%;              /* #FFFFFF - Cards */

/* SISTEMA SEMÂNTICO - MAPEAR AUTOMATICAMENTE */
--primary: var(--azul-respira);
--secondary: var(--vermelho-kids);
--background: var(--bege-fundo);
--foreground: var(--roxo-titulo);
--muted-foreground: var(--cinza-secundario);
--card: var(--branco);
--success: var(--verde-pipa);
--warning: var(--amarelo-pipa);
--border: 174 46% 85%;            /* Azul respira mais claro */
```

### Componentes UI Obrigatórios
```tsx
/* SEMPRE USAR ESSAS CLASSES TAILWIND */
- bg-primary text-primary-foreground  // Botões principais
- bg-secondary text-secondary-foreground  // Botões secundários
- bg-card text-card-foreground border border-border  // Cards
- bg-background text-foreground  // Backgrounds principais
- text-muted-foreground  // Textos secundários
- bg-success text-success-foreground  // Estados de sucesso
- bg-warning text-warning-foreground  // Avisos
```

## 🏗️ ARQUITETURA TÉCNICA OBRIGATÓRIA

### Stack Tecnológico
```json
{
  "frontend": "React 19 + TypeScript",
  "build": "Vite",
  "styling": "Tailwind CSS + CSS Variables",
  "components": "shadcn/ui (customizado para Respira KIDS)",
  "routing": "React Router v6",
  "state": "Context API + useReducer",
  "forms": "React Hook Form + Zod",
  "database": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth",
  "icons": "Lucide React",
  "charts": "Recharts"
}
```

### Estrutura de Pastas OBRIGATÓRIA - "Mais Componentes, Menos Código"
```
src/
├── components/
│   ├── primitives/     # Componentes shadcn/ui customizados (NÍVEL 1)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── index.ts    # Export barrel
│   ├── composed/       # Combinações de primitivos (NÍVEL 2)
│   │   ├── search-input.tsx
│   │   ├── action-card.tsx
│   │   ├── data-table.tsx
│   │   └── index.ts
│   ├── domain/         # Componentes específicos do negócio (NÍVEL 3)
│   │   ├── patient/
│   │   │   ├── patient-card.tsx
│   │   │   ├── patient-form.tsx
│   │   │   └── index.ts
│   │   ├── appointment/
│   │   │   ├── appointment-slot.tsx
│   │   │   ├── calendar-view.tsx
│   │   │   └── index.ts
│   │   └── financial/
│   ├── templates/      # Layouts completos (NÍVEL 4)
│   │   ├── dashboard-layout.tsx
│   │   ├── form-layout.tsx
│   │   └── index.ts
│   └── _registry/      # ÍNDICE DE COMPONENTES (CONSULTA IA)
│       ├── component-map.ts
│       └── usage-guide.md
├── pages/              # Páginas principais
├── hooks/              # Custom hooks
├── contexts/           # Context providers
├── types/              # TypeScript definitions
├── utils/              # Funções utilitárias
├── services/           # Integrações externas
└── lib/                # Configurações de libs + shadcn
```