import * as React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from '@/hooks/auth/useAuth'
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/primitives"
import { Alert, AlertDescription } from "@/components/primitives/alert"
import { Label } from "@/components/primitives/label"
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"

// ==================== SCHEMA ====================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa'),
  rememberMe: z.boolean().default(false)
})

type LoginForm = z.infer<typeof loginSchema>

// ==================== COMPONENT ====================

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { 
    signInWithEmail, 
    signInWithGoogle, 
    error, 
    isLoading, 
    clearError,
    isAuthenticated,
    role,
    profileComplete,
    isApproved
  } = useAuth()

  const [showPassword, setShowPassword] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  // ==================== HANDLERS ====================

  const handleEmailLogin = async (data: LoginForm) => {
    try {
      await signInWithEmail(data.email, data.password)
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Erro no login com Google:', error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // ==================== EFFECTS ====================

  // Redirecionar baseado no estado de autenticação
  React.useEffect(() => {
    if (isAuthenticated) {
      // Verificar se o usuário está aprovado
      if (!isApproved) {
        navigate('/auth/awaiting-approval')
        return
      }

      // Verificar se o perfil está completo
      if (!profileComplete) {
        navigate('/auth/complete-registration')
        return
      }

      // Redirecionar baseado no role
      const redirectPaths = {
        admin: '/dashboard',
        profissional: '/dashboard',
        secretaria: '/dashboard',
        empresa: '/dashboard',
        medico: '/dashboard'
      }

      const redirectPath = role && redirectPaths[role as keyof typeof redirectPaths] || '/dashboard'
      navigate(redirectPath)
    }
  }, [isAuthenticated, role, profileComplete, navigate, isApproved])

  // Limpar erros quando o componente desmontar
  React.useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-fundo via-white to-bege-fundo/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/images/logos/logo-respira-kids.png" 
              alt="Respira Kids" 
              className="h-16 w-auto"
            />
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-roxo-titulo">
              Entrar
            </CardTitle>
            <CardDescription className="text-roxo-titulo/60">
              Faça login para acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Erro de autenticação */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}



            {/* Formulário de email */}
            <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-roxo-titulo font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="h-12 border-roxo-titulo/20 focus:border-azul-respira focus:ring-azul-respira"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-roxo-titulo font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="h-12 pr-12 border-roxo-titulo/20 focus:border-azul-respira focus:ring-azul-respira"
                    {...form.register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-roxo-titulo/60 hover:text-roxo-titulo"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Lembrar-me */}
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 text-azul-respira border-roxo-titulo/30 rounded focus:ring-azul-respira focus:ring-2"
                  {...form.register('rememberMe')}
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm text-roxo-titulo cursor-pointer"
                >
                  Lembrar-me
                </Label>
              </div>

              {/* Botão de login */}
              <Button
                type="submit"
                className="w-full h-12 respira-gradient text-white hover:opacity-90 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-roxo-titulo/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-roxo-titulo/60">
                  ou
                </span>
              </div>
            </div>

            {/* Botão Google */}
            <Button
              type="button"
              className="w-full h-12 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <img 
                  src="/images/logos/icone-google.png" 
                  alt="Google" 
                  className="mr-2 h-5 w-5"
                />
              )}
              Continuar com Google
            </Button>

            {/* Links */}
            <div className="space-y-4 text-center">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-azul-respira hover:text-azul-respira/80 hover:underline"
              >
                Esqueci minha senha
              </Link>
              
              <div className="pt-4 border-t border-roxo-titulo/10">
                <p className="text-sm text-roxo-titulo/60">
                  Não tem uma conta?{' '}
                  <Link
                    to="/auth/register"
                    className="text-azul-respira hover:text-azul-respira/80 hover:underline font-medium"
                  >
                    Criar conta
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-roxo-titulo/50">
          <p>
            © 2024 Respira KIDS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 