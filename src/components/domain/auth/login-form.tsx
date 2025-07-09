import { useState } from "react"
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/primitives"
import { FormField } from "@/components/composed"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff } from "lucide-react"

export interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export const LoginForm = ({ onSuccess, className }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      await login({
        email: formData.email,
        password: formData.password
      })
      onSuccess?.()
    } catch (error) {
      setErrors({
        general: 'Email ou senha incorretos'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center text-roxo-titulo">
          Entrar no Sistema
        </CardTitle>
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
              className="w-full"
            />
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
                placeholder="Sua senha"
                className="w-full pr-10"
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

          {errors.general && (
            <div className="text-sm text-vermelho-kids text-center">
              {errors.general}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

LoginForm.displayName = "LoginForm" 