import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card"
import { Button } from "@/components/primitives/button"
import { FormField } from "@/components/composed"
import { Input } from "@/components/primitives/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/select"
import { useAuth } from "@/hooks/auth/useAuth"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff, Info } from "lucide-react"
import type { RegisterFormData } from "@/schemas/auth/auth.schemas"
import { registerSchema } from "@/schemas/auth/auth.schemas"
import { ZodError } from "zod"

// AI dev note: RegisterForm atualizado para usar schema correto e incluir fontes de indicação

interface FonteIndicacao {
  id: string
  codigo: string
  nome: string
  descricao: string
}

interface RegisterFormProps {
  onSuccess?: () => void
  className?: string
}

interface RegisterFormState extends RegisterFormData {
  fonteIndicacao: string
}

export const RegisterForm = ({ onSuccess, className }: RegisterFormProps) => {
  const { signUp } = useAuth()
  const [formData, setFormData] = useState<RegisterFormState>({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    fonteIndicacao: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fontesIndicacao, setFontesIndicacao] = useState<FonteIndicacao[]>([])
  const [loadingFontes, setLoadingFontes] = useState(true)

  // Carregar fontes de indicação
  useEffect(() => {
    loadFontesIndicacao()
  }, [])

  const loadFontesIndicacao = async () => {
    try {
      const { data, error } = await supabase
        .from('fontes_indicacao')
        .select('id, codigo, nome, descricao')
        .eq('ativo', true)
        .order('nome')

      if (error) throw error
      setFontesIndicacao(data || [])
    } catch (error) {
      console.error('Erro ao carregar fontes de indicação:', error)
      setErrors({
        general: 'Erro ao carregar dados. Recarregue a página.'
      })
    } finally {
      setLoadingFontes(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validação usando schema do zod
    try {
      registerSchema.parse({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms
      })
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors?.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
      }
    }

    // Validação adicional para fonte de indicação
    if (!formData.fonteIndicacao) {
      newErrors.fonteIndicacao = 'Fonte de indicação é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Primeiro, fazer o registro via AuthContext
      await signUp(formData.email, formData.password, '')

      // Em seguida, adicionar a fonte de indicação (usando auth.user.id quando disponível)
      // Nota: O perfil será criado pelo AuthContext, precisamos apenas adicionar a indicação
      
      // Buscar o usuário recém-criado na tabela pessoas
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: pessoa } = await supabase
          .from('pessoas')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (pessoa) {
          // Criar relacionamento pessoa-indicação
          await supabase
            .from('pessoa_indicacoes')
            .insert({
              id_pessoa: pessoa.id,
              id_fonte_indicacao: formData.fonteIndicacao,
              observacoes: 'Fonte informada no registro'
            })
        }
      }

      onSuccess?.()
    } catch (error) {
      console.error('Erro no registro:', error)
      setErrors({
        general: error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof RegisterFormState, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center text-roxo-titulo">
          Criar Nova Conta
        </CardTitle>
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Como funciona o cadastro:</p>
            <p>1. Preencha seus dados básicos</p>
            <p>2. Aguarde aprovação da administração</p>
            <p>3. Complete seu perfil após aprovação</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email"
            error={errors.email}
            required
            htmlFor="email"
          >
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="seu@email.com"
            />
          </FormField>

          <FormField
            label="Como conheceu a Respira KIDS?"
            error={errors.fonteIndicacao}
            required
            htmlFor="fonteIndicacao"
          >
            <Select
              value={formData.fonteIndicacao}
              onValueChange={(value) => handleChange('fonteIndicacao', value)}
              disabled={loadingFontes}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingFontes ? "Carregando..." : "Selecione uma opção"} />
              </SelectTrigger>
              <SelectContent>
                {fontesIndicacao.map((fonte) => (
                  <SelectItem key={fonte.id} value={fonte.id}>
                    <div>
                      <div className="font-medium">{fonte.nome}</div>
                      {fonte.descricao && (
                        <div className="text-sm text-muted-foreground">{fonte.descricao}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Senha"
            error={errors.password}
            required
            htmlFor="password"
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormField>

          <FormField
            label="Confirmar senha"
            error={errors.confirmPassword}
            required
            htmlFor="confirmPassword"
          >
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Confirme sua senha"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormField>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => handleChange('acceptTerms', e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-600">
              Eu aceito os{' '}
              <a href="/terms" className="text-roxo-principal hover:underline">
                termos de uso
              </a>{' '}
              e{' '}
              <a href="/privacy" className="text-roxo-principal hover:underline">
                política de privacidade
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <div className="text-sm text-vermelho-kids">
              {errors.acceptTerms}
            </div>
          )}

          {errors.general && (
            <div className="text-sm text-vermelho-kids text-center">
              {errors.general}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || loadingFontes}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Após o cadastro, você receberá um email de confirmação e aguardará a aprovação da administração.
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

RegisterForm.displayName = "RegisterForm" 