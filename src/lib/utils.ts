import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes CSS usando clsx e tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata valores para moeda brasileira (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Formata datas para o padrão brasileiro
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj)
}

/**
 * Formata telefones brasileiros com máscara
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    // Celular: (99) 99999-9999
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 10) {
    // Fixo: (99) 9999-9999
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

/**
 * Formata CPF com máscara
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  return cpf
}
