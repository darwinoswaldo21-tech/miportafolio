'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { useAuth } from '@/app/hooks/useAuth'
import { inversionesQueries } from '@/lib/supabase/queries'
import { InversionDetailModal } from '@/app/components/investment/InversionDetailModal'

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
  estado: string
  notas: string
  creado_en: string
}

interface FondoInversion {
  id: number
  user_id: number | null
  nombre: string
  gestora_id: number | null
  gestora_nombre: string
  plazo: number
  valor_liquidativo: number
  rentabilidad: number
  aporte_mensual: number
  fecha_inicio: string
  fecha_vencimiento: string
  estado: string
  notas: string
  creado_en: string
  unidades: number
  valor_unidad_base: number
  fecha_base: string
  es_fondo_unidades: boolean
}

type TodasLasInversiones = Inversion | FondoInversion

export default function InversionesPage() {
  const { user } = useAuth()
  const [inversiones, setInversiones] = useState<Inversion[]>([])
  const [fondos, setFondos] = useState<FondoInversion[]>([])
  const [todasLasInversiones, setTodasLasInversiones] = useState<TodasLasInversiones[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedInversion, setSelectedInversion] = useState<TodasLasInversiones | null>(null)

  useEffect(() => {
    const loadTodasLasInversiones = async () => {
      setLoading(true)
      try {
        let fondosData: any = null
        let inversionesData: Inversion[] = []

        // Cargar inversiones a plazo fijo
        try {
          const inversionesResult = await inversionesQueries.getByUserId(user?.id?.toString() || "1")
          if (inversionesResult.success && inversionesResult.data) {
            inversionesData = inversionesResult.data
            setInversiones(inversionesData)
          }
        } catch (error) {
          console.log('⚠️ No se pudieron cargar inversiones a plazo fijo')
        }

        // Cargar fondos de inversión
        try {
          const fondosResponse = await fetch('/api/fondos')
          if (fondosResponse.ok) {
            fondosData = await fondosResponse.json()
            setFondos(fondosData.data || [])
          }
        } catch (error) {
          console.log('⚠️ No se pudieron cargar fondos de inversión')
        }

        // Combinar todas las inversiones
        const combinadas = [
          ...inversionesData,
          ...(fondosData?.data || [])
        ].sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())

        setTodasLasInversiones(combinadas)
      } catch (error) {
        console.error('Error cargando todas las inversiones:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTodasLasInversiones()
  }, [user?.id])

  // Calcular estadísticas combinadas
  const totalInvertido = todasLasInversiones.reduce((sum, inv) => {
    if ('capital' in inv) {
      return sum + parseFloat(inv.capital)
    } else if ('valor_liquidativo' in inv) {
      return sum + inv.valor_liquidativo
    }
    return sum
  }, 0)
  
  const totalActivas = todasLasInversiones.filter(inv => inv.estado === 'Activo' || inv.estado === 'Activa').length
  const totalFinalizadas = todasLasInversiones.filter(inv => inv.estado === 'Finalizada').length

  const getTipoAbreviado = (inversion: TodasLasInversiones) => {
    if ('capital' in inversion) {
      return 'PFijo' // Es plazo fijo
    } else {
      return 'Fondo' // Es fondo de inversión
    }
  }

  const esFondoInversion = (inversion: TodasLasInversiones): inversion is FondoInversion => {
    return 'valor_liquidativo' in inversion
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
              <Button variant="primary" onClick={() => window.location.href = '/'}>
                ➕ Nueva Inversión
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Estadísticas */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-bold">📊 Resumen de Inversiones</h2>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  ${totalInvertido.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Invertido</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {totalActivas}
                </div>
                <div className="text-sm text-gray-600">Activas</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">
                  {totalFinalizadas}
                </div>
                <div className="text-sm text-gray-600">Finalizadas</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {inversiones.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Inversiones */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">
              Todas las Inversiones ({inversiones.length})
            </h2>
          </CardHeader>
          <CardContent>
            {inversiones.length > 0 ? (
              <div className="space-y-4">
                {inversiones.map((inversion) => (
                  <div 
                    key={inversion.id} 
                    className="border p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {inversion.nombre}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            inversion.estado === 'Activa' 
                              ? 'bg-green-100 text-green-800'
                              : inversion.estado === 'Finalizada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {inversion.estado}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {esFondoInversion(inversion) ? inversion.gestora_nombre : inversion.entidad}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Tipo:</span>
                            <div className="font-medium">{getTipoAbreviado(inversion)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {esFondoInversion(inversion) ? 'Valor Liquidativo:' : 'Capital:'}
                            </span>
                            <div className="font-medium text-green-600">
                              ${esFondoInversion(inversion) 
                                ? inversion.valor_liquidativo.toLocaleString() 
                                : parseFloat(inversion.capital).toLocaleString()
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {esFondoInversion(inversion) ? 'Rentabilidad:' : 'Tasa:'}
                            </span>
                            <div className="font-medium">
                              {esFondoInversion(inversion) 
                                ? `${inversion.rentabilidad}%` 
                                : `${inversion.tasa_interes}%`
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Plazo:</span>
                            <div className="font-medium">
                              {esFondoInversion(inversion) 
                                ? `${inversion.plazo} días` 
                                : `${inversion.plazo_dias} días`
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Periodicidad:</span>
                            <div className="font-medium">{getPeriodicidadAbreviada(inversion.periodicidad_pago)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Inicio:</span>
                            <div className="font-medium">
                              {new Date(inversion.fecha_inicio).toLocaleDateString('es-EC')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Vencimiento:</span>
                            <div className="font-medium">
                              {new Date(inversion.fecha_vencimiento).toLocaleDateString('es-EC')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Creada:</span>
                            <div className="font-medium">
                              {new Date(inversion.creado_en).toLocaleDateString('es-EC')}
                            </div>
                          </div>
                        </div>

                        {inversion.notas && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                            <span className="text-gray-500">Notas:</span> {inversion.notas}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => setSelectedInversion(inversion)}
                        >
                          📋 Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes inversiones registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Crea tu primera inversión para comenzar a gestionar tu portafolio
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => window.location.href = '/'}
                >
                  Crear mi primera inversión
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modal de detalles - solo para plazo fijo */}
      {selectedInversion && !esFondoInversion(selectedInversion) && (
        <InversionDetailModal 
          inversion={selectedInversion as Inversion} 
          onClose={() => setSelectedInversion(null)} 
        />
      )}
    </div>
  )
}
