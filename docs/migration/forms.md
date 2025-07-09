# 📋 Migração de Formulários - shadcn/react-hook-form

## 🎯 **Objetivo**
Migrar todos os formulários do projeto para usar `shadcn/ui` + `react-hook-form` como padrão oficial.

## 📊 **Status da Migração**

### ✅ **Componentes Migrados**

| Componente | Status | Data | Observações |
|------------|---------|------|-------------|
| `FormFieldWrapper` | ✅ Criado | 2024-01-XX | Novo componente padrão para forms |
| `ComponentsComposed` | ✅ Migrado | 2024-01-XX | Demonstração com validação Zod |

### 🔄 **Em Migração**

| Página/Componente | Prioridade | Estimativa | Responsável |
|-------------------|------------|------------|-------------|
| - | - | - | - |

### ⏳ **Pendentes de Migração**

| Página/Componente | Formulários | Complexidade | Prioridade |
|-------------------|-------------|--------------|------------|
| `LoginForm` | 1 | Baixa | Alta |
| `RegisterForm` | 1 | Baixa | Alta |
| `PatientForm` | 1 | Alta | Alta |
| `AppointmentForm` | 1 | Média | Média |
| `PaymentForm` | 1 | Alta | Média |

### 🗑️ **Legacy (Deprecated)**

| Componente | Status | Data Depreciação | Remoção Prevista |
|------------|---------|------------------|------------------|
| `FormField` | 🚨 Deprecated | 2024-01-XX | v2.0.0 |

## 🛠️ **Guia de Migração**

### **1. Preparação**
```bash
npm install react-hook-form @hookform/resolvers zod
```

### **2. Migração Básica**
```tsx
// ANTES (legacy)
const [formData, setFormData] = useState({})
<FormField label="Nome" error={errors.name}>
  <input value={formData.name} onChange={...} />
</FormField>

// DEPOIS (shadcn + react-hook-form)
const form = useForm<FormData>({
  resolver: zodResolver(schema)
})

<Form {...form}>
  <FormFieldWrapper control={form.control} name="name" label="Nome">
    {(field) => <Input {...field} />}
  </FormFieldWrapper>
</Form>
```

### **3. Validação com Zod**
```tsx
const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido")
})
```

## 🎨 **Padrões Estabelecidos**

### **FormFieldWrapper Props**
- `control`: React Hook Form control
- `name`: Campo do formulário
- `label`: Texto do label (opcional)
- `description`: Texto de ajuda (opcional)
- `required`: Indicador obrigatório (opcional)
- `children`: Render prop com field

### **Validação**
- **Obrigatório**: Usar Zod para schemas
- **Mensagens**: Em português
- **Real-time**: Validação no onChange
- **Submit**: Validação completa no submit

### **UI/UX**
- **Cores**: Seguir variáveis CSS Respira KIDS
- **Required**: Asterisco vermelho (`*`)
- **Errors**: Texto vermelho abaixo do campo
- **Description**: Texto cinza de ajuda

## 📈 **Métricas**

| Métrica | Valor | Meta |
|---------|--------|------|
| Componentes Migrados | 1/6 | 100% |
| Páginas Migradas | 1/5 | 100% |
| Cobertura shadcn | 16.7% | 100% |
| Legacy Components | 1 | 0 |

## 🚨 **Boy Scout Rule**

> **"Tocou num form antigo → converte para shadcn"**

Sempre que modificar um formulário existente:
1. Migre para `FormFieldWrapper`
2. Adicione validação Zod
3. Teste thoroughly
4. Atualize esta tabela
5. Deprecie código antigo

## 📝 **Próximos Passos**

1. ⚡ **Alta Prioridade**: LoginForm, RegisterForm
2. 🔄 **Média Prioridade**: PatientForm, AppointmentForm  
3. 🕐 **Baixa Prioridade**: PaymentForm
4. 🗑️ **v2.0.0**: Remover `FormField` deprecated

---
*Última atualização: 2024-01-XX* 