import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card"
import { Input } from "@/components/primitives/input"
import { Badge } from "@/components/primitives/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/select"
import { FormField } from "@/components/composed"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/auth/useAuth"
import { Stethoscope, Search, Users, Filter } from "lucide-react"

// AI dev note: ProfessionalView - Usa VIEW limitada para profissionais acessarem dados relevantes

interface ProfessionalData {
  id: string
  nome: string | null
  cpf_cnpj: string | null
  data_nascimento: string | null
  id_tipo_pessoa: string
  tipo_pessoa_nome: string
  tipo_pessoa_codigo: string
  registro_profissional: string | null
  especialidade: string | null
  bio_profissional: string | null
  foto_perfil: string | null
  role: string | null
  is_approved: boolean
  profile_complete: boolean
  ativo: boolean
  bloqueado: boolean
  created_at: string
  updated_at: string
  email: string | null
  telefone: string | null
  access_type: string
}

interface ProfessionalViewProps {
  className?: string
}

export const ProfessionalView = ({ className }: ProfessionalViewProps) => {
  const { user, hasRole } = useAuth()
  
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([])
  const [filteredProfessionals, setFilteredProfessionals] = useState<ProfessionalData[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const [specialties, setSpecialties] = useState<string[]>([])

  const applyFilters = useCallback(() => {
    let filtered = professionals

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(prof => 
        prof.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.especialidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.registro_profissional?.includes(searchTerm)
      )
    }

    // Filtro por especialidade
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(prof => prof.especialidade === specialtyFilter)
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(prof => {
        switch (statusFilter) {
          case 'ativo': return prof.ativo && prof.is_approved && !prof.bloqueado
          case 'pendente': return !prof.is_approved
          case 'incompleto': return !prof.profile_complete
          default: return true
        }
      })
    }

    setFilteredProfessionals(filtered)
  }, [professionals, searchTerm, specialtyFilter, statusFilter])

  useEffect(() => {
    if (user && (hasRole(['profissional', 'secretaria', 'admin']))) {
      loadProfessionals()
    }
  }, [user, hasRole])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const loadProfessionals = async () => {
    try {
      // AI dev note: Usando VIEW para acesso limitado baseado no RLS
      const { data, error } = await supabase
        .from('pessoas_profissional_view')
        .select('*')
        .order('nome')

      if (error) throw error
      
      const professionalsData = data || []
      setProfessionals(professionalsData)
      
      // Extrair especialidades únicas para filtro
      const uniqueSpecialties = Array.from(new Set(
        professionalsData
          .map(p => p.especialidade)
          .filter(Boolean)
      )) as string[]
      setSpecialties(uniqueSpecialties)
      
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (prof: ProfessionalData) => {
    if (prof.bloqueado) {
      return <Badge variant="destructive">Bloqueado</Badge>
    }
    if (!prof.is_approved) {
      return <Badge variant="warning">Pendente Aprovação</Badge>
    }
    if (!prof.profile_complete) {
      return <Badge variant="secondary">Perfil Incompleto</Badge>
    }
    if (prof.ativo) {
      return <Badge variant="success">Ativo</Badge>
    }
    return <Badge variant="secondary">Inativo</Badge>
  }

  const getAccessTypeBadge = (accessType: string) => {
    switch (accessType) {
      case 'full_access':
        return <Badge variant="default">Acesso Completo</Badge>
      case 'limited_access':
        return <Badge variant="outline">Acesso Limitado</Badge>
      case 'self_only':
        return <Badge variant="secondary">Apenas Próprios Dados</Badge>
      default:
        return <Badge variant="secondary">Sem Acesso</Badge>
    }
  }

  const canViewFullDetails = (prof: ProfessionalData) => {
    // Admin e secretária podem ver tudo
    if (hasRole(['admin', 'secretaria'])) return true
    
    // Profissionais podem ver apenas dados básicos de outros profissionais
    if (hasRole(['profissional'])) {
      return prof.id === user?.id // Apenas seus próprios dados completos
    }
    
    return false
  }

  if (!user || !hasRole(['profissional', 'secretaria', 'admin'])) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-roxo-titulo">
            <Stethoscope className="h-6 w-6" />
            Diretório de Profissionais
          </h1>
          <p className="text-muted-foreground">
            Consulte informações dos profissionais cadastrados no sistema
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Buscar" htmlFor="search">
              <Input
                id="search"
                placeholder="Nome, especialidade, registro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FormField>
            
            <FormField label="Especialidade" htmlFor="specialty-filter">
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas especialidades</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            
            <FormField label="Status" htmlFor="status-filter">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="pendente">Pendente Aprovação</SelectItem>
                  <SelectItem value="incompleto">Perfil Incompleto</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <div className="flex items-end">
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSpecialtyFilter('all')
                  setStatusFilter('all')
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de profissionais */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Profissionais Encontrados ({filteredProfessionals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roxo-principal"></div>
              </div>
            ) : filteredProfessionals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum profissional encontrado com os filtros aplicados.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProfessionals.map((prof) => (
                  <Card key={prof.id} className="p-4">
                    <div className="space-y-3">
                      {/* Header do card */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-roxo-titulo">
                            {prof.nome || 'Nome não informado'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {prof.tipo_pessoa_nome}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(prof)}
                          {hasRole(['admin']) && getAccessTypeBadge(prof.access_type)}
                        </div>
                      </div>

                      {/* Informações profissionais */}
                      <div className="space-y-2 text-sm">
                        {prof.especialidade && (
                          <div>
                            <span className="font-medium">Especialidade:</span>
                            <p className="text-muted-foreground">{prof.especialidade}</p>
                          </div>
                        )}
                        
                        {prof.registro_profissional && canViewFullDetails(prof) && (
                          <div>
                            <span className="font-medium">Registro:</span>
                            <p className="text-muted-foreground font-mono text-xs">
                              {prof.registro_profissional}
                            </p>
                          </div>
                        )}
                        
                        {canViewFullDetails(prof) && prof.email && (
                          <div>
                            <span className="font-medium">Email:</span>
                            <p className="text-muted-foreground">{prof.email}</p>
                          </div>
                        )}
                        
                        {canViewFullDetails(prof) && prof.telefone && (
                          <div>
                            <span className="font-medium">Telefone:</span>
                            <p className="text-muted-foreground">{prof.telefone}</p>
                          </div>
                        )}
                        
                        {prof.bio_profissional && (
                          <div>
                            <span className="font-medium">Bio:</span>
                            <p className="text-muted-foreground text-xs">
                              {prof.bio_profissional.length > 100 
                                ? `${prof.bio_profissional.substring(0, 100)}...`
                                : prof.bio_profissional
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Nota sobre acesso limitado */}
                      {!canViewFullDetails(prof) && hasRole(['profissional']) && (
                        <div className="text-xs text-muted-foreground italic border-t pt-2">
                          * Informações de contato visíveis apenas para administradores
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre permissões */}
      {hasRole(['profissional']) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Filter className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Política de Privacidade</p>
                <p>
                  Como profissional, você pode visualizar informações básicas de outros profissionais.
                  Dados de contato completos são visíveis apenas para administradores e secretárias.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

ProfessionalView.displayName = "ProfessionalView" 