# Guia de Uso dos Componentes - Respira Kids EHR

## Estrutura em 4 Níveis

### NÍVEL 1: Primitives
Componentes shadcn/ui customizados com o tema Respira KIDS.

```tsx
import { Button, Input, Card } from "@/components/primitives"

// Uso básico
<Button variant="default">Salvar</Button>
<Input placeholder="Digite aqui..." />
<Card>Conteúdo</Card>
```

### NÍVEL 2: Composed
Combinações de primitivos para funcionalidades específicas.

```tsx
import { SearchInput, ActionCard, DataTable } from "@/components/composed"

// SearchInput - Campo de busca com botão
<SearchInput 
  placeholder="Buscar pacientes..."
  onSearch={(value) => console.log(value)}
/>

// ActionCard - Card com ações
<ActionCard
  title="Paciente João"
  description="Consulta agendada"
  actions={[
    { label: "Editar", onClick: () => {} },
    { label: "Excluir", onClick: () => {}, variant: "destructive" }
  ]}
/>

// DataTable - Tabela com dados
<DataTable
  data={patients}
  columns={[
    { key: 'name', header: 'Nome' },
    { key: 'age', header: 'Idade' }
  ]}
/>
```

### NÍVEL 3: Domain
Componentes específicos do negócio EHR.

```tsx
import { PatientCard, PatientForm } from "@/components/domain/patient"
import { AppointmentSlot, CalendarView } from "@/components/domain/appointment"
import { FinancialCard } from "@/components/domain/financial"

// Patient components
<PatientCard 
  patient={{ id: '1', name: 'João', status: 'active' }}
  onClick={() => {}}
/>

<PatientForm
  onSubmit={(data) => console.log(data)}
  onCancel={() => {}}
/>

// Appointment components
<AppointmentSlot
  appointment={{
    id: '1',
    time: '14:00',
    patientName: 'João',
    status: 'booked'
  }}
/>

<CalendarView
  selectedDate={new Date()}
  onDateSelect={(date) => console.log(date)}
  appointments={appointments}
/>

// Financial components
<FinancialCard
  transaction={{
    id: '1',
    amount: 150,
    type: 'income',
    description: 'Consulta João',
    date: '2024-01-15',
    status: 'completed'
  }}
/>
```

### NÍVEL 4: Templates
Layouts completos para páginas.

```tsx
import { ResponsiveLayout, DashboardLayout, FormLayout } from "@/components/templates"

// ResponsiveLayout - Layout responsivo completo
<ResponsiveLayout
  title="Dashboard"
  headerActions={[{ id: '1', label: 'Sair', onClick: logout }]}
  bottomTabs={[
    { id: 'home', label: 'Início', active: true },
    { id: 'patients', label: 'Pacientes' }
  ]}
  sidebarItems={[
    { id: 'dashboard', label: 'Dashboard', active: true },
    { id: 'patients', label: 'Pacientes' }
  ]}
>
  <div>Conteúdo da página</div>
</ResponsiveLayout>

// DashboardLayout - Layout de dashboard
<DashboardLayout
  title="Dashboard Principal"
  sidebar={<nav>Navegação</nav>}
  header={<div>Header personalizado</div>}
>
  <div>Conteúdo do dashboard</div>
</DashboardLayout>

// FormLayout - Layout para formulários
<FormLayout
  title="Cadastro de Paciente"
  description="Preencha os dados do paciente"
  maxWidth="lg"
  actions={
    <div className="flex gap-2">
      <Button variant="outline">Cancelar</Button>
      <Button>Salvar</Button>
    </div>
  }
>
  <PatientForm />
</FormLayout>
```

## Tema Respira KIDS

Todos os componentes usam as CSS variables do tema:

- `--azul-respira`: Cor principal (botões, links)
- `--roxo-titulo`: Títulos e textos importantes
- `--bege-fundo`: Backgrounds suaves
- `--verde-pipa`: Sucesso e confirmações
- `--amarelo-pipa`: Avisos e destaques
- `--vermelho-kids`: Erros e exclusões

## Convenções

1. **Import paths**: Use sempre o barrel export (`@/components/primitives`)
2. **Props**: Sempre tipadas com TypeScript
3. **ClassName**: Use `cn()` para combinar classes
4. **Mobile-first**: Todos os componentes são responsivos
5. **Acessibilidade**: Touch targets mínimos de 44px

## Consulta Rápida

Use o `component-map.ts` para encontrar componentes:

```tsx
import { findComponent, getComponentsByCategory } from "@/components/_registry/component-map"

// Encontrar um componente específico
const buttonMeta = findComponent('Button')

// Listar todos os primitivos
const primitives = getComponentsByCategory('primitives')
``` 