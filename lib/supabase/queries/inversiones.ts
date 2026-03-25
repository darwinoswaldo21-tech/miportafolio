import { supabase } from '../../supabase.js'

export interface InversionData {
  user_id: string
  nombre: string
  tipo: 'Plazo Fijo' | 'Fondo de Inversión' | 'Ahorro Programado'
  entidad: string
  capital: string
  plazo_dias: string
  tasa_interes: string
  periodicidad_pago: string
  fecha_inicio: string
  fecha_vencimiento: string
  estado: 'Activa' | 'Finalizada' | 'Cancelada'
  notas?: string
}

export const inversionesQueries = {
  // Crear nueva inversión
  async create(data: Omit<InversionData, 'user_id'>) {
    try {
      // Obtener el usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Usuario no autenticado')
      }

      // Insertar en la base de datos usando los datos del formulario
      console.log('🔍 Datos que se guardarán en BD:', {
        user_id: user.id,
        nombre: data.nombre,
        tipo: data.tipo,
        entidad: data.entidad,
        capital: data.capital,
        plazo_dias: parseInt(data.plazo_dias),
        tasa_interes: data.tasa_interes,
        periodicidad_pago: data.periodicidad_pago,
        fecha_inicio: data.fecha_inicio,
        fecha_vencimiento: data.fecha_vencimiento,
        estado: data.estado, // Usar el estado del formulario
        notas: data.notas
      })

      const { data: inversion, error } = await supabase
        .from('inversiones')
        .insert({
          user_id: user.id,
          nombre: data.nombre,
          tipo: data.tipo,
          entidad: data.entidad,
          capital: data.capital,
          plazo_dias: parseInt(data.plazo_dias),
          tasa_interes: data.tasa_interes,
          periodicidad_pago: data.periodicidad_pago,
          fecha_inicio: data.fecha_inicio,
          fecha_vencimiento: data.fecha_vencimiento,
          estado: data.estado, // Usar el estado del formulario
          notas: data.notas,
          creado_en: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error al crear inversión:', error)
        throw error
      }

      return { success: true, data: inversion }
    } catch (error) {
      console.error('Error en create inversión:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  },

  // Obtener inversiones del usuario
  async getByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('inversiones')
        .select('*')
        .eq('user_id', userId)
        .order('creado_en', { ascending: false })
        .limit(100) // Limitar a 100 para mejor rendimiento
      
      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error al obtener inversiones:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  },

  // Actualizar estado de inversión
  async updateEstado(id: string, estado: 'Activa' | 'Finalizada' | 'Cancelada') {
    try {
      const { data, error } = await supabase
        .from('inversiones')
        .update({ estado })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  },

  // Eliminar inversión
  async deleteInversion(id: string) {
    try {
      const { error } = await supabase
        .from('inversiones')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar inversión:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  }
}
