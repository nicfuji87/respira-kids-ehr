import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/primitives/card"
import { Input } from "@/components/primitives/input"

import { Button } from "@/components/primitives/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/select"
import { FormField } from "@/components/composed"
import { supabase } from "@/lib/supabase"
import { useMask } from "@/hooks/common/useMask"
import { useCep } from "@/hooks/common/useCep"
import { cn } from "@/lib/utils"
import { CalendarDays, Users, MapPin, Info } from "lucide-react"

// AI dev note: PatientForm integrado com estrutura pessoas, relacionamentos e endereços

interface FonteIndicacao {
  id: string
  codigo: string
  nome: string
  descricao: string
}

interface ResponsavelData {
  nome: string
  cpf: string
  telefone: string
  email: string
  tipo_responsabilidade: 'legal' | 'financeiro' | 'ambos'
}

interface PatientFormData {
  // Dados pessoais
  nome: string
  cpf: string
  data_nascimento: string
  telefone: string
  email: string
  
  // Endereço
  cep: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  complemento: string
  
  // Indicação
  fonte_indicacao: string
  observacoes_indicacao: string
  
  // Responsável (se menor de idade)
  precisaResponsavel: boolean
  responsavel: ResponsavelData
}

export interface PatientFormProps {
  initialData?: Partial<PatientFormData>
  onSubmit?: (data: PatientFormData) => void
  onCancel?: () => void
  className?: string
}

