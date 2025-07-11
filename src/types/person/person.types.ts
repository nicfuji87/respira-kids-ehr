// AI dev note: Types para pessoa - incluindo campos de aprovação migrados de public.users

// ========== TIPOS BASE ==========
export interface PersonType {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  telefone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
  created_at: string;
  updated_at: string;
}

// ========== NOVAS TABELAS ==========
export interface FonteIndicacao {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface PessoaIndicacao {
  id: string;
  id_pessoa: string;
  id_fonte_indicacao: string;
  observacoes?: string;
  data_indicacao: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// ========== TYPES PRINCIPAIS ==========
export interface Person {
  id: string;
  id_tipo_pessoa: string;
  id_empresa?: string;
  id_endereco?: string;
  auth_user_id?: string;
  nome: string;
  cpf_cnpj?: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  registro_profissional?: string;
  especialidade?: string;
  bio_profissional?: string;
  foto_perfil?: string;
  numero_endereco?: string;
  complemento_endereco?: string;
  // Campos de aprovação migrados de public.users
  role?: 'admin' | 'profissional' | 'secretaria';
  is_approved: boolean;
  profile_complete: boolean;
  ativo: boolean;
  bloqueado: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonResponsibility {
  id: string;
  id_pessoa: string;
  id_responsavel: string;
  tipo_responsabilidade: 'legal' | 'financeira' | 'ambas';
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// ========== TYPES EXPANDIDOS ==========
export interface PersonWithRelations extends Person {
  tipo_pessoa?: PersonType;
  empresa?: Company;
  endereco?: Address;
  responsabilidades?: PersonResponsibility[];
  dependentes?: PersonResponsibility[];
  indicacoes?: (PessoaIndicacao & { fonte_indicacao?: FonteIndicacao })[];
}

export interface PersonWithResponsibilities extends Person {
  responsabilidades: (PersonResponsibility & { responsavel: Person })[];
  dependentes: (PersonResponsibility & { pessoa: Person })[];
}

// ========== TYPES PARA FORMS ==========
export interface PersonFormData {
  nome: string;
  cpf_cnpj?: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  id_tipo_pessoa: string;
  registro_profissional?: string;
  especialidade?: string;
  bio_profissional?: string;
  numero_endereco?: string;
  complemento_endereco?: string;
  // Campos de aprovação
  role?: 'admin' | 'profissional' | 'secretaria';
  is_approved?: boolean;
  profile_complete?: boolean;
  // Endereço (se novo)
  cep?: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  complemento?: string;
  // Empresa (se aplicável)
  id_empresa?: string;
  // Responsabilidades
  responsabilidades?: {
    id_responsavel: string;
    tipo_responsabilidade: 'legal' | 'financeira' | 'ambas';
    observacoes?: string;
  }[];
  // Indicações
  indicacoes?: {
    id_fonte_indicacao: string;
    observacoes?: string;
    data_indicacao?: string;
  }[];
}

// ========== TYPES PARA VIEWS ==========
export interface PersonProfessionalView {
  id: string;
  nome: string;
  cpf_cnpj?: string;
  data_nascimento?: string;
  id_tipo_pessoa: string;
  tipo_pessoa_nome?: string;
  tipo_pessoa_codigo?: string;
  registro_profissional?: string;
  especialidade?: string;
  bio_profissional?: string;
  foto_perfil?: string;
  role?: 'admin' | 'profissional' | 'secretaria';
  is_approved: boolean;
  profile_complete: boolean;
  ativo: boolean;
  bloqueado: boolean;
  created_at: string;
  updated_at: string;
  email?: string | null; // Visible only if own profile
  telefone?: string | null; // Visible only if own profile
  access_type: 'own_profile' | 'patient_data';
} 