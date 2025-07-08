# Componentes de Domínio - EHR

Esta pasta contém componentes específicos para o domínio médico/hospitalar do sistema EHR.

## Estrutura das Pastas

### 🔐 `auth/`
**Autenticação e Autorização**
- Componentes de login/logout
- Formulários de autenticação
- Proteção de rotas
- Gerenciamento de permissões

### 🏥 `patient/`
**Gestão de Pacientes**
- Cadastro de pacientes
- Prontuários eletrônicos
- Histórico médico
- Dados demográficos

### 📅 `appointment/`
**Agendamentos e Consultas**
- Calendário de agendamentos
- Formulários de consulta
- Gestão de horários
- Notificações

### 💰 `financial/`
**Gestão Financeira**
- Faturamento
- Cobranças
- Relatórios financeiros
- Planos de saúde

### 📦 `stock/`
**Controle de Estoque**
- Medicamentos
- Equipamentos
- Suprimentos médicos
- Inventário

### 📊 `dashboard/`
**Dashboards e Relatórios**
- Métricas do sistema
- Relatórios médicos
- Indicadores de performance
- Análises

### 🔗 `webhooks/`
**Integrações Webhook**
- Integrações com sistemas externos
- Notificações automáticas
- Sincronização de dados

### ⚙️ `config/`
**Configurações do Sistema**
- Configurações gerais
- Preferências do usuário
- Parâmetros do sistema

### 👤 `profile/`
**Perfil de Usuário**
- Dados pessoais
- Configurações de conta
- Preferências

### 📋 `contracts/`
**Contratos e Documentos**
- Termos de uso
- Contratos médicos
- Documentos legais
- Consentimentos

## Padrões de Desenvolvimento

### Estrutura de Componente
```
DomainComponent/
├── index.ts
├── DomainComponent.tsx
├── DomainComponent.stories.tsx
├── DomainComponent.test.tsx
├── types.ts
└── hooks/
    └── useDomainComponent.ts
```

### Naming Convention
- **Componentes**: `PascalCase`
- **Hooks**: `use` + `PascalCase`
- **Types**: `PascalCase` + `Type`
- **Constantes**: `UPPER_SNAKE_CASE`

### Responsabilidades
- Lógica de negócio específica do domínio médico
- Validação de dados médicos
- Integração com APIs específicas
- Componentes complexos e especializados 