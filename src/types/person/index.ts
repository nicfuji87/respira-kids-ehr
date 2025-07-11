// AI dev note: Barrel exports para tipos de pessoa - atualizados com novos tipos
export type {
  // Tipos base
  PersonType,
  Company,
  Address,
  // Novas tabelas
  FonteIndicacao,
  PessoaIndicacao,
  // Tipos principais
  Person,
  PersonResponsibility,
  // Tipos expandidos
  PersonWithRelations,
  PersonWithResponsibilities,
  // Tipos para forms
  PersonFormData,
  // Tipos para views
  PersonProfessionalView
} from './person.types' 