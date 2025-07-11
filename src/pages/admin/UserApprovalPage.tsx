import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Label } from "@/components/primitives/label"
import { Badge } from "@/components/primitives/badge"
import { Spinner } from "@/components/primitives/spinner"
import { DataTable, type DataTableColumn } from "@/components/composed/data-table"
import { Modal } from "@/components/primitives/modal"
import { cn } from "@/lib/utils"
import { type UserRole } from "@/contexts/auth.utils"
import { usePermissions } from "@/hooks/usePermissions"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Simple toast implementation
const toast = {
  success: (message: string) => console.log('✅', message),
  error: (message: string) => console.error('❌', message)
}

// AI dev note: Página de aprovação atualizada para usar tabela pessoas
export type UserApprovalStatus = 'pending' | 'approved'

export interface PendingUser {
  id: string
  nome: string
  email: string
  role: UserRole
  created_at: string
  auth_user_id: string | null
  is_approved: boolean
  profile_complete: boolean
  ativo: boolean
  bloqueado: boolean
  pessoa_tipos?: {
    codigo: string
    nome: string
  } | null
}

export interface ApprovalData {
  role: UserRole
  observacoes?: string
}

export interface UserApprovalPageProps {
  className?: string
}

export default function UserApprovalPage({ className }: UserApprovalPageProps) {
  const { canApproveUsers } = usePermissions()
  
  const [users, setUsers] = useState<PendingUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)

  // Filtros
  const [statusFilter, setStatusFilter] = useState<UserApprovalStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  
  // Modal de aprovação
  const [approvalData, setApprovalData] = useState<ApprovalData>({ role: 'profissional' })
  const [submitting, setSubmitting] = useState(false)

  // Carregar usuários
  useEffect(() => {
    if (!canApproveUsers) return
    loadUsers()
  }, [canApproveUsers])

  // Aplicar filtros
  useEffect(() => {
    let filtered = users

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (statusFilter === 'pending') return !user.is_approved
        if (statusFilter === 'approved') return user.is_approved
        return false
      })
    }

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (dateFilter) {
      filtered = filtered.filter(user => 
        user.created_at.startsWith(dateFilter)
      )
    }

    setFilteredUsers(filtered)
  }, [users, statusFilter, searchTerm, dateFilter])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('pessoas')
        .select(`
          id, 
          nome, 
          email, 
          role, 
          created_at, 
          auth_user_id, 
          is_approved,
          profile_complete,
          ativo,
          bloqueado,
          pessoa_tipos:id_tipo_pessoa(codigo, nome)
        `)
        .in('role', ['profissional', 'secretaria', 'admin'])
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transformar dados para o tipo esperado
      const transformedData = (data || []).map(user => ({
        ...user,
        pessoa_tipos: Array.isArray(user.pessoa_tipos) && user.pessoa_tipos.length > 0 
          ? user.pessoa_tipos[0] 
          : null
      })) as PendingUser[]
      
      setUsers(transformedData)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string, data: ApprovalData) => {
    try {
      setSubmitting(true)
      
      // Atualizar registro na tabela pessoas para aprovado
      const { error: updateError } = await supabase
        .from('pessoas')
        .update({
          role: data.role,
          is_approved: true,
          ativo: true
        })
        .eq('id', userId)

      if (updateError) throw updateError

      toast.success('Usuário aprovado com sucesso!')
      setApprovalModalOpen(false)
      setSelectedUser(null)
      loadUsers()
      
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error)
      toast.error('Erro ao aprovar usuário')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async (userId: string) => {
    try {
      // Implementar soft delete marcando como bloqueado
      const { error } = await supabase
        .from('pessoas')
        .update({
          bloqueado: true,
          ativo: false
        })
        .eq('id', userId)

      if (error) throw error
      
      toast.success('Usuário rejeitado')
      loadUsers()
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error)
      toast.error('Erro ao rejeitar usuário')
    }
  }

  const getStatusBadge = (user: PendingUser) => {
    if (user.bloqueado) {
      return <Badge variant="destructive">Rejeitado</Badge>
    }
    if (user.is_approved) {
      return <Badge variant="success">Aprovado</Badge>
    }
    return <Badge variant="warning">Pendente</Badge>
  }

  const columns: DataTableColumn<PendingUser>[] = [
    {
      key: 'nome',
      header: 'Nome',
      cell: (user) => (
        <div className="flex flex-col">
          <span className="font-medium">{user.nome || 'Nome não informado'}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      cell: (user) => <Badge variant="outline">{user.role}</Badge>
    },
    {
      key: 'created_at',
      header: 'Data Cadastro',
      cell: (user) => format(new Date(user.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    },
    {
      key: 'is_approved',
      header: 'Status',
      cell: (user) => getStatusBadge(user)
    },
    {
      key: 'id',
      header: 'Ações',
      cell: (user) => (
        <div className="flex gap-2">
          {!user.is_approved && !user.bloqueado && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  setSelectedUser(user)
                  setApprovalData({ role: user.role })
                  setApprovalModalOpen(true)
                }}
              >
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(user.id)}
              >
                Rejeitar
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedUser(user)
              setApprovalModalOpen(true)
            }}
          >
            Detalhes
          </Button>
        </div>
      )
    }
  ]

  if (!canApproveUsers) {
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
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-roxo-titulo">Aprovação de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie aprovações de novos usuários do sistema
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as UserApprovalStatus | 'all')}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="date-filter">Data</Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <DataTable
              data={filteredUsers}
              columns={columns}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de Aprovação */}
      <Modal
        open={approvalModalOpen}
        onOpenChange={setApprovalModalOpen}
        title="Aprovar Usuário"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">{selectedUser.nome || 'Nome não informado'}</h3>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              <p className="text-sm text-muted-foreground">
                Tipo: {selectedUser.pessoa_tipos?.nome || 'Não definido'}
              </p>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={approvalData.role}
                onChange={(e) => setApprovalData({ ...approvalData, role: e.target.value as UserRole })}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="profissional">Profissional</option>
                <option value="secretaria">Secretária</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                rows={3}
                value={approvalData.observacoes || ''}
                onChange={(e) => setApprovalData({ ...approvalData, observacoes: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Observações sobre a aprovação..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              {!selectedUser.is_approved && !selectedUser.bloqueado && (
                <>
                  <Button
                    variant="default"
                    onClick={() => handleApprove(selectedUser.id, approvalData)}
                    disabled={submitting}
                  >
                    {submitting ? <Spinner size="sm" /> : 'Aprovar'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedUser.id)}
                    disabled={submitting}
                  >
                    Rejeitar
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setApprovalModalOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
} 