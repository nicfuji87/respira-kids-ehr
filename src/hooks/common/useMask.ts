import { useCallback } from "react"

export type MaskType = 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date'

export const useMask = () => {
  const applyMask = useCallback((value: string, type: MaskType): string => {
    if (!value) return ''
    
    // Remove tudo que não for número
    const cleaned = value.replace(/\D/g, '')
    
    switch (type) {
      case 'cpf':
        return cleaned
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')
          
      case 'cnpj':
        return cleaned
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')
          
      case 'phone':
        if (cleaned.length <= 10) {
          return cleaned
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1')
        } else {
          return cleaned
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1')
        }
        
      case 'cep':
        return cleaned
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{3})\d+?$/, '$1')
          
      case 'date':
        return cleaned
          .replace(/(\d{2})(\d)/, '$1/$2')
          .replace(/(\d{2})(\d)/, '$1/$2')
          .replace(/(\d{4})\d+?$/, '$1')
          
      default:
        return value
    }
  }, [])

  const removeMask = useCallback((value: string): string => {
    return value.replace(/\D/g, '')
  }, [])

  const validateMask = useCallback((value: string, type: MaskType): boolean => {
    const cleaned = removeMask(value)
    
    switch (type) {
      case 'cpf':
        return cleaned.length === 11 && isValidCpf(cleaned)
      case 'cnpj':
        return cleaned.length === 14 && isValidCnpj(cleaned)
      case 'phone':
        return cleaned.length >= 10 && cleaned.length <= 11
      case 'cep':
        return cleaned.length === 8
      case 'date':
        return cleaned.length === 8 && isValidDate(cleaned)
      default:
        return true
    }
  }, [removeMask])

  return {
    applyMask,
    removeMask,
    validateMask
  }
}

// Validação de CPF
const isValidCpf = (cpf: string): boolean => {
  if (cpf.length !== 11 || /^(.)\1*$/.test(cpf)) return false
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  return remainder === parseInt(cpf.charAt(10))
}

// Validação de CNPJ
const isValidCnpj = (cnpj: string): boolean => {
  if (cnpj.length !== 14 || /^(.)\1*$/.test(cnpj)) return false
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights1[i]
  }
  let remainder = sum % 11
  remainder = remainder < 2 ? 0 : 11 - remainder
  if (remainder !== parseInt(cnpj.charAt(12))) return false
  
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights2[i]
  }
  remainder = sum % 11
  remainder = remainder < 2 ? 0 : 11 - remainder
  return remainder === parseInt(cnpj.charAt(13))
}

// Validação de data
const isValidDate = (date: string): boolean => {
  if (date.length !== 8) return false
  
  const day = parseInt(date.substring(0, 2))
  const month = parseInt(date.substring(2, 4))
  const year = parseInt(date.substring(4, 8))
  
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (year < 1900 || year > new Date().getFullYear()) return false
  
  // Verificar dias por mês
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    daysInMonth[1] = 29 // Ano bissexto
  }
  
  return day <= daysInMonth[month - 1]
} 