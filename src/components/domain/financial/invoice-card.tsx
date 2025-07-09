import { Card, CardContent, Badge } from "@/components/primitives"
import { ActionMenu } from "@/components/composed"
import { Calendar, DollarSign, FileText, User, Download } from "lucide-react"

export interface Invoice {
  id: string
  number: string
  patientName: string
  patientId: string
  date: string
  dueDate: string
  amount: number
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado'
  services: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  paymentMethod?: 'dinheiro' | 'cartao' | 'pix' | 'boleto'
  paidAt?: string
  notes?: string
}

export interface InvoiceCardProps {
  invoice: Invoice
  onView?: (invoice: Invoice) => void
  onEdit?: (invoice: Invoice) => void
  onMarkAsPaid?: (invoice: Invoice) => void
  onCancel?: (invoice: Invoice) => void
  onDownload?: (invoice: Invoice) => void
  className?: string
}

export const InvoiceCard = ({
  invoice,
  onView,
  onEdit,
  onMarkAsPaid,
  onCancel,
  onDownload,
  className
}: InvoiceCardProps) => {
  const getStatusColor = (status: Invoice['status']) => {
    const colors = {
      pendente: 'bg-amarelo-pipa text-black',
      pago: 'bg-verde-pipa text-white',
      vencido: 'bg-vermelho-kids text-white',
      cancelado: 'bg-gray-400 text-white'
    }
    return colors[status]
  }

  const getStatusLabel = (status: Invoice['status']) => {
    const labels = {
      pendente: 'Pendente',
      pago: 'Pago',
      vencido: 'Vencido',
      cancelado: 'Cancelado'
    }
    return labels[status]
  }

  const getPaymentMethodLabel = (method: Invoice['paymentMethod']) => {
    const labels = {
      dinheiro: 'Dinheiro',
      cartao: 'Cartão',
      pix: 'PIX',
      boleto: 'Boleto'
    }
    return method ? labels[method] : 'N/A'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const isOverdue = () => {
    if (invoice.status === 'pago' || invoice.status === 'cancelado') return false
    return new Date(invoice.dueDate) < new Date()
  }

  const getDaysOverdue = () => {
    const today = new Date()
    const dueDate = new Date(invoice.dueDate)
    const diffTime = today.getTime() - dueDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getActions = () => {
    const actions = []

    if (onView) {
      actions.push({
        label: 'Visualizar',
        onClick: () => onView(invoice),
        icon: <FileText className="h-4 w-4" />
      })
    }

    if (onDownload) {
      actions.push({
        label: 'Download',
        onClick: () => onDownload(invoice),
        icon: <Download className="h-4 w-4" />
      })
    }

    if (onMarkAsPaid && invoice.status === 'pendente') {
      actions.push({
        label: 'Marcar como Pago',
        onClick: () => onMarkAsPaid(invoice),
        icon: <DollarSign className="h-4 w-4" />
      })
    }

    if (onEdit && invoice.status !== 'pago') {
      actions.push({
        label: 'Editar',
        onClick: () => onEdit(invoice),
        icon: <FileText className="h-4 w-4" />
      })
    }

    if (onCancel && invoice.status !== 'pago' && invoice.status !== 'cancelado') {
      actions.push({
        label: 'Cancelar',
        onClick: () => onCancel(invoice),
        variant: 'destructive' as const,
        icon: <FileText className="h-4 w-4" />
      })
    }

    return actions
  }

  return (
    <Card className={`${className} theme-transition`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-roxo-titulo">
                Fatura #{invoice.number}
              </h3>
              <Badge className={getStatusColor(invoice.status)}>
                {getStatusLabel(invoice.status)}
              </Badge>
              {isOverdue() && (
                <Badge className="bg-vermelho-kids text-white">
                  {getDaysOverdue()} dia(s) em atraso
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{invoice.patientName}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Emitida: {new Date(invoice.date).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Vence: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-roxo-titulo">
              {formatCurrency(invoice.amount)}
            </div>
            {invoice.paymentMethod && (
              <div className="text-sm text-gray-500">
                {getPaymentMethodLabel(invoice.paymentMethod)}
              </div>
            )}
            {invoice.paidAt && (
              <div className="text-sm text-verde-pipa">
                Pago em {new Date(invoice.paidAt).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        </div>

        {/* Serviços */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-gray-700">Serviços:</h4>
          {invoice.services.map((service, index) => (
            <div key={index} className="flex justify-between text-sm text-gray-600">
              <span>{service.description} ({service.quantity}x)</span>
              <span>{formatCurrency(service.total)}</span>
            </div>
          ))}
        </div>

        {invoice.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {getActions().length > 0 && (
          <div className="flex justify-end">
            <ActionMenu items={getActions()} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

InvoiceCard.displayName = "InvoiceCard" 