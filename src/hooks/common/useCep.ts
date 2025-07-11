import { useState, useCallback } from "react"

export interface CepData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

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
    // Remove tudo que não for número
    const cleanCep = cep.replace(/\D/g, '')
    
    if (cleanCep.length !== 8) {
      setError('CEP deve conter 8 dígitos')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar CEP')
      }

      const data: CepData = await response.json()

      if (data.erro) {
        throw new Error('CEP não encontrado')
      }

      const address: Address = {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        zipCode: data.cep
      }

      return address
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar CEP'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    fetchAddress,
    isLoading,
    error,
    clearError
  }
} 