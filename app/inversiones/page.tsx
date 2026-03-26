'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { useAuth } from '@/app/hooks/useAuth'
import { inversionesQueries } from '@/lib/supabase/queries'
import { InversionDetailModal } from '@/app/components/investment/InversionDetailModal'
import { FondoDetalleModal } from './FondoDetalleModal'

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

interface DetalleGananciaFondo {
  nombre: string
  inversionInicial: number
  valorActual: number
  ganancia: number
  porcentaje: number
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
          console.log('🔍 Cargando inversiones a plazo fijo...')
          const inversionesResult = await inversionesQueries.getByUserId(user?.id?.toString() || "1")
          console.log('📊 Resultado inversiones:', inversionesResult)
          
          if (inversionesResult.success && inversionesResult.data) {
            inversionesData = inversionesResult.data
            setInversiones(inversionesData)
            console.log('✅ Inversiones cargadas:', inversionesData.length)
          }
        } catch (error) {
          console.log('⚠️ Error cargando inversiones a plazo fijo:', error)
        }

        // Cargar fondos de inversión
        try {
          console.log('🔍 Cargando fondos de inversión...')
          const fondosResponse = await fetch('/api/fondos')
          console.log('📊 Respuesta fondos:', fondosResponse.status)
          
          if (fondosResponse.ok) {
            fondosData = await fondosResponse.json()
            setFondos(fondosData.data || [])
            console.log('✅ Fondos cargados:', fondosData.data?.length || 0)
          }
        } catch (error) {
          console.log('⚠️ Error cargando fondos de inversión:', error)
        }

        // Combinar todas las inversiones
        const combinadas = [
          ...inversionesData,
          ...(fondosData?.data || [])
        ].sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())

        setTodasLasInversiones(combinadas)
        console.log('✅ Todas las inversiones combinadas:', combinadas.length)
      } catch (error) {
        console.error('❌ Error general cargando inversiones:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTodasLasInversiones()
  }, [user?.id])

  // Separar las inversiones por tipo
  const esFondoInversion = (inversion: TodasLasInversiones): inversion is FondoInversion => {
    return 'valor_liquidativo' in inversion
  }

  const fondosDeInversion = todasLasInversiones.filter(esFondoInversion)
  const plazosFijos = todasLasInversiones.filter(inv => !esFondoInversion(inv))
  
  // Calcular ganancias de fondos de inversión
  const calcularGananciasFondos = () => {
    console.log('🧮 Calculando ganancias de todos los fondos...')
    
    if (fondosDeInversion.length === 0) {
      return {
        totalInvertido: 0,
        valorActual: 0,
        gananciaTotal: 0,
        porcentajeTotal: 0,
        detallesPorFondo: [] as DetalleGananciaFondo[]
      }
    }
    
    let totalInvertido = 0
    let valorActual = 0
    const detallesPorFondo: DetalleGananciaFondo[] = []
    
    fondosDeInversion.forEach(fondo => {
      // Calcular valor actual basado en unidades y valor liquidativo
      const valorActualFondo = fondo.unidades * fondo.valor_liquidativo
      const inversionInicialFondo = fondo.valor_unidad_base * fondo.unidades
      const gananciaFondo = valorActualFondo - inversionInicialFondo
      const porcentajeFondo = inversionInicialFondo > 0 ? (gananciaFondo / inversionInicialFondo) * 100 : 0
      
      totalInvertido += inversionInicialFondo
      valorActual += valorActualFondo
      
      detallesPorFondo.push({
        nombre: fondo.nombre,
        inversionInicial: inversionInicialFondo,
        valorActual: valorActualFondo,
        ganancia: gananciaFondo,
        porcentaje: porcentajeFondo
      })
    })
    
    const gananciaTotal = valorActual - totalInvertido
    const porcentajeTotal = totalInvertido > 0 ? (gananciaTotal / totalInvertido) * 100 : 0
    
    console.log('💰 Resultados generales:')
    console.log('- Total invertido:', totalInvertido)
    console.log('- Valor actual:', valorActual)
    console.log('- Ganancia total:', gananciaTotal)
    console.log('- Porcentaje total:', porcentajeTotal)
    
    return {
      totalInvertido,
      valorActual,
      gananciaTotal,
      porcentajeTotal,
      detallesPorFondo
    }
  }
  
  // Depuración: mostrar qué se está cargando
  console.log('🔍 Total inversiones combinadas:', todasLasInversiones.length)
  console.log('🔍 Fondos de inversión:', fondosDeInversion.length)
  console.log('🔍 Plazos fijos:', plazosFijos.length)
  console.log('🔍 Lista de plazos fijos:', plazosFijos)

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
        {/* Estadísticas Generales */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">📊 Estadísticas Generales</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  ${totalInvertido.toLocaleString()}
                </div>
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
                  {todasLasInversiones.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Ganancias de Fondos */}
        {fondosDeInversion.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-green-600">💰 Resumen de Ganancias - Fondos de Inversión</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Resumen General */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">💻 Inversión Total</div>
                      <div className="text-xl font-bold text-blue-600">
                        ${calcularGananciasFondos().totalInvertido.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">💎 Valor Actual</div>
                      <div className="text-xl font-bold text-green-600">
                        ${calcularGananciasFondos().valorActual.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">📈 Ganancia/Pérdida</div>
                      <div className={`text-xl font-bold ${calcularGananciasFondos().gananciaTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calcularGananciasFondos().gananciaTotal >= 0 ? '📈 +' : '📉 '}
                        ${Math.abs(calcularGananciasFondos().gananciaTotal).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">📊 Rendimiento</div>
                      <div className={`text-xl font-bold ${calcularGananciasFondos().porcentajeTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calcularGananciasFondos().porcentajeTotal >= 0 ? '📈 +' : '📉 '}
                        {Math.abs(calcularGananciasFondos().porcentajeTotal).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalles por Fondo */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">📈 Detalles por Fondo:</h3>
                  {calcularGananciasFondos().detallesPorFondo.map((detalle, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{detalle.nombre}</div>
                          <div className="text-xs text-gray-600">
                            ${detalle.inversionInicial.toLocaleString('es-ES', { minimumFractionDigits: 2 })} → ${detalle.valorActual.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${detalle.ganancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {detalle.ganancia >= 0 ? '📈 +' : '📉 '}
                            ${Math.abs(detalle.ganancia).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </div>
                          <div className={`text-xs ${detalle.porcentaje >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {detalle.porcentaje >= 0 ? '📈 +' : '📉 '}
                            {Math.abs(detalle.porcentaje).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fondos de Inversión */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-blue-600">
              💰 Fondos de Inversión ({fondosDeInversion.length})
            </h2>
          </CardHeader>
          <CardContent>
            {fondosDeInversion.length > 0 ? (
              <div className="space-y-4">
                {fondosDeInversion.map((inversion) => (
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
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            inversion.estado === 'Activo' 
                              ? 'bg-green-100 text-green-800'
                              : inversion.estado === 'Finalizada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {inversion.estado}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {inversion.gestora_nombre}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Tipo:</span>
                            <div className="font-medium">{getTipoAbreviado(inversion)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Valor Liquidativo:</span>
                            <div className="font-medium text-green-600">
                              ${inversion.valor_liquidativo.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Rentabilidad:</span>
                            <div className="font-medium">
                              {inversion.rentabilidad}%
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Plazo:</span>
                            <div className="font-medium">
                              {inversion.plazo} días
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button 
                          variant="outline" 
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
              <div className="text-center py-8">
                <p className="text-gray-500">No tienes fondos de inversión registrados</p>
                <Button 
                  onClick={() => window.location.href = '/fondos/crear'}
                  className="mt-4"
                >
                  Crear mi primer fondo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inversiones a Plazo Fijo */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-bold text-green-600">
              🏦 Inversiones a Plazo Fijo ({plazosFijos.length})
            </h2>
          </CardHeader>
          <CardContent>
            {plazosFijos.length > 0 ? (
              <div className="space-y-4">
                {plazosFijos.map((inversion) => (
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
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            inversion.estado === 'Activo' 
                              ? 'bg-green-100 text-green-800'
                              : inversion.estado === 'Finalizada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {inversion.estado}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {esFondoInversion(inversion) ? inversion.gestora_nombre : (inversion as Inversion).entidad}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Tipo:</span>
                            <div className="font-medium">{getTipoAbreviado(inversion)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Capital:</span>
                            <div className="font-medium text-green-600">
                              ${esFondoInversion(inversion) 
                                ? inversion.valor_liquidativo.toLocaleString() 
                                : parseFloat((inversion as Inversion).capital).toLocaleString()
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Tasa:</span>
                            <div className="font-medium">
                              {esFondoInversion(inversion) 
                                ? `${inversion.rentabilidad}%` 
                                : `${(inversion as Inversion).tasa_interes}%`
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Plazo:</span>
                            <div className="font-medium">
                              {esFondoInversion(inversion) 
                                ? `${inversion.plazo} días` 
                                : `${(inversion as Inversion).plazo_dias} días`
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button 
                          variant="outline" 
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
              <div className="text-center py-8">
                <p className="text-gray-500">No tienes inversiones a plazo fijo registradas</p>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="mt-4"
                >
                  Crear mi primera inversión
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modal de detalles - usar el modal correcto según el tipo */}
      {selectedInversion && esFondoInversion(selectedInversion) && (
        <FondoDetalleModal 
          fondo={selectedInversion} 
          onClose={() => setSelectedInversion(null)} 
        />
      )}
      {selectedInversion && !esFondoInversion(selectedInversion) && (
        <InversionDetailModal 
          inversion={selectedInversion as Inversion} 
          onClose={() => setSelectedInversion(null)} 
        />
      )}
    </div>
  )
}
