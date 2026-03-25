'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { useAuth } from '@/app/hooks/useAuth'
import { inversionesQueries } from '@/lib/supabase/queries'
import { InversionDetailModal } from '@/app/components/investment/InversionDetailModal'
import { useNotifications } from '@/app/hooks/useNotifications'
import { NotificationsDropdown } from '@/app/components/ui/NotificationsDropdown'
import { ConfirmDialog } from '@/app/components/ui/ConfirmDialog'

interface Inversion {
  id: number
  nombre: string
  tipo: string
  entidad: string
  capital: string
  plazo_dias: number
  tasa_interes: string
  periodicidad_pago: string
  fecha_inicio: string
  fecha_vencimiento: string
  estado: 'Activa' | 'Finalizada' | 'Cancelada'
  notas: string
  creado_en: string
}

export default function InversionesPage() {
  const { user } = useAuth()
  const [inversiones, setInversiones] = useState<Inversion[]>([])
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState<'todas' | 'activas' | 'finalizadas' | 'canceladas'>('todas')
  const [selectedInversion, setSelectedInversion] = useState<Inversion | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    inversion: Inversion | null
  }>({ isOpen: false, inversion: null })
  const { generateNotifications } = useNotifications()

  useEffect(() => {
    const loadInversiones = async () => {
      if (!user?.id) return
      
      setLoading(true)
      try {
        const result = await inversionesQueries.getByUserId(user.id)
        if (result.success && result.data) {
          setInversiones(result.data)
          generateNotifications(result.data)
        }
      } catch (error) {
        console.error('Error cargando inversiones:', error)
      } finally {
        setLoading(false)
      }
    }

    if (inversiones.length === 0) {
      loadInversiones()
    }
  }, [user?.id])

  const inversionesFiltradas = inversiones.filter(inversion => {
    switch (filtro) {
      case 'activas':
        return inversion.estado === 'Activa'
      case 'finalizadas':
        return inversion.estado === 'Finalizada'
      case 'canceladas':
        return inversion.estado === 'Cancelada'
      default:
        return true
    }
  })

  const totalInvertido = inversionesFiltradas.reduce((sum, inv) => sum + parseFloat(inv.capital), 0)
  const totalActivas = inversiones.filter(inv => inv.estado === 'Activa').length
  const totalFinalizadas = inversiones.filter(inv => inv.estado === 'Finalizada').length
  const getTipoAbreviado = (tipo: string) => {
  switch (tipo) {
    case 'Plazo Fijo': return 'PFijo'
    case 'Fondo de Inversión': return 'Fondo'
    case 'Ahorro Programado': return 'Ahorro'
    default: return tipo
  }
}

