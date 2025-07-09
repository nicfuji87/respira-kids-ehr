import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives"
import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard } from "lucide-react"

export interface FinancialSummary {
  totalRevenue: number
  totalPaid: number
  totalPending: number
  totalOverdue: number
  revenueGrowth: number
  paymentMethodDistribution: {
    dinheiro: number
    cartao: number
    pix: number
    boleto: number
  }
  monthlyData: Array<{
    month: string
    revenue: number
    paid: number
    pending: number
  }>
}

export interface FinancialReportProps {
  data: FinancialSummary
  period: string
  isLoading?: boolean
  className?: string
}

export const FinancialReport = ({
  data,
  period,
  isLoading = false,
  className
}: FinancialReportProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      dinheiro: 'Dinheiro',
      cartao: 'Cartão',
      pix: 'PIX',
      boleto: 'Boleto'
    }
    return labels[method as keyof typeof labels]
  }

  const getPaymentMethodPercentage = (amount: number) => {
    const total = Object.values(data.paymentMethodDistribution).reduce((a, b) => a + b, 0)
    return total > 0 ? ((amount / total) * 100).toFixed(1) : '0'
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-roxo-titulo">Relatório Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-roxo-titulo">
          Relatório Financeiro - {period}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-azul-respira text-white rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Receita Total</p>
                <p className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-75" />
            </div>
            <div className="flex items-center mt-2">
              {data.revenueGrowth > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm">
                {formatPercentage(data.revenueGrowth)} vs período anterior
              </span>
            </div>
          </div>

          <div className="p-4 bg-verde-pipa text-white rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Recebido</p>
                <p className="text-2xl font-bold">{formatCurrency(data.totalPaid)}</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-75" />
            </div>
            <div className="text-sm mt-2">
              {((data.totalPaid / data.totalRevenue) * 100).toFixed(1)}% do total
            </div>
          </div>

          <div className="p-4 bg-amarelo-pipa text-black rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-75">Pendente</p>
                <p className="text-2xl font-bold">{formatCurrency(data.totalPending)}</p>
              </div>
              <Calendar className="h-8 w-8 opacity-75" />
            </div>
            <div className="text-sm mt-2">
              {((data.totalPending / data.totalRevenue) * 100).toFixed(1)}% do total
            </div>
          </div>

          <div className="p-4 bg-vermelho-kids text-white rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Em Atraso</p>
                <p className="text-2xl font-bold">{formatCurrency(data.totalOverdue)}</p>
              </div>
              <TrendingDown className="h-8 w-8 opacity-75" />
            </div>
            <div className="text-sm mt-2">
              {((data.totalOverdue / data.totalRevenue) * 100).toFixed(1)}% do total
            </div>
          </div>
        </div>

        {/* Distribuição por Método de Pagamento */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-roxo-titulo mb-4">
            Distribuição por Método de Pagamento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(data.paymentMethodDistribution).map(([method, amount]) => (
              <div key={method} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {getPaymentMethodLabel(method)}
                  </span>
                  <CreditCard className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-xl font-bold text-roxo-titulo">
                  {formatCurrency(amount)}
                </div>
                <div className="text-sm text-gray-500">
                  {getPaymentMethodPercentage(amount)}% do total
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evolução Mensal */}
        <div>
          <h3 className="text-lg font-semibold text-roxo-titulo mb-4">
            Evolução Mensal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Mês</th>
                  <th className="text-right p-2">Receita</th>
                  <th className="text-right p-2">Recebido</th>
                  <th className="text-right p-2">Pendente</th>
                  <th className="text-right p-2">Taxa de Recebimento</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyData.map((month, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{month.month}</td>
                    <td className="p-2 text-right">{formatCurrency(month.revenue)}</td>
                    <td className="p-2 text-right text-verde-pipa">
                      {formatCurrency(month.paid)}
                    </td>
                    <td className="p-2 text-right text-amarelo-pipa">
                      {formatCurrency(month.pending)}
                    </td>
                    <td className="p-2 text-right">
                      {month.revenue > 0 ? 
                        `${((month.paid / month.revenue) * 100).toFixed(1)}%` : 
                        '0%'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

FinancialReport.displayName = "FinancialReport" 