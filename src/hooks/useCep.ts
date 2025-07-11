import { useState, useCallback } from 'react'

export interface Address {
  street: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export const useCep = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAddress = useCallback(async (cep: string): Promise<Address | null> => {
    if (!cep || cep.length !== 8) {
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setError('CEP não encontrado')
        return null
      }

      return {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        zipCode: data.cep || ''
      }
    } catch {
      setError('Erro ao buscar CEP')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    fetchAddress,
    isLoading,
    error
  }
} 