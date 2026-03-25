import { supabase } from '../../supabase'
import { DashboardStats } from '@/app/types'

export const dashboardQueries = {
  // Obtener estadísticas del dashboard
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Obtener el total invertido real de las inversiones del usuario
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Usuario no autenticado')
      }

      // Obtener el total invertido de las inversiones
      const { data: inversiones, error: inversionesError } = await supabase
        .from('inversiones')
        .select('capital')
        .eq('user_id', user.id)

      if (inversionesError) throw inversionesError

      const totalInvertido = inversiones?.reduce((sum, inv) => sum + parseFloat(inv.capital), 0) || 0

      return {
        total: totalInvertido
      }
    } catch (error) {
      console.error('Error obteniendo stats:', error)
      return {
        total: 0
      }
    }
  },

  // Obtener datos recientes para dashboard
  getRecentData: async (limit = 5) => {
    const [entidades, fiduciarias] = await Promise.all([
      supabase.from('entidades').select('*').order('created_at', { ascending: false }).limit(limit),
      supabase.from('fiduciarias').select('*').order('created_at', { ascending: false }).limit(limit)
    ])

    if (entidades.error) throw entidades.error
    if (fiduciarias.error) throw fiduciarias.error

    return {
      entidades: entidades.data || [],
      fiduciarias: fiduciarias.data || []
    }
  }
}
