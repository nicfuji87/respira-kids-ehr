// AI dev note: Utilitários para manipulação de datas

/**
 * Obtém a data atual no formato brasileiro
 */
export function getCurrentDate(): string {
  return new Date().toLocaleDateString('pt-BR')
}

/**
 * Obtém a data e hora atual no formato brasileiro
 */
export function getCurrentDateTime(): string {
  return new Date().toLocaleString('pt-BR')
}

/**
 * Calcula a diferença em dias entre duas datas
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Adiciona dias a uma data
 */
export function addDays(date: Date | string, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Remove dias de uma data
 */
export function subtractDays(date: Date | string, days: number): Date {
  return addDays(date, -days)
}

/**
 * Verifica se a data é hoje
 */
export function isToday(date: Date | string): boolean {
  const today = new Date()
  const checkDate = new Date(date)
  
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  )
}

/**
 * Verifica se a data é no passado
 */
export function isPast(date: Date | string): boolean {
  return new Date(date) < new Date()
}

/**
 * Verifica se a data é no futuro
 */
export function isFuture(date: Date | string): boolean {
  return new Date(date) > new Date()
}

/**
 * Converte data para formato ISO string
 */
export function toISOString(date: Date | string): string {
  return new Date(date).toISOString()
}

/**
 * Converte data do formato brasileiro (DD/MM/YYYY) para Date
 */
export function fromBrazilianDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
} 