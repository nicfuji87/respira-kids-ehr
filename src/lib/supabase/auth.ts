// AI dev note: Utilitários específicos para autenticação Supabase

import { supabase } from './client'
import type { User } from '@supabase/supabase-js'

/**
 * Obtém o usuário autenticado atual
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Obtém a sessão atual
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Faz logout do usuário
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Verifica se o usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Atualiza o perfil do usuário autenticado
 */
export async function updateUserProfile(updates: {
  email?: string
  password?: string
  data?: Record<string, string | number | boolean>
}) {
  const { data, error } = await supabase.auth.updateUser(updates)
  if (error) throw error
  return data
} 