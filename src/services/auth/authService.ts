import { supabase } from '@/lib/supabase'
import type { 
  User, 
  AuthError, 
  AuthResponse,
  Session 
} from '@supabase/supabase-js'
import type { 
  LoginFormData, 
  RegisterFormData, 
  CompleteProfileFormData,
  ResetPasswordFormData 
} from '@/schemas/auth/auth.schemas'

// AI dev note: Serviço centralizado de autenticação com integração Supabase
// Atualizado para usar estrutura correta da tabela pessoas

// ========================================
// TIPOS E INTERFACES
// ========================================

export interface AuthResult {
  success: boolean
  user?: User
  session?: Session
  error?: string
  data?: Record<string, unknown>
}

export interface ProfileData {
  id: string
  auth_user_id: string
  nome: string
  email: string
  id_tipo_pessoa: string
  role: string
  is_approved: boolean
  profile_complete: boolean
  ativo: boolean
  created_at: string
  [key: string]: unknown
}

export interface AuthServiceConfig {
  enableAuditLogs: boolean
  maxLoginAttempts: number
  lockoutDuration: number // minutos
}

// ========================================
// CONFIGURAÇÃO DO SERVIÇO
// ========================================

const DEFAULT_CONFIG: AuthServiceConfig = {
  enableAuditLogs: true,
  maxLoginAttempts: 5,
  lockoutDuration: 15
}

// ========================================
// LOGS DE AUDITORIA
// ========================================

type AuditAction = 
  | 'login_success' 
  | 'login_failed' 
  | 'register_attempt' 
  | 'register_success'
  | 'logout' 
  | 'password_reset_request' 
  | 'password_update'
  | 'profile_completion'
  | 'email_verification'

interface AuditLog {
  action: AuditAction
  user_id?: string
  email?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, unknown>
  timestamp: string
}

/**
 * Registra evento de auditoria
 */
async function logAuditEvent(auditLog: Omit<AuditLog, 'timestamp'>): Promise<void> {
  if (!DEFAULT_CONFIG.enableAuditLogs) return

  try {
    const log: AuditLog = {
      ...auditLog,
      timestamp: new Date().toISOString()
    }

    console.log('[AUTH AUDIT]', log)

    // Salvar no banco (opcional - criar tabela auth_logs)
    /*
    await supabase
      .from('auth_logs')
      .insert(log)
    */
  } catch (error) {
    console.error('Erro ao registrar log de auditoria:', error)
  }
}

// ========================================
// TRATAMENTO DE ERROS
// ========================================

/**
 * Trata erros de autenticação de forma padronizada
 */
function handleAuthError(error: AuthError | Error | unknown): string {
  if (!error) return 'Erro desconhecido'

  const errorMessage = error instanceof Error ? error.message : String(error)

  // Erros específicos do Supabase Auth
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada',
    'User not found': 'Usuário não encontrado',
    'Password is too weak': 'Senha muito fraca',
    'Email address is invalid': 'Email inválido',
    'User already registered': 'Usuário já cadastrado',
    'signup_disabled': 'Cadastro temporariamente desabilitado',
    'email_address_invalid': 'Endereço de email inválido',
    'password_is_too_weak': 'Senha muito fraca',
    'weak_password': 'Senha muito fraca',
    'too_many_requests': 'Muitas tentativas. Tente novamente em alguns minutos',
    'captcha_failed': 'Verificação CAPTCHA falhhou',
    'email_rate_limit_exceeded': 'Limite de emails excedido. Tente novamente em alguns minutos',
    'session_not_found': 'Sessão não encontrada. Faça login novamente',
    'refresh_token_not_found': 'Token de refresh não encontrado',
    'invalid_refresh_token': 'Token de refresh inválido'
  }

  // Buscar mensagem traduzida
  for (const [key, message] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return message
    }
  }

  // Fallback para mensagem original
  return errorMessage
}

