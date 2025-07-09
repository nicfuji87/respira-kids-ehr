import { useState } from "react"
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives"
import { FormField } from "@/components/composed"
import type { UserRole } from "@/contexts/AuthContext"
import { Eye, EyeOff } from "lucide-react"

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  role: UserRole
  phone?: string
}

export interface RegisterFormProps {
  onSuccess?: (userData: RegisterFormData) => void
  allowedRoles?: UserRole[]
  className?: string
}

export const RegisterForm = ({ 
  onSuccess, 
  allowedRoles = ['doctor', 'nurse', 'receptionist'],
  className 
}: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'doctor',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrador',
    doctor: 'Médico',
    nurse: 'Enfermeiro',
    receptionist: 'Recepcionista',
    patient: 'Paciente'
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'Email é obrigatório'
    if (!formData.password) newErrors.password = 'Senha é obrigatória'
    if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }
    if (!formData.name) newErrors.name = 'Nome é obrigatório'
    if (!formData.role) newErrors.role = 'Função é obrigatória'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // TODO: Implementar lógica real de registro
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSuccess?.(formData)
    } catch (error) {
      setErrors({
        general: 'Erro ao criar conta. Tente novamente.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof RegisterFormData, value: string) => {
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Nome completo"
            error={errors.name}
            required
            htmlFor="name"
          >
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome completo"
            />
          </FormField>

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
            label="Telefone"
            error={errors.phone}
            htmlFor="phone"
          >
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </FormField>

          <FormField
            label="Função"
            error={errors.role}
            required
            htmlFor="role"
          >
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange('role', value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleLabels[role]}
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
                placeholder="Sua senha"
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
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

RegisterForm.displayName = "RegisterForm" 