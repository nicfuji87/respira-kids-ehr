import { useState } from "react"
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives"
import { FormField } from "@/components/composed"
import { DollarSign, CreditCard, Smartphone, Receipt } from "lucide-react"

export interface PaymentFormData {
  amount: number
  method: 'dinheiro' | 'cartao' | 'pix' | 'boleto'
  installments?: number
  notes?: string
}

export interface PaymentFormProps {
  invoiceId: string
  totalAmount: number
  onSubmit: (data: PaymentFormData) => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export const PaymentForm = ({
  invoiceId,
  totalAmount,
  onSubmit,
  onCancel,
  isLoading = false,
  className
}: PaymentFormProps) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: totalAmount,
    method: 'dinheiro',
    installments: 1,
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const paymentMethods = [
    { value: 'dinheiro', label: 'Dinheiro', icon: DollarSign },
    { value: 'cartao', label: 'Cartão', icon: CreditCard },
    { value: 'pix', label: 'PIX', icon: Smartphone },
    { value: 'boleto', label: 'Boleto', icon: Receipt }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero'
    }
    if (formData.amount > totalAmount) {
      newErrors.amount = 'Valor não pode ser maior que o total da fatura'
    }
    if (!formData.method) {
      newErrors.method = 'Método de pagamento é obrigatório'
    }
    if (formData.method === 'cartao' && (!formData.installments || formData.installments < 1)) {
      newErrors.installments = 'Número de parcelas deve ser pelo menos 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    onSubmit(formData)
  }

  const handleChange = (field: keyof PaymentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getInstallmentValue = () => {
    if (formData.method === 'cartao' && formData.installments) {
      return formData.amount / formData.installments
    }
    return formData.amount
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-roxo-titulo">
          Processar Pagamento
        </CardTitle>
        <div className="text-sm text-gray-600">
          Fatura: #{invoiceId} • Total: {formatCurrency(totalAmount)}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Valor a pagar"
            error={errors.amount}
            required
            htmlFor="amount"
          >
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              placeholder="0,00"
            />
          </FormField>

          <FormField
            label="Método de pagamento"
            error={errors.method}
            required
            htmlFor="method"
          >
            <Select
              value={formData.method}
              onValueChange={(value) => handleChange('method', value as PaymentFormData['method'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {formData.method === 'cartao' && (
            <FormField
              label="Número de parcelas"
              error={errors.installments}
              required
              htmlFor="installments"
            >
              <Select
                value={formData.installments?.toString()}
                onValueChange={(value) => handleChange('installments', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione as parcelas" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => {
                    const parcelas = i + 1
                    const valorParcela = formData.amount / parcelas
                    return (
                      <SelectItem key={parcelas} value={parcelas.toString()}>
                        {parcelas}x de {formatCurrency(valorParcela)}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <FormField
            label="Observações"
            error={errors.notes}
            htmlFor="notes"
          >
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Observações sobre o pagamento..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul-respira"
            />
          </FormField>

          {/* Resumo do pagamento */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Resumo do Pagamento</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Valor:</span>
                <span className="font-medium">{formatCurrency(formData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Método:</span>
                <span className="font-medium">
                  {paymentMethods.find(m => m.value === formData.method)?.label}
                </span>
              </div>
              {formData.method === 'cartao' && formData.installments && (
                <div className="flex justify-between">
                  <span>Parcelas:</span>
                  <span className="font-medium">
                    {formData.installments}x de {formatCurrency(getInstallmentValue())}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Processando...' : 'Confirmar Pagamento'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

PaymentForm.displayName = "PaymentForm" 