// ========================================
// CLASSE DO SERVIÇO DE AUTENTICAÇÃO
// ========================================

export class AuthService {
  constructor() {
    // Configuração padrão pode ser adicionada aqui futuramente se necessário
  }

  /**
   * Realiza login com email e senha
   */
  async login(credentials: LoginFormData): Promise<AuthResult> {
    try {
      const { email, password, rememberMe } = credentials

      // Log da tentativa de login
      await logAuditEvent({
        action: 'login_failed', // Será atualizado se success
        email,
        metadata: { rememberMe }
      })

      // Realizar login
      const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        await logAuditEvent({
          action: 'login_failed',
          email,
          metadata: { error: error.message }
        })

        return {
          success: false,
          error: handleAuthError(error)
        }
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: 'Falha na autenticação'
        }
      }

      // Configurar persistência da sessão
      if (rememberMe) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        })
      }

      // Buscar perfil do usuário
      const profile = await this.getUserProfile(data.user.id)

      // Log de sucesso
      await logAuditEvent({
        action: 'login_success',
        user_id: data.user.id,
        email: data.user.email,
        metadata: { rememberMe, hasProfile: !!profile }
      })

             return {
         success: true,
         user: data.user,
         session: data.session || undefined,
         data: { profile }
       }

    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        error: handleAuthError(error)
      }
    }
  }

  /**
   * Registra novo usuário
   */
  async register(userData: RegisterFormData): Promise<AuthResult> {
    try {
      const { email, password } = userData

      // Log da tentativa de registro
      await logAuditEvent({
        action: 'register_attempt',
        email
      })

              // Criar usuário no Supabase Auth
        const { data, error }: AuthResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })

      if (error) {
        return {
          success: false,
          error: handleAuthError(error)
        }
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Falha ao criar usuário'
        }
      }

      // Buscar tipo pessoa 'profissional' para usar como padrão
      const { data: tipoProfissional } = await supabase
        .from('pessoa_tipos')
        .select('id')
        .eq('codigo', 'profissional')
        .single()

              // Criar perfil pendente no sistema
        const { data: pessoa, error: profileError } = await supabase
          .from('pessoas')
          .insert({
            auth_user_id: data.user.id,
            email: data.user.email || '',
            nome: '', // Será preenchido na conclusão do cadastro
            id_tipo_pessoa: tipoProfissional?.id,
            role: 'profissional', // Default
            is_approved: false, // Aguardando aprovação
            profile_complete: false // Perfil ainda não foi completado
          })
          .select()
          .single()

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        // Não falhar o registro por causa do perfil
      }

      // Log de sucesso
      await logAuditEvent({
        action: 'register_success',
        user_id: data.user.id,
        email: data.user.email,
        metadata: { needsEmailConfirmation: !data.session }
      })

      return {
        success: true,
        user: data.user,
        session: data.session || undefined,
        data: { 
          profile: pessoa,
          needsEmailConfirmation: !data.session
        }
      }

    } catch (error) {
      console.error('Erro no registro:', error)
      return {
        success: false,
        error: handleAuthError(error)
      }
    }
  }

  /**
   * Completa o perfil após aprovação
   */
  async completeProfile(
    userId: string, 
    profileData: CompleteProfileFormData
  ): Promise<AuthResult> {
    try {
      // Verificar se o usuário existe e está aprovado
      const { data: pessoa, error: checkError } = await supabase
        .from('pessoas')
        .select('*')
        .eq('auth_user_id', userId)
        .single()

      if (checkError || !pessoa) {
        return {
          success: false,
          error: 'Perfil não encontrado'
        }
      }

      if (!pessoa.is_approved) {
        return {
          success: false,
          error: 'Perfil ainda não foi aprovado'
        }
      }

      // Atualizar dados do perfil
      const { data: updatedPessoa, error: updateError } = await supabase
        .from('pessoas')
        .update({
          ...profileData,
          profile_complete: true
        })
        .eq('auth_user_id', userId)
        .select()
        .single()

      if (updateError) {
        return {
          success: false,
          error: handleAuthError(updateError)
        }
      }

              // Log do evento
        await logAuditEvent({
          action: 'profile_completion',
          user_id: userId,
          metadata: { tipo: profileData.tipo }
        })

      return {
        success: true,
        data: { profile: updatedPessoa }
      }

    } catch (error) {
      console.error('Erro ao completar perfil:', error)
      return {
        success: false,
        error: handleAuthError(error)
      }
    }
  }

  /**
   * Solicita reset de senha
   */
  async resetPassword(data: ResetPasswordFormData): Promise<AuthResult> {
    try {
      const { email } = data

      // Log da solicitação
      await logAuditEvent({
        action: 'password_reset_request',
        email
      })

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return {
          success: false,
          error: handleAuthError(error)
        }
      }

      return {
        success: true,
        data: { message: 'Email de redefinição enviado' }
      }

    } catch (error) {
      console.error('Erro no reset de senha:', error)
      return {
        success: false,
        error: handleAuthError(error)
      }
    }
  }

  /**
   * Atualiza senha do usuário
   */
  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      // Verificar se há usuário logado
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        return {
          success: false,
          error: 'Usuário não autenticado'
        }
      }

      // Atualizar senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return {
          success: false,
          error: handleAuthError(error)
        }
      }

      // Log do evento
      await logAuditEvent({
        action: 'password_update',
        user_id: user.id
      })

      return {
        success: true,
        data: { message: 'Senha atualizada com sucesso' }
      }

    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      return {
        success: false,
        error: handleAuthError(error)
      }
    }
  }

  /**
   * Verifica email do usuário
   */
  async verifyEmail(token: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })

      if (error) {
        return {
          success: false,
          error: handleAuthError(error)
        }
      }

      // Log do evento
      await logAuditEvent({
        action: 'email_verification',
        user_id: data.user?.id
      })

             return {
         success: true,
         user: data.user || undefined,
         session: data.session || undefined
       }

    } catch (error) {
      console.error('Erro na verificação de email:', error)
      return {
        success: false,
        error: handleAuthError(error)
      }
    }
  }

  /**
   * Realiza logout
   */
  async logout(): Promise<AuthResult> {
    try {
      // Obter usuário atual para log
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase.auth.signOut()

      if (error) {
        return {
          success: false,
          error: handleAuthError(error)
        }
      }

      // Log do evento
      await logAuditEvent({
        action: 'logout',
        user_id: user?.id
      })

      return {
        success: true,
        data: { message: 'Logout realizado com sucesso' }
      }

    } catch (error) {
      console.error('Erro no logout:', error)
      return {
        success: false,
        error: handleAuthError(error)
      }
    }
  }

  /**
   * Obtém perfil do usuário
   */
  async getUserProfile(userId: string): Promise<ProfileData | null> {
    try {
      const { data, error } = await supabase
        .from('pessoas')
        .select(`
          *,
          pessoa_tipos(codigo, nome)
        `)
        .eq('auth_user_id', userId)
        .single()

      if (error || !data) {
        return null
      }

      return data as ProfileData

    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      return null
    }
  }

  /**
   * Obtém sessão atual
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Erro ao obter sessão:', error)
      return null
    }
  }

  /**
   * Verifica se email está disponível
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('pessoas')
        .select('id')
        .eq('email', email)
        .limit(1)

      if (error) {
        console.error('Erro ao verificar email:', error)
        return false
      }

      return !data || data.length === 0
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do email:', error)
      return false
    }
  }
}

// ========================================
// INSTÂNCIA SINGLETON
// ========================================

export const authService = new AuthService()

// ========================================
// EXPORTS AUXILIARES
// ========================================

export { handleAuthError, logAuditEvent }
export type { AuditAction, AuditLog } 