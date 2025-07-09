import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/primitives"
import { Calendar, FileText, User } from "lucide-react"

export interface MedicalRecord {
  id: string
  date: string
  doctor: string
  specialty: string
  type: 'consulta' | 'exame' | 'procedimento' | 'receita'
  description: string
  diagnosis?: string
  notes?: string
  attachments?: string[]
}

export interface MedicalHistoryProps {
  patientId: string
  patientName: string
  records: MedicalRecord[]
  isLoading?: boolean
  onRecordClick?: (record: MedicalRecord) => void
  className?: string
}

export const MedicalHistory = ({
  patientName,
  records,
  isLoading = false,
  onRecordClick,
  className
}: MedicalHistoryProps) => {
  const getTypeLabel = (type: MedicalRecord['type']) => {
    const labels = {
      consulta: 'Consulta',
      exame: 'Exame',
      procedimento: 'Procedimento',
      receita: 'Receita'
    }
    return labels[type]
  }

  const getTypeColor = (type: MedicalRecord['type']) => {
    const colors = {
      consulta: 'bg-azul-respira text-white',
      exame: 'bg-verde-pipa text-white',
      procedimento: 'bg-amarelo-pipa text-black',
      receita: 'bg-roxo-titulo text-white'
    }
    return colors[type]
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-roxo-titulo">Histórico Médico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
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
        <CardTitle className="text-roxo-titulo">
          Histórico Médico - {patientName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum registro médico encontrado
            </h3>
            <p className="text-gray-500">
              O histórico médico aparecerá aqui quando disponível
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  onRecordClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRecordClick?.(record)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getTypeColor(record.type)}>
                      {getTypeLabel(record.type)}
                    </Badge>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {record.description}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {record.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Dr. {record.doctor}
                    </span>
                  </div>
                  {record.diagnosis && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {record.diagnosis}
                      </span>
                    </div>
                  )}
                </div>

                {record.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>
                )}

                {record.attachments && record.attachments.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    {record.attachments.length} anexo(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

MedicalHistory.displayName = "MedicalHistory" 