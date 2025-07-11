// AI dev note: Utilitários específicos para operações de banco Supabase

import { supabase } from './client'

type DatabaseValue = string | number | boolean | null | undefined

/**
 * Operações genéricas para qualquer tabela
 */
export class DatabaseService {
  /**
   * Busca registros com filtros opcionais
   */
  static async findMany<T>(
    table: string,
    options?: {
      select?: string
      filters?: Record<string, DatabaseValue>
      orderBy?: { column: string; ascending?: boolean }
      limit?: number
      offset?: number
    }
  ) {
    let query = supabase.from(table).select(options?.select || '*')

    // Aplicar filtros
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value)
        }
      })
    }

    // Aplicar ordenação
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      })
    }

    // Aplicar paginação
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options?.limit || 10) - 1)
    }

    const { data, error } = await query
    if (error) throw error
    return data as T[]
  }

  /**
   * Busca um registro por ID
   */
  static async findById<T>(table: string, id: string, select?: string) {
    const { data, error } = await supabase
      .from(table)
      .select(select || '*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as T
  }

  /**
   * Cria um novo registro
   */
  static async create<T>(table: string, data: Record<string, DatabaseValue>) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return result as T
  }

  /**
   * Atualiza um registro por ID
   */
  static async update<T>(table: string, id: string, data: Record<string, DatabaseValue>) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return result as T
  }

  /**
   * Remove um registro por ID
   */
  static async delete(table: string, id: string) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 