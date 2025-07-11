import { useState, useMemo } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/primitives"
import { SearchInput } from "@/components/composed"
import { PatientCard } from "./patient-card"
import { Search, Plus } from "lucide-react"

export interface Patient {
  id: string
  nome: string
  idade: number
  telefone: string
  email: string
  cpf: string
  ultimaConsulta?: string
  proximaConsulta?: string
  status: 'ativo' | 'inativo' | 'pendente'
}

export interface PatientListProps {
  patients?: Patient[]
  onAddPatient?: () => void
  onEditPatient?: (patient: Patient) => void
  onViewPatient?: (patient: Patient) => void
  onDeletePatient?: (patient: Patient) => void
  isLoading?: boolean
  className?: string
}

export const PatientList = ({
  patients = [],
  onAddPatient,
  onEditPatient,
  onViewPatient,
  isLoading = false,
  className
}: PatientListProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'inativo' | 'pendente'>('all')

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.telefone.includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [patients, searchTerm, statusFilter])



  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-roxo-titulo">
            Pacientes ({filteredPatients.length})
          </CardTitle>
          {onAddPatient && (
            <Button onClick={onAddPatient} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Button>
          )}
        </div>
        
        <div className="flex gap-4 mt-4">
          <SearchInput
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={() => {}}
            className="flex-1"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul-respira"
          >
            <option value="all">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum paciente encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando um novo paciente'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={{
                  id: patient.id,
                  nome: patient.nome,
                  idade: patient.idade,
                  telefone: patient.telefone,
                  ultimaConsulta: patient.ultimaConsulta ? new Date(patient.ultimaConsulta) : new Date(),
                  status: patient.status === 'ativo' ? 'ativo' : 'inativo'
                }}
                onEdit={() => onEditPatient?.(patient)}
                onSchedule={() => onViewPatient?.(patient)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

PatientList.displayName = "PatientList" 