export const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  className
}) => {
  const { applyMask } = useMask()
  const { fetchAddress, isLoading: cepLoading } = useCep()
  
  const [formData, setFormData] = useState<PatientFormData>({
    // Dados pessoais
    nome: initialData?.nome || '',
    cpf: initialData?.cpf || '',
    data_nascimento: initialData?.data_nascimento || '',
    telefone: initialData?.telefone || '',
    email: initialData?.email || '',
    
    // Endereço
    cep: initialData?.cep || '',
    logradouro: initialData?.logradouro || '',
    numero: initialData?.numero || '',
    bairro: initialData?.bairro || '',
    cidade: initialData?.cidade || '',
    estado: initialData?.estado || '',
    complemento: initialData?.complemento || '',
    
    // Indicação
    fonte_indicacao: initialData?.fonte_indicacao || '',
    observacoes_indicacao: initialData?.observacoes_indicacao || '',
    
    // Responsável
    precisaResponsavel: initialData?.precisaResponsavel || false,
    responsavel: initialData?.responsavel || {
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      tipo_responsabilidade: 'ambos'
    }
  })

  const [fontesIndicacao, setFontesIndicacao] = useState<FonteIndicacao[]>([])
  const [loadingFontes, setLoadingFontes] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Carregar fontes de indicação
  useEffect(() => {
    loadFontesIndicacao()
  }, [])

  // Verificar se precisa de responsável ao alterar data de nascimento
  useEffect(() => {
    if (formData.data_nascimento) {
      const birthDate = new Date(formData.data_nascimento)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      const precisaResponsavel = age < 18
      setFormData(prev => ({ ...prev, precisaResponsavel }))
    }
  }, [formData.data_nascimento])

  const loadFontesIndicacao = async () => {
    try {
      const { data, error } = await supabase
        .from('fontes_indicacao')
        .select('id, codigo, nome, descricao')
        .eq('ativo', true)
        .order('nome')

      if (error) throw error
      setFontesIndicacao(data || [])
    } catch (error) {
      console.error('Erro ao carregar fontes de indicação:', error)
    } finally {
      setLoadingFontes(false)
    }
  }

  const handleCepChange = async (cep: string) => {
    const maskedCep = applyMask(cep, 'cep')
    setFormData(prev => ({ ...prev, cep: maskedCep }))
    
    if (maskedCep.replace(/\D/g, '').length === 8) {
      const address = await fetchAddress(maskedCep)
      if (address) {
        setFormData(prev => ({
          ...prev,
          logradouro: address.street,
          bairro: address.neighborhood,
          cidade: address.city,
          estado: address.state
        }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validações básicas
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório'
    if (!formData.data_nascimento) newErrors.data_nascimento = 'Data de nascimento é obrigatória'
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório'
    if (!formData.fonte_indicacao) newErrors.fonte_indicacao = 'Fonte de indicação é obrigatória'
    
    // Validação de endereço
    if (!formData.cep) newErrors.cep = 'CEP é obrigatório'
    if (!formData.numero) newErrors.numero = 'Número é obrigatório'
    
    // Validação de responsável se necessário
    if (formData.precisaResponsavel) {
      if (!formData.responsavel.nome) newErrors['responsavel.nome'] = 'Nome do responsável é obrigatório'
      if (!formData.responsavel.cpf) newErrors['responsavel.cpf'] = 'CPF do responsável é obrigatório'
      if (!formData.responsavel.telefone) newErrors['responsavel.telefone'] = 'Telefone do responsável é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Buscar tipo pessoa 'paciente'
      const { data: tipoPaciente } = await supabase
        .from('pessoa_tipos')
        .select('id')
        .eq('codigo', 'paciente')
        .single()

      if (!tipoPaciente) {
        throw new Error('Tipo pessoa paciente não encontrado')
      }

      // Criar ou buscar endereço
      let enderecoId: string | null = null
      const { data: enderecoExistente } = await supabase
        .from('enderecos')
        .select('id')
        .eq('cep', formData.cep.replace(/\D/g, ''))
        .single()

      if (enderecoExistente) {
        enderecoId = enderecoExistente.id
      } else {
        const { data: novoEndereco, error: enderecoError } = await supabase
          .from('enderecos')
          .insert({
            cep: formData.cep.replace(/\D/g, ''),
            logradouro: formData.logradouro,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado
          })
          .select('id')
          .single()

        if (enderecoError) throw enderecoError
        enderecoId = novoEndereco.id
      }

      // Criar pessoa paciente
      const { data: novaPessoa, error: pessoaError } = await supabase
        .from('pessoas')
        .insert({
          nome: formData.nome,
          cpf_cnpj: formData.cpf.replace(/\D/g, ''),
          data_nascimento: formData.data_nascimento,
          telefone: formData.telefone.replace(/\D/g, ''),
          email: formData.email || null,
          id_tipo_pessoa: tipoPaciente.id,
          id_endereco: enderecoId,
          numero_endereco: formData.numero,
          complemento_endereco: formData.complemento || null,
          role: null, // Pacientes não têm role de sistema
          is_approved: true, // Pacientes são aprovados automaticamente
          profile_complete: true,
          ativo: true
        })
        .select('id')
        .single()

      if (pessoaError) throw pessoaError

      // Criar indicação
      await supabase
        .from('pessoa_indicacoes')
        .insert({
          id_pessoa: novaPessoa.id,
          id_fonte_indicacao: formData.fonte_indicacao,
          observacoes: formData.observacoes_indicacao || null
        })

      // Criar responsável se necessário
      if (formData.precisaResponsavel) {
        // Buscar tipo pessoa 'responsavel'
        const { data: tipoResponsavel } = await supabase
          .from('pessoa_tipos')
          .select('id')
          .eq('codigo', 'responsavel')
          .single()

        // Criar pessoa responsável
        const { data: novoResponsavel, error: responsavelError } = await supabase
          .from('pessoas')
          .insert({
            nome: formData.responsavel.nome,
            cpf_cnpj: formData.responsavel.cpf.replace(/\D/g, ''),
            telefone: formData.responsavel.telefone.replace(/\D/g, ''),
            email: formData.responsavel.email || null,
            id_tipo_pessoa: tipoResponsavel?.id,
            role: null,
            is_approved: true,
            profile_complete: true,
            ativo: true
          })
          .select('id')
          .single()

        if (responsavelError) throw responsavelError

        // Criar relacionamento de responsabilidade
        await supabase
          .from('pessoa_responsaveis')
          .insert({
            id_pessoa: novaPessoa.id,
            id_responsavel: novoResponsavel.id,
            tipo_responsabilidade: formData.responsavel.tipo_responsabilidade
          })
      }

      onSubmit?.(formData)
    } catch (error) {
      console.error('Erro ao salvar paciente:', error)
      setErrors({
        general: error instanceof Error ? error.message : 'Erro ao salvar paciente. Tente novamente.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('responsavel.')) {
      const responsavelField = field.replace('responsavel.', '')
      setFormData(prev => ({
        ...prev,
        responsavel: {
          ...prev.responsavel,
          [responsavelField]: responsavelField === 'cpf' ? applyMask(value, 'cpf') 
                          : responsavelField === 'telefone' ? applyMask(value, 'phone')
                          : value
        }
      }))
    } else {
      let processedValue = value
      if (field === 'cpf') processedValue = applyMask(value, 'cpf')
      if (field === 'telefone') processedValue = applyMask(value, 'phone')
      
      setFormData(prev => ({ ...prev, [field]: processedValue }))
    }
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className={cn("max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-roxo-titulo">
          <Users className="h-5 w-5" />
          Cadastro de Paciente
        </CardTitle>
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p>Preencha todos os dados do paciente. Se for menor de idade, será necessário informar um responsável.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-medium text-roxo-titulo">
              <CalendarDays className="h-4 w-4" />
              Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nome completo" error={errors.nome} required>
                <Input
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Nome completo do paciente"
                />
              </FormField>

              <FormField label="CPF" error={errors.cpf}>
                <Input
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </FormField>

              <FormField label="Data de nascimento" error={errors.data_nascimento} required>
                <Input
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => handleChange('data_nascimento', e.target.value)}
                />
              </FormField>

              <FormField label="Telefone" error={errors.telefone} required>
                <Input
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </FormField>

              <FormField label="Email" error={errors.email}>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </FormField>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-medium text-roxo-titulo">
              <MapPin className="h-4 w-4" />
              Endereço
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="CEP" error={errors.cep} required>
                <Input
                  value={formData.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  disabled={cepLoading}
                />
              </FormField>

              <FormField label="Logradouro" error={errors.logradouro}>
                <Input
                  value={formData.logradouro}
                  onChange={(e) => handleChange('logradouro', e.target.value)}
                  placeholder="Rua, Avenida..."
                />
              </FormField>

              <FormField label="Número" error={errors.numero} required>
                <Input
                  value={formData.numero}
                  onChange={(e) => handleChange('numero', e.target.value)}
                  placeholder="123"
                />
              </FormField>

              <FormField label="Bairro" error={errors.bairro}>
                <Input
                  value={formData.bairro}
                  onChange={(e) => handleChange('bairro', e.target.value)}
                  placeholder="Nome do bairro"
                />
              </FormField>

              <FormField label="Cidade" error={errors.cidade}>
                <Input
                  value={formData.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                  placeholder="Nome da cidade"
                />
              </FormField>

              <FormField label="Estado" error={errors.estado}>
                <Input
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                />
              </FormField>

              <FormField label="Complemento" error={errors.complemento}>
                <Input
                  value={formData.complemento}
                  onChange={(e) => handleChange('complemento', e.target.value)}
                  placeholder="Apto, Casa..."
                />
              </FormField>
            </div>
          </div>

          {/* Indicação */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-roxo-titulo">Como conheceu a Respira KIDS?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Fonte de indicação" error={errors.fonte_indicacao} required>
                <Select
                  value={formData.fonte_indicacao}
                  onValueChange={(value) => handleChange('fonte_indicacao', value)}
                  disabled={loadingFontes}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFontes ? "Carregando..." : "Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {fontesIndicacao.map((fonte) => (
                      <SelectItem key={fonte.id} value={fonte.id}>
                        {fonte.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Observações" error={errors.observacoes_indicacao}>
                <Input
                  value={formData.observacoes_indicacao}
                  onChange={(e) => handleChange('observacoes_indicacao', e.target.value)}
                  placeholder="Detalhes sobre a indicação"
                />
              </FormField>
            </div>
          </div>

          {/* Responsável */}
          {formData.precisaResponsavel && (
            <div className="space-y-4 p-4 border rounded-lg bg-yellow-50">
              <h3 className="text-lg font-medium text-roxo-titulo">
                Dados do Responsável (menor de idade)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome do responsável" error={errors['responsavel.nome']} required>
                  <Input
                    value={formData.responsavel.nome}
                    onChange={(e) => handleChange('responsavel.nome', e.target.value)}
                    placeholder="Nome completo do responsável"
                  />
                </FormField>

                <FormField label="CPF do responsável" error={errors['responsavel.cpf']} required>
                  <Input
                    value={formData.responsavel.cpf}
                    onChange={(e) => handleChange('responsavel.cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </FormField>

                <FormField label="Telefone do responsável" error={errors['responsavel.telefone']} required>
                  <Input
                    value={formData.responsavel.telefone}
                    onChange={(e) => handleChange('responsavel.telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                </FormField>

                <FormField label="Email do responsável" error={errors['responsavel.email']}>
                  <Input
                    type="email"
                    value={formData.responsavel.email}
                    onChange={(e) => handleChange('responsavel.email', e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </FormField>

                <FormField label="Tipo de responsabilidade" error={errors['responsavel.tipo_responsabilidade']}>
                  <Select
                    value={formData.responsavel.tipo_responsabilidade}
                    onValueChange={(value) => handleChange('responsavel.tipo_responsabilidade', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="text-sm text-vermelho-kids text-center p-3 bg-red-50 rounded">
              {errors.general}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Salvando...' : 'Salvar Paciente'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 