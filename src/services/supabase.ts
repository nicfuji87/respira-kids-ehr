import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { User, Patient, Appointment, StockItem, Financial, Webhook } from '@/types'

// ==================== CONFIGURATION ====================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jqegoentcusnbcykgtxg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZWdvZW50Y3VzbmJjeWtndHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTI5MTgsImV4cCI6MjA2NzU4ODkxOH0.Fm5yqwPUeGRPriONRXaOZ8T7tySeebfCIMYb9Hx_Y6I'

// ==================== DATABASE TYPES ====================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id'>>
      }
      patients: {
        Row: Patient
        Insert: Omit<Patient, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Patient, 'id'>>
      }
      appointments: {
        Row: Appointment
        Insert: Omit<Appointment, 'id' | 'patient' | 'doctor' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Appointment, 'id' | 'patient' | 'doctor'>>
      }
      stock_items: {
        Row: StockItem
        Insert: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StockItem, 'id'>>
      }
      financial: {
        Row: Financial
        Insert: Omit<Financial, 'id' | 'patient' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Financial, 'id' | 'patient'>>
      }
      webhooks: {
        Row: Webhook
        Insert: Omit<Webhook, 'id' | 'last_attempt' | 'last_success' | 'failure_count' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Webhook, 'id' | 'last_attempt' | 'last_success' | 'failure_count'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ==================== CLIENT ====================

export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey)

// ==================== STORAGE BUCKETS ====================

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  MEDICAL_FILES: 'medical-files',
  REPORTS: 'reports'
} as const

// ==================== ERROR HANDLING ====================

export interface SupabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
}

export function handleSupabaseError(error: any): SupabaseError {
  if (error?.message) {
    return {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    }
  }
  
  return {
    message: 'Erro desconhecido',
    details: 'Ocorreu um erro inesperado'
  }
}

// ==================== QUERY HELPERS ====================

/**
 * Helper para buscar usuário por ID
 */
export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para buscar pacientes ativos
 */
export async function getActivePatients() {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('is_active', true)
      .order('full_name')
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para buscar paciente por CPF
 */
export async function getPatientByCPF(cpf: string) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('cpf', cpf)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para buscar agendamentos do dia
 */
export async function getTodayAppointments() {
  const today = new Date().toISOString().split('T')[0]
  
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*),
        doctor:profiles(*)
      `)
      .gte('appointment_date', `${today}T00:00:00`)
      .lt('appointment_date', `${today}T23:59:59`)
      .order('appointment_date')
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para buscar agendamentos por paciente
 */
export async function getAppointmentsByPatient(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:profiles(*)
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para buscar itens de estoque com baixo estoque
 */
export async function getLowStockItems() {
  try {
    const { data, error } = await supabase
      .from('stock_items')
      .select('*')
      .filter('quantity', 'lte', 'min_quantity')
      .eq('status', 'available')
      .order('quantity')
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para buscar transações financeiras por período
 */
export async function getFinancialByPeriod(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('financial')
      .select(`
        *,
        patient:patients(*)
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para calcular receita total por período
 */
export async function getTotalRevenueByPeriod(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('financial')
      .select('amount')
      .eq('type', 'income')
      .eq('status', 'paid')
      .gte('paid_date', startDate)
      .lte('paid_date', endDate)
    
    if (error) throw error
    
    const total = data?.reduce((sum, item) => sum + item.amount, 0) || 0
    return { data: total, error: null }
  } catch (error) {
    return { data: 0, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para upload de arquivo
 */
export async function uploadFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  fileName: string,
  file: File
) {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .upload(fileName, file)
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para buscar URL pública de arquivo
 */
export function getPublicUrl(bucket: keyof typeof STORAGE_BUCKETS, fileName: string) {
  const { data } = supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

/**
 * Helper para remover arquivo
 */
export async function deleteFile(bucket: keyof typeof STORAGE_BUCKETS, fileName: string) {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .remove([fileName])
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

// ==================== REAL-TIME SUBSCRIPTIONS ====================

/**
 * Helper para subscription em tempo real de uma tabela
 */
export function subscribeToTable(
  table: keyof Database['public']['Tables'],
  callback: (payload: any) => void,
  filter?: string
) {
  let subscription = supabase
    .channel(`${table}-changes`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: table,
      filter: filter
    }, callback)
  
  subscription.subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}

// ==================== AUTH HELPERS ====================

/**
 * Helper para login
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * Helper para logout
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: handleSupabaseError(error) }
  }
}

/**
 * Helper para buscar usuário atual
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    return { data: user, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
} 