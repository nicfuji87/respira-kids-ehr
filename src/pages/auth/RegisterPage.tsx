import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Shield, Check, ArrowLeft, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "@/hooks/auth/useAuth"
import { FormLayout } from "@/components/templates"
import { FormFieldWrapper } from "@/components/composed"
import { Button, Input, Form, Card, CardContent } from "@/components/primitives"
import { Spinner } from "@/components/primitives"
import { cn } from "@/lib/utils"

// Esquemas de validação
const registerStepOneSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter pelo menos 1 letra minúscula, 1 maiúscula e 1 número"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

const registerStepTwoSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de uso",
  }),
})

type RegisterStepOneData = z.infer<typeof registerStepOneSchema>
type RegisterStepTwoData = z.infer<typeof registerStepTwoSchema>

// Componente para indicador de força da senha
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++
    return score
  }

  const strength = getStrength(password)
  const strengthLabels = ["Muito fraca", "Fraca", "Regular", "Boa", "Forte"]
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500", 
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500"
  ]

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < strength ? strengthColors[strength - 1] : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p className={cn(
        "text-xs",
        strength <= 2 ? "text-red-500" : 
        strength <= 3 ? "text-yellow-500" : "text-green-500"
      )}>
        Força: {strengthLabels[strength - 1] || "Muito fraca"}
      </p>
    </div>
  )
}

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stepOneData, setStepOneData] = useState<RegisterStepOneData | null>(null)
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  // Formulário Step 1
  const stepOneForm = useForm<RegisterStepOneData>({
    resolver: zodResolver(registerStepOneSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Formulário Step 2
  const stepTwoForm = useForm<RegisterStepTwoData>({
    resolver: zodResolver(registerStepTwoSchema),
    defaultValues: {
      acceptTerms: false,
    },
  })

  const watchedPassword = stepOneForm.watch("password")

  const handleStepOne = async (data: RegisterStepOneData) => {
    setStepOneData(data)
    setCurrentStep(2)
  }

  const handleStepTwo = async () => {
    if (!stepOneData) return
    
    setIsLoading(true)
    try {
      await signUp(stepOneData.email, stepOneData.password, stepOneData.email)
      
      navigate('/auth/awaiting-approval')
    } catch (error) {
      console.error('Erro no cadastro:', error)
      // TODO: Mostrar erro para o usuário
    } finally {
      setIsLoading(false)
    }
  }



  const renderStepOne = () => (
    <Form {...stepOneForm}>
      <form onSubmit={stepOneForm.handleSubmit(handleStepOne)} className="space-y-4">


        <FormFieldWrapper
          control={stepOneForm.control}
          name="email"
          label="Email"
          required
        >
          {(field) => (
            <Input
              {...field}
              type="email"
              placeholder="seu@email.com"
              className="w-full"
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        </FormFieldWrapper>

        <FormFieldWrapper
          control={stepOneForm.control}
          name="password"
          label="Senha"
          required
        >
          {(field) => (
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className="w-full pr-10"
                onChange={(e) => field.onChange(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <PasswordStrengthIndicator password={watchedPassword} />
            </div>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper
          control={stepOneForm.control}
          name="confirmPassword"
          label="Confirmar senha"
          required
        >
          {(field) => (
            <div className="relative">
              <Input
                {...field}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Digite sua senha novamente"
                className="w-full pr-10"
                onChange={(e) => field.onChange(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          )}
        </FormFieldWrapper>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/auth/login')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  )

  const renderStepTwo = () => (
    <Form {...stepTwoForm}>
      <form onSubmit={stepTwoForm.handleSubmit(handleStepTwo)} className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-azul-respira/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-azul-respira" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-roxo-titulo">Termos de Uso</h3>
            <p className="text-sm text-gray-600 mt-2">
              Para finalizar seu cadastro, leia e aceite nossos termos.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="max-h-32 overflow-y-auto text-sm text-gray-600 space-y-2">
              <p>
                <strong>1. Aceite dos Termos:</strong> Ao utilizar nossos serviços, você concorda 
                com estes termos de uso.
              </p>
              <p>
                <strong>2. Privacidade:</strong> Seus dados são protegidos conforme nossa 
                política de privacidade.
              </p>
              <p>
                <strong>3. Responsabilidades:</strong> Você é responsável pela veracidade 
                das informações fornecidas.
              </p>
              <p>
                <strong>4. Uso Adequado:</strong> O sistema deve ser usado apenas para 
                finalidades médicas legítimas.
              </p>
            </div>
          </CardContent>
        </Card>

        <FormFieldWrapper
          control={stepTwoForm.control}
          name="acceptTerms"
        >
          {(field) => (
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptTerms"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-azul-respira focus:ring-azul-respira"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                Li e aceito os{" "}
                <Link 
                  to="/terms" 
                  className="text-azul-respira hover:underline font-medium"
                >
                  termos de uso
                </Link>
                {" "}e a{" "}
                <Link 
                  to="/privacy" 
                  className="text-azul-respira hover:underline font-medium"
                >
                  política de privacidade
                </Link>
                <span className="text-vermelho-kids ml-1">*</span>
              </label>
            </div>
          )}
        </FormFieldWrapper>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setCurrentStep(1)}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Criando conta...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Criar conta
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )

  return (
    <FormLayout
      title="Criar conta"
      description={currentStep === 1 ? "Dados de acesso" : "Aceite dos termos"}
      maxWidth="md"
      className="respira-bg-primary"
    >
      <div className="space-y-6">
        {/* Indicador de steps */}
        <div className="flex items-center justify-center space-x-4">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
            currentStep >= 1 
              ? "bg-azul-respira text-white" 
              : "bg-gray-200 text-gray-500"
          )}>
            1
          </div>
          <div className={cn(
            "w-12 h-0.5",
            currentStep > 1 ? "bg-azul-respira" : "bg-gray-200"
          )} />
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
            currentStep >= 2 
              ? "bg-azul-respira text-white" 
              : "bg-gray-200 text-gray-500"
          )}>
            2
          </div>
        </div>

        {currentStep === 1 ? renderStepOne() : renderStepTwo()}



        {/* Link para login */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link 
              to="/auth/login" 
              className="text-azul-respira hover:underline font-medium"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </FormLayout>
  )
}

export default RegisterPage 