import * as React from "react"
import { ActionCard } from "@/components/composed/action-card"
import { StatusBadge } from "@/components/composed/status-badge"
import { Button } from "@/components/primitives/button"
import { Calendar, User, Phone } from "lucide-react"

// PatientCard - NÍVEL 3: Componente específico do negócio
// Segue template obrigatório para componentes de domínio

export interface PatientCardProps {
  patient: {
    id: string
    nome: string
    idade: number
    telefone: string
    ultimaConsulta: Date
    status: 'ativo' | 'inativo'
  }
  onEdit: (id: string) => void
  onSchedule: (id: string) => void
  className?: string
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onEdit,
  onSchedule,
  className
}) => {
  return (
    <ActionCard
      title={patient.nome}
      subtitle={`${patient.idade} anos`}
      className={className}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => onEdit(patient.id)}>
            <User className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button size="sm" onClick={() => onSchedule(patient.id)}>
            <Calendar className="h-4 w-4 mr-2" />
            Agendar
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600">
            <Phone className="h-4 w-4 inline mr-1" />
            {patient.telefone}
          </span>
          <StatusBadge status={patient.status} />
        </div>
        <p className="text-sm text-zinc-600">
          Última consulta: {patient.ultimaConsulta.toLocaleDateString('pt-BR')}
        </p>
      </div>
    </ActionCard>
  )
} 