// AI dev note: Configuração do Supabase - usando apenas auth.users + pessoas unificadas

export const SUPABASE_CONFIG = {
  // URLs e chaves
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Configuração das tabelas
  tables: {
    // Tabela de autenticação (nativa do Supabase)
    auth_users: 'auth.users',
    
    // Tabelas principais
    pessoas: 'pessoas',
    pessoa_tipos: 'pessoa_tipos',
    pessoa_empresas: 'pessoa_empresas',
    pessoa_responsaveis: 'pessoa_responsaveis',
    enderecos: 'enderecos',
    
    // Novas tabelas de indicação
    fontes_indicacao: 'fontes_indicacao',
    pessoa_indicacoes: 'pessoa_indicacoes',
    
    // Views
    pessoas_profissional_view: 'pessoas_profissional_view',
    
    // Outras tabelas do sistema
    appointments: 'appointments',
    patients: 'patients',
    financial_transactions: 'financial_transactions',
  },
  
  // Configuração de RLS
  rls: {
    enabled: true,
    policies: {
      // Pessoas: baseado em role dentro da própria tabela
      pessoas: ['admin_full_access', 'secretaria_view_contacts', 'profissional_own_profile'],
      // Indicações: baseado em role da pessoa
      pessoa_indicacoes: ['admin_all', 'secretaria_view', 'profissional_own'],
      // Fontes: leitura para todos autenticados
      fontes_indicacao: ['read', 'admin_manage'],
    }
  },
  
  // Configuração de real-time
  realtime: {
    enabled: true,
    schema: 'public',
    table: 'pessoas',
    filter: 'auth_user_id=eq.auth.uid()',
  }
} as const

// AI dev note: Estrutura unificada - pessoas contém dados de usuário + perfil
export const DATABASE_SCHEMA = {
  // Tabela principal unificada
  pessoas: {
    // Identificação
    id: 'uuid',
    auth_user_id: 'uuid', // Referência para auth.users
    
    // Dados pessoais
    nome: 'text',
    cpf_cnpj: 'text',
    email: 'text',
    telefone: 'text',
    data_nascimento: 'date',
    
    // Dados profissionais
    registro_profissional: 'text',
    especialidade: 'text',
    bio_profissional: 'text',
    
    // Dados de sistema (migrados de public.users)
    role: "'admin' | 'profissional' | 'secretaria'",
    is_approved: 'boolean',
    profile_complete: 'boolean',
    
    // Status
    ativo: 'boolean',
    bloqueado: 'boolean',
    
    // Relacionamentos
    id_tipo_pessoa: 'uuid',
    id_empresa: 'uuid',
    id_endereco: 'uuid',
  },
  
  // Fontes de indicação (nova tabela)
  fontes_indicacao: {
    id: 'uuid',
    codigo: 'text',
    nome: 'text',
    descricao: 'text',
    ativo: 'boolean',
  },
  
  // Relacionamento pessoas <-> fontes (nova tabela)
  pessoa_indicacoes: {
    id: 'uuid',
    id_pessoa: 'uuid',
    id_fonte_indicacao: 'uuid',
    observacoes: 'text',
    data_indicacao: 'date',
    ativo: 'boolean',
  }
} as const 