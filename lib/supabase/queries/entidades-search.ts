import { supabase } from '../../supabase'

export const entidadesSearchQueries = {
  // Buscar entidades por nombre con autocomplete
  searchByName: async (query: string, limit = 10) => {
    if (!query || query.trim().length < 2) {
      return []
    }

    const { data, error } = await supabase
      .from('entidades')
      .select('id, nombre, ruc, segmento')
      .ilike('nombre', `%${query.trim()}%`)
      .order('nombre')
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Obtener todas las entidades (para fallback)
  getAllNames: async (limit = 50) => {
    const { data, error } = await supabase
      .from('entidades')
      .select('id, nombre, ruc, segmento')
      .order('nombre')
      .limit(limit)

    if (error) throw error
    return data || []
  }
}