const getPeriodicidadAbreviada = (periodicidad: string) => {
  switch (periodicidad) {
    case 'Mensual': return 'Mensual'
    case 'Trimestral': return 'Trimestral'
    case 'Semestral': return 'Semestral'
    case 'Al vencimiento': return 'Al venc'
    default: return periodicidad
  }
}

  // Manejar eliminación de inversión
  const handleDeleteInversion = (inversion: Inversion) => {
    setConfirmDialog({
      isOpen: true,
      inversion
    })
  }

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!confirmDialog.inversion) return
    
    try {
      const result = await inversionesQueries.deleteInversion(confirmDialog.inversion.id.toString())
      
      if (result.success) {
        // Eliminar del estado local
        setInversiones(prev => prev.filter(inv => inv.id !== confirmDialog.inversion!.id))
        setConfirmDialog({ isOpen: false, inversion: null })
        
        // Mostrar mensaje de éxito
        alert('✅ Inversión eliminada exitosamente')
      } else {
        alert('❌ Error al eliminar la inversión')
      }
    } catch (error) {
      console.error('Error eliminando inversión:', error)
      alert('❌ Error al eliminar la inversión')
    }
  }

  // Cancelar eliminación
  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, inversion: null })
  }

  if (loading && inversiones.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg mb-2">Cargando inversiones...</div>
          <div className="text-sm text-gray-500">Esto solo tomará un momento</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">💼 Mis Inversiones</h1>
              <div className="text-sm text-gray-600">
                Todas tus inversiones registradas
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationsDropdown />
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filtros y Estadísticas */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-bold">Filtros y Estadísticas</h2>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
              {/* Filtros */}
              <div className="lg:col-span-2">
                <h3 className="font-semibold mb-2 text-sm">Filtrar por estado:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filtro === 'todas' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltro('todas')}
                  >
                    Todas ({inversiones.length})
                  </Button>
                  <Button
                    variant={filtro === 'activas' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltro('activas')}
                  >
                    Activas ({totalActivas})
                  </Button>
                  <Button
                    variant={filtro === 'finalizadas' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltro('finalizadas')}
                  >
                    Finalizadas ({totalFinalizadas})
                  </Button>
                  <Button
                    variant={filtro === 'canceladas' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltro('canceladas')}
                  >
                    Canceladas ({inversiones.filter(inv => inv.estado === 'Cancelada').length})
                  </Button>
                </div>
              </div>

              {/* Estadísticas del filtro actual */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">
                      ${totalInvertido.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Total invertido</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">
                      {totalActivas}
                    </div>
                    <div className="text-xs text-gray-600">Activas</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-lg font-bold text-red-600">
                      {totalFinalizadas}
                    </div>
                    <div className="text-xs text-gray-600">Finalizadas</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Inversiones */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">
              {filtro === 'todas' && 'Todas las Inversiones'}
              {filtro === 'activas' && 'Inversiones Activas'}
              {filtro === 'finalizadas' && 'Inversiones Finalizadas'}
              {filtro === 'canceladas' && 'Inversiones Canceladas'}
              <span className="text-sm text-gray-500 ml-2">({inversionesFiltradas.length})</span>
            </h2>
          </CardHeader>
          <CardContent>
            {inversionesFiltradas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entidad
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capital
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tasa
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plazo
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Periodicidad
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inversionesFiltradas.map((inversion) => (
                      <tr key={inversion.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900 text-xs">
                              {inversion.entidad}
                            </div>
                            <div className="text-xs text-gray-500">
                              {inversion.nombre}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-1 py-0.5 text-xs rounded-full ${
                            inversion.tipo === 'Plazo Fijo' 
                              ? 'bg-blue-100 text-blue-800'
                              : inversion.tipo === 'Fondo de Inversión'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {getTipoAbreviado(inversion.tipo)}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-xs">
                            ${parseFloat(inversion.capital).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-xs">
                            {inversion.tasa_interes}%
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-xs">
                            {inversion.plazo_dias}d
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-xs">
                            {getPeriodicidadAbreviada(inversion.periodicidad_pago)}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-xs">
                            {new Date(inversion.fecha_inicio).toLocaleDateString('es-EC')}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-xs">
                            {new Date(inversion.fecha_vencimiento).toLocaleDateString('es-EC')}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-1 py-0.5 text-xs rounded-full ${
                            inversion.estado === 'Activa' 
                              ? 'bg-green-100 text-green-800'
                              : inversion.estado === 'Finalizada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {inversion.estado}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedInversion(inversion)}
                            >
                              Ver
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleDeleteInversion(inversion)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay inversiones {filtro === 'todas' ? 'registradas' : filtro}
                </h3>
                <p className="text-gray-500">
                  {filtro === 'activas' && 'No tienes inversiones activas actualmente'}
                  {filtro === 'finalizadas' && 'No tienes inversiones finalizadas'}
                  {filtro === 'canceladas' && 'No tienes inversiones canceladas'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © 2026 MiPortafolio. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modal de detalles de inversión */}
      {selectedInversion && (
        <InversionDetailModal 
          inversion={selectedInversion} 
          onClose={() => setSelectedInversion(null)} 
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      {confirmDialog.isOpen && confirmDialog.inversion && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="⚠️ Eliminar Inversión"
          message={`¿Estás seguro de que deseas eliminar la inversión en ${confirmDialog.inversion.entidad} por $${parseFloat(confirmDialog.inversion.capital).toLocaleString()}? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          type="danger"
        />
      )}
    </div>
  )
}
