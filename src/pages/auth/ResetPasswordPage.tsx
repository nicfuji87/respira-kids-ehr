import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Label } from "@/components/primitives/label"
import { Spinner } from "@/components/primitives/spinner"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle, AlertCircle, Mail } from "lucide-react"

// AI dev note: Página de reset de senha com rate limiting e feedback visual
// Integra com Supabase Auth para recuperação de senha segura

const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório")
})

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

export interface ResetPasswordPageProps {
  className?: string
}

export default function ResetPasswordPage({ className }: ResetPasswordPageProps) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [attemptCount, setAttemptCount] = useState(0)
  const [cooldownTime, setCooldownTime] = useState(0)

  const maxAttempts = 3
  const cooldownDuration = 60 // 1 minuto em segundos

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  // Rate limiting - cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldownTime])

  const handleResetPassword = async (data: ResetPasswordData) => {
    // Verificar rate limiting
    if (attemptCount >= maxAttempts) {
      setErrorMessage(`Muitas tentativas. Tente novamente em ${cooldownTime} segundos.`)
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // Verificar se o email existe no sistema
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('email', data.email)
        .maybeSingle()

      if (userError) throw userError

      if (!user) {
        // Por segurança, mostramos sempre a mensagem de sucesso
        // mesmo se o email não existir
        setEmailSent(true)
        return
      }

      // Enviar email de recuperação
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password-confirm`
      })

      if (error) {
        if (error.message.includes('rate limit')) {
          setErrorMessage('Muitas tentativas. Tente novamente em alguns minutos.')
          setAttemptCount(prev => prev + 1)
          if (attemptCount + 1 >= maxAttempts) {
            setCooldownTime(cooldownDuration)
          }
        } else {
          setErrorMessage('Erro ao enviar email. Tente novamente.')
        }
      } else {
        setEmailSent(true)
      }

    } catch (error) {
      console.error('Erro no reset de senha:', error)
      setErrorMessage('Erro interno. Tente novamente.')
      setAttemptCount(prev => prev + 1)
      if (attemptCount + 1 >= maxAttempts) {
        setCooldownTime(cooldownDuration)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/auth/login')
  }

  const handleTryAgain = () => {
    setEmailSent(false)
    setErrorMessage('')
    form.reset()
  }

  if (emailSent) {
    return (
      <div className={cn("max-w-md mx-auto", className)}>
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-verde-pipa" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-roxo-titulo">
                  Email enviado!
                </h2>
                <p className="text-muted-foreground">
                  Se o email estiver cadastrado em nossa base, você receberá as instruções para redefinir sua senha.
                </p>
              </div>

              <div className="bg-azul-respira/10 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-azul-respira mt-0.5" />
                  <div className="text-sm text-left">
                    <p className="font-medium mb-1">Verifique sua caixa de entrada</p>
                    <p className="text-muted-foreground">
                      Não esqueça de verificar a pasta de spam. O email pode demorar alguns minutos para chegar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleTryAgain}
                  variant="outline"
                  className="w-full"
                >
                  Tentar com outro email
                </Button>
                
                <Button 
                  onClick={handleBackToLogin}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("max-w-md mx-auto", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-roxo-titulo">
            Recuperar Senha
          </CardTitle>
          <p className="text-muted-foreground">
            Digite seu email para receber as instruções de recuperação
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                {...form.register('email')}
                disabled={isSubmitting || cooldownTime > 0}
                className={form.formState.errors.email ? 'border-red-500' : ''}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {attemptCount > 0 && attemptCount < maxAttempts && (
              <div className="text-center text-sm text-amber-600">
                Tentativas restantes: {maxAttempts - attemptCount}
              </div>
            )}

            {cooldownTime > 0 && (
              <div className="text-center text-sm text-red-600">
                Aguarde {cooldownTime} segundos antes de tentar novamente
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || cooldownTime > 0}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Enviando...
                </>
              ) : cooldownTime > 0 ? (
                `Aguarde ${cooldownTime}s`
              ) : (
                'Enviar instruções'
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm text-azul-respira hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              Não recebeu o email? Verifique sua pasta de spam ou entre em contato conosco.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 