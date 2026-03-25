import { supabase } from '../../supabase'
import { Fiduciaria } from '@/app/types'

export const fiduciariasQueries = {
  // Obtener todas las fiduciarias
  getAll: async (limit = 50) => {
    const { data, error } = await supabase
      .from('fiduciarias')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as Fiduciaria[]
  },

  // Obtener fiduciaria por ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('fiduciarias')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Fiduciaria
  },

  // Crear nueva fiduciaria
  create: async (fiduciaria: Omit<Fiduciaria, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('fiduciarias')
      .insert(fiduciaria)
      .select()
      .single()
    
    if (error) throw error
    return data as Fiduciaria
  },

  // Actualizar fiduciaria
  update: async (id: string, fiduciaria: Partial<Fiduciaria>) => {
    const { data, error } = await supabase
      .from('fiduciarias')
      .update(fiduciaria)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Fiduciaria
  },

  // Eliminar fiduciaria
  delete: async (id: string) => {
    const { error } = await supabase
      .from('fiduciarias')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Contar fiduciarias
  count: async () => {
    const { count, error } = await supabase
      .from('fiduciarias')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }
}
