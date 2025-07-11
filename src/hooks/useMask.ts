export const useMask = () => {
  const applyMask = (value: string, type: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date'): string => {
    const cleanValue = value.replace(/\D/g, '')
    
    switch (type) {
      case 'cpf':
        return cleanValue
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
          .slice(0, 14)
      
      case 'cnpj':
        return cleanValue
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
          .slice(0, 18)
      
      case 'phone':
        if (cleanValue.length <= 10) {
          return cleanValue
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
        }
        return cleanValue
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .slice(0, 15)
      
      case 'cep':
        return cleanValue
          .replace(/(\d{5})(\d)/, '$1-$2')
          .slice(0, 9)
      
      case 'date':
        return cleanValue
          .replace(/(\d{2})(\d)/, '$1/$2')
          .replace(/(\d{2})(\d)/, '$1/$2')
          .slice(0, 10)
      
      default:
        return cleanValue
    }
  }

  const removeMask = (value: string): string => {
    return value.replace(/\D/g, '')
  }

  return {
    applyMask,
    removeMask
  }
} 