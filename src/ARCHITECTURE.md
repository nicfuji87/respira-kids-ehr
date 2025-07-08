# Arquitetura do Projeto - Respira Kids EHR

## Estrutura de Pastas

### 📁 `src/`
Diretório principal do código-fonte.

### 📁 `src/components/`
Componentes React organizados por níveis de complexidade:

#### 🔹 `primitives/`
Componentes básicos e reutilizáveis (botões, inputs, etc.)

#### 🔹 `composed/`
Componentes compostos que combinam primitivos

#### 🔹 `domain/`
Componentes específicos do domínio médico/EHR:
- **`auth/`** - Autenticação e autorização
- **`patient/`** - Gestão de pacientes
- **`appointment/`** - Agendamentos e consultas
- **`financial/`** - Gestão financeira
- **`stock/`** - Controle de estoque
- **`dashboard/`** - Dashboards e relatórios
- **`webhooks/`** - Integrações webhook
- **`config/`** - Configurações do sistema
- **`profile/`** - Perfil de usuário
- **`contracts/`** - Contratos e documentos

#### 🔹 `templates/`
Templates de páginas e layouts

#### 🔹 `_registry/`
Registro de componentes para desenvolvimento

#### 🔹 `ui/`
Componentes shadcn/ui

### 📁 `src/pages/`
Páginas da aplicação (roteamento)

### 📁 `src/hooks/`
Hooks customizados do React

### 📁 `src/contexts/`
Contextos do React para estado global

### 📁 `src/types/`
Definições de tipos TypeScript

### 📁 `src/utils/`
Funções utilitárias

### 📁 `src/services/`
Serviços para APIs externas

### 📁 `src/lib/`
Bibliotecas e configurações

## Padrões de Arquitetura

### 🔄 Component Hierarchy
```
Templates (Pages)
    ↓
Domain Components (Business Logic)
    ↓
Composed Components (Combined Primitives)
    ↓
Primitives (Basic UI Elements)
    ↓
shadcn/ui Components
```

### 🎯 Princípios
- **Separation of Concerns**: Cada pasta tem responsabilidade específica
- **Reusability**: Componentes primitivos reutilizáveis
- **Domain-Driven Design**: Organização por domínios do negócio
- **Type Safety**: TypeScript em todo o projeto
- **Scalability**: Estrutura preparada para crescimento

## Tecnologias

- **React 19** + TypeScript
- **Tailwind CSS v3.4.16**
- **shadcn/ui** para componentes
- **Vite** como bundler
- **ESLint** para linting

## Convenções

### 📝 Naming
- Pastas: `kebab-case` ou `camelCase`
- Componentes: `PascalCase`
- Arquivos: `PascalCase.tsx` para componentes
- Hooks: `use` prefix
- Types: `PascalCase` com suffix `Type`

### 🗂️ File Structure
```
ComponentName/
├── index.ts          # Export barrel
├── ComponentName.tsx # Main component
├── ComponentName.stories.tsx # Storybook (opcional)
├── ComponentName.test.tsx # Tests (opcional)
└── types.ts          # Component types
```

## Fluxo de Desenvolvimento

1. **Primitives** → Componentes básicos
2. **Composed** → Combinação de primitivos
3. **Domain** → Lógica específica do EHR
4. **Templates** → Layouts de página
5. **Pages** → Implementação final 