-- Migration: Initial schema with RLS policies
-- Created: January 2025
-- AI dev note: Esta migração cria as tabelas essenciais com políticas RLS para segurança

-- Enable RLS on the schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

-- Criar tabela pessoa_tipos
CREATE TABLE IF NOT EXISTS pessoa_tipos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir tipos padrão
INSERT INTO pessoa_tipos (codigo, nome, descricao) VALUES
('profissional', 'Profissional', 'Profissional de saúde'),
('paciente', 'Paciente', 'Paciente do sistema'),
('responsavel', 'Responsável', 'Responsável legal do paciente'),
('secretaria', 'Secretária', 'Secretária/Recepcionista')
ON CONFLICT (codigo) DO NOTHING;

-- Criar tabela pessoas
CREATE TABLE IF NOT EXISTS pessoas (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14),
    data_nascimento DATE,
    id_tipo_pessoa BIGINT REFERENCES pessoa_tipos(id),
    role VARCHAR(50) DEFAULT 'profissional',
    is_approved BOOLEAN DEFAULT FALSE,
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela enderecos
CREATE TABLE IF NOT EXISTS enderecos (
    id BIGSERIAL PRIMARY KEY,
    pessoa_id BIGINT REFERENCES pessoas(id) ON DELETE CASCADE,
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    pais VARCHAR(50) DEFAULT 'Brasil',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela fontes_indicacao
CREATE TABLE IF NOT EXISTS fontes_indicacao (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir fontes padrão
INSERT INTO fontes_indicacao (nome, descricao) VALUES
('Google', 'Pesquisa no Google'),
('Facebook', 'Rede social Facebook'),
('Instagram', 'Rede social Instagram'),
('Indicação Médica', 'Indicação de outro profissional'),
('Amigos/Família', 'Indicação de amigos ou família'),
('Outros', 'Outras fontes')
ON CONFLICT DO NOTHING;

-- Criar tabela pessoa_indicacoes
CREATE TABLE IF NOT EXISTS pessoa_indicacoes (
    id BIGSERIAL PRIMARY KEY,
    pessoa_id BIGINT REFERENCES pessoas(id) ON DELETE CASCADE,
    fonte_indicacao_id BIGINT REFERENCES fontes_indicacao(id),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela pessoa_responsaveis
CREATE TABLE IF NOT EXISTS pessoa_responsaveis (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT REFERENCES pessoas(id) ON DELETE CASCADE,
    responsavel_id BIGINT REFERENCES pessoas(id) ON DELETE CASCADE,
    tipo_responsabilidade VARCHAR(50) DEFAULT 'legal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(paciente_id, responsavel_id)
);

-- Criar tabela auth_logs
CREATE TABLE IF NOT EXISTS auth_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar view pessoas_profissional_view
CREATE OR REPLACE VIEW pessoas_profissional_view AS
SELECT 
    p.*,
    pt.nome as tipo_pessoa_nome,
    pt.codigo as tipo_pessoa_codigo
FROM pessoas p
JOIN pessoa_tipos pt ON p.id_tipo_pessoa = pt.id
WHERE pt.codigo = 'profissional';

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

-- Ativar RLS em todas as tabelas
ALTER TABLE pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE enderecos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pessoa_indicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pessoa_responsaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela pessoas
CREATE POLICY "Users can view their own profile" ON pessoas
    FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON pessoas
    FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON pessoas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pessoas p 
            WHERE p.auth_user_id = auth.uid() 
            AND p.role = 'admin'
            AND p.is_approved = true
        )
    );

CREATE POLICY "Secretarias can view approved professionals" ON pessoas
    FOR SELECT USING (
        (role = 'profissional' AND is_approved = true) OR
        EXISTS (
            SELECT 1 FROM pessoas p 
            WHERE p.auth_user_id = auth.uid() 
            AND p.role IN ('admin', 'secretaria')
            AND p.is_approved = true
        )
    );

-- Políticas para tabela enderecos
CREATE POLICY "Users can manage their own addresses" ON enderecos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pessoas p 
            WHERE p.id = enderecos.pessoa_id 
            AND p.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all addresses" ON enderecos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pessoas p 
            WHERE p.auth_user_id = auth.uid() 
            AND p.role = 'admin'
            AND p.is_approved = true
        )
    );

-- Políticas para tabela pessoa_indicacoes
CREATE POLICY "Users can manage their own referrals" ON pessoa_indicacoes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pessoas p 
            WHERE p.id = pessoa_indicacoes.pessoa_id 
            AND p.auth_user_id = auth.uid()
        )
    );

-- Políticas para tabela pessoa_responsaveis
CREATE POLICY "Users can view their dependencies" ON pessoa_responsaveis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pessoas p 
            WHERE (p.id = pessoa_responsaveis.paciente_id OR p.id = pessoa_responsaveis.responsavel_id)
            AND p.auth_user_id = auth.uid()
        )
    );

-- Políticas para tabela auth_logs (apenas admins)
CREATE POLICY "Only admins can view auth logs" ON auth_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pessoas p 
            WHERE p.auth_user_id = auth.uid() 
            AND p.role = 'admin'
            AND p.is_approved = true
        )
    );

-- Políticas para tabelas de referência (leitura pública para usuários autenticados)
ALTER TABLE pessoa_tipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fontes_indicacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read pessoa_tipos" ON pessoa_tipos
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read fontes_indicacao" ON fontes_indicacao
    FOR SELECT USING (auth.role() = 'authenticated');

-- Funções de atualização automática
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_pessoas_updated_at BEFORE UPDATE ON pessoas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enderecos_updated_at BEFORE UPDATE ON enderecos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pessoa_tipos_updated_at BEFORE UPDATE ON pessoa_tipos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 