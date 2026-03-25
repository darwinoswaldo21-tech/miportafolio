import { supabase } from '../../supabase'
import { Entidad } from '@/app/types'

export const entidadesQueries = {
  // Obtener todas las entidades
  getAll: async (limit = 50) => {
    const { data, error } = await supabase
      .from('entidades')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as Entidad[]
  },

  // Obtener entidad por ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('entidades')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Entidad
  },

  // Crear nueva entidad
  create: async (entidad: Omit<Entidad, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('entidades')
      .insert(entidad)
      .select()
      .single()
    
    if (error) throw error
    return data as Entidad
  },

  // Actualizar entidad
  update: async (id: string, entidad: Partial<Entidad>) => {
    const { data, error } = await supabase
      .from('entidades')
      .update(entidad)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Entidad
  },

  // Eliminar entidad
  delete: async (id: string) => {
    const { error } = await supabase
      .from('entidades')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Contar entidades
  count: async () => {
    const { count, error } = await supabase
      .from('entidades')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    return count || 0
  }
}
