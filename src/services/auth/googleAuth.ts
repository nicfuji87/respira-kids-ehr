import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

// AI dev note: Serviço de autenticação Google com integração ao sistema de pessoas
// Gerencia tanto novos usuários quanto vinculação de contas existentes

interface Identity {
  provider: string
  identity_data?: Record<string, unknown>
}

export interface GoogleAuthOptions {
  redirectTo?: string
  scopes?: string
  prompt?: 'none' | 'consent' | 'select_account'
}

export interface GoogleAuthResult {
  success: boolean
  user?: User
  profile?: Record<string, unknown>
  needsProfileCompletion?: boolean
  error?: string
}

export interface GoogleLinkResult {
  success: boolean
  linkedAccount?: Record<string, unknown>
  error?: string
}

/**
 * Inicia o fluxo de autenticação com Google
 * Após o sucesso, verifica se o perfil existe no sistema
 */
export async function handleGoogleSignIn(
  options: GoogleAuthOptions = {}
): Promise<GoogleAuthResult> {
  try {
    const { redirectTo = `${window.location.origin}/auth/callback` } = options

    // Iniciar autenticação OAuth com Google
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes: options.scopes || 'email profile',
        queryParams: {
          prompt: options.prompt || 'select_account'
        }
      }
    })

    if (error) {
      console.error('Erro na autenticação Google:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // O fluxo OAuth redirecionará para o callback
    // A verificação do perfil será feita no callback
    return {
      success: true
    }

  } catch (error) {
    console.error('Erro no handleGoogleSignIn:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Processa o callback do Google OAuth
 * Verifica se o usuário já tem perfil no sistema
 */
export async function handleGoogleCallback(): Promise<GoogleAuthResult> {
  try {
    // Obter a sessão atual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    if (!session?.user) {
      return {
        success: false,
        error: 'Nenhuma sessão encontrada'
      }
    }

    const user = session.user

    // Verificar se já existe um perfil no sistema
    const { data: pessoa, error: pessoaError } = await supabase
      .from('pessoas')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (pessoaError && pessoaError.code !== 'PGRST116') {
      throw pessoaError
    }

    if (pessoa) {
      // Usuário já tem perfil completo
      return {
        success: true,
        user,
        profile: pessoa,
        needsProfileCompletion: false
      }
    }

    // Verificar se existe uma pessoa com o mesmo email
    const { data: pessoaExistente, error: emailError } = await supabase
      .from('pessoas')
      .select('*')
      .eq('email', user.email)
      .maybeSingle()

    if (emailError && emailError.code !== 'PGRST116') {
      throw emailError
    }

    if (pessoaExistente) {
      // Vincular conta Google a perfil existente
      const { error: linkError } = await supabase
        .from('pessoas')
        .update({
          user_id: user.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', pessoaExistente.id)

      if (linkError) {
        throw linkError
      }

      return {
        success: true,
        user,
        profile: pessoaExistente,
        needsProfileCompletion: false
      }
    }

    // Criar novo perfil como pendente
    const { data: novaPessoa, error: createError } = await supabase
      .from('pessoas')
      .insert({
        user_id: user.id,
        nome_completo: user.user_metadata.full_name || user.user_metadata.name || '',
        email: user.email || '',
        tipo: 'profissional', // Default, será ajustado na aprovação
        foto_perfil_url: user.user_metadata.avatar_url,
        ativo: false, // Inativo até aprovação
        perfil_completo: false, // Perfil ainda não foi completado
        criado_em: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      throw createError
    }

    return {
      success: true,
      user,
      profile: novaPessoa,
      needsProfileCompletion: true
    }

  } catch (error) {
    console.error('Erro no handleGoogleCallback:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Vincula uma conta Google a um usuário existente
 * Usado quando o usuário já tem conta no sistema
 */
export async function linkGoogleAccount(
  pessoaId: string
): Promise<GoogleLinkResult> {
  try {
    // Verificar se já existe uma sessão
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      }
    }

    // Vincular a conta Google ao perfil existente
    const { data: pessoa, error: updateError } = await supabase
      .from('pessoas')
      .update({
        user_id: session.user.id,
        foto_perfil_url: session.user.user_metadata.avatar_url,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', pessoaId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return {
      success: true,
      linkedAccount: pessoa
    }

  } catch (error) {
    console.error('Erro ao vincular conta Google:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Desvincula uma conta Google do perfil
 */
export async function unlinkGoogleAccount(
  pessoaId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Remover vinculação do Google
    const { error } = await supabase
      .from('pessoas')
      .update({
        user_id: null,
        foto_perfil_url: null,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', pessoaId)

    if (error) {
      throw error
    }

    // Fazer logout da sessão atual
    await supabase.auth.signOut()

    return { success: true }

  } catch (error) {
    console.error('Erro ao desvincular conta Google:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Verifica se o usuário atual tem conta Google vinculada
 */
export async function hasGoogleAccountLinked(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return false
    }

    // Verificar se o usuário tem uma identidade Google
    const { data: identities } = await supabase.auth.getUserIdentities()

    return identities?.identities?.some(
      (identity: Identity) => identity.provider === 'google'
    ) || false

  } catch (error) {
    console.error('Erro ao verificar conta Google:', error)
    return false
  }
}

/**
 * Obtém informações do perfil Google do usuário
 */
export async function getGoogleProfile(): Promise<Record<string, unknown> | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data: identities } = await supabase.auth.getUserIdentities()

    const googleIdentity = identities?.identities?.find(
      (identity: Identity) => identity.provider === 'google'
    )

    return googleIdentity?.identity_data || null

  } catch (error) {
    console.error('Erro ao obter perfil Google:', error)
    return null
  }
}

/**
 * Tratamento específico de erros do Google OAuth
 */
export function handleGoogleAuthError(error: Error | unknown): string {
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  if (errorMessage.includes('popup_closed_by_user')) {
    return 'Autenticação cancelada pelo usuário'
  }
  
  if (errorMessage.includes('access_denied')) {
    return 'Acesso negado pelo Google'
  }
  
  if (errorMessage.includes('invalid_request')) {
    return 'Erro na configuração do Google OAuth'
  }
  
  if (errorMessage.includes('temporarily_unavailable')) {
    return 'Serviço temporariamente indisponível'
  }
  
  return errorMessage || 'Erro na autenticação com Google'
}

/**
 * Configurações recomendadas para Google OAuth
 */
export const GOOGLE_AUTH_CONFIG = {
  scopes: 'email profile',
  prompt: 'select_account' as const,
  redirectTo: `${window.location.origin}/auth/callback`
} 