'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'

interface InversionDetailModalProps {
  inversion: any
  onClose: () => void
}

interface PagoMes {
  mes: string
  fecha: string
  monto: number
  estado: 'pagado' | 'pendiente' | 'futuro'
}

// Función para obtener tipo abreviado
const getTipoAbreviado = (tipo: string) => {
  switch (tipo) {
    case 'Plazo Fijo': return 'PFijo'
    case 'Fondo de Inversión': return 'Fondo'
    case 'Ahorro Programado': return 'Ahorro'
    default: return tipo
  }
}

// Función para obtener periodicidad abreviada
const getPeriodicidadAbreviada = (periodicidad: string) => {
  switch (periodicidad) {
    case 'Mensual': return 'Mensual'
    case 'Trimestral': return 'Trimestral'
    case 'Semestral': return 'Semestral'
    case 'Al vencimiento': return 'Al venc'
    default: return periodicidad
  }
}

export function InversionDetailModal({ inversion, onClose }: InversionDetailModalProps) {
  const [pagos, setPagos] = useState<PagoMes[]>([])

  // Generar pagos mensuales basados en la periodicidad
  const generarPagos = () => {
    const pagosGenerados: PagoMes[] = []
    const fechaInicio = new Date(inversion.fecha_inicio)
    const fechaActual = new Date()
    
    // Determinar frecuencia de pagos
    let frecuenciaMeses = 1 // Mensual por defecto
    if (inversion.periodicidad_pago === 'Trimestral') frecuenciaMeses = 3
    if (inversion.periodicidad_pago === 'Semestral') frecuenciaMeses = 6
    
    // Calcular número de pagos hasta la fecha de vencimiento
    const fechaVencimiento = new Date(inversion.fecha_vencimiento)
    const mesesTotales = Math.ceil((fechaVencimiento.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const numeroPagos = Math.floor(mesesTotales / frecuenciaMeses)
    
    // Generar cada pago
    for (let i = 0; i < numeroPagos; i++) {
      const fechaPago = new Date(fechaInicio)
      fechaPago.setMonth(fechaPago.getMonth() + (i * frecuenciaMeses))
      
      const mesPago = fechaPago.toLocaleDateString('es-EC', { 
        year: 'numeric', 
        month: 'long' 
      })
      
      // Calcular estado del pago
      let estado: 'pagado' | 'pendiente' | 'futuro' = 'futuro'
      if (fechaPago < fechaActual) {
        estado = 'pagado'
      } else if (fechaPago.getMonth() === fechaActual.getMonth() && 
                 fechaPago.getFullYear() === fechaActual.getFullYear()) {
        estado = 'pendiente'
      }
      
      // Calcular monto del pago (interés mensual)
      const tasaDecimal = parseFloat(inversion.tasa_interes) / 100
      const tasaMensual = tasaDecimal / 12
      const montoInteres = parseFloat(inversion.capital) * tasaMensual * frecuenciaMeses
      
      pagosGenerados.push({
        mes: mesPago,
        fecha: fechaPago.toISOString().split('T')[0],
        monto: montoInteres,
        estado
      })
    }
    
    return pagosGenerados
  }

  const pagosGenerados = generarPagos()
  const pagosPagados = pagosGenerados.filter(p => p.estado === 'pagado')
  const proximoPago = pagosGenerados.find(p => p.estado === 'pendiente')
  const totalPagado = pagosPagados.reduce((sum, p) => sum + p.monto, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">💰 Detalles de Inversión</h3>
              <p className="text-sm text-gray-600">{inversion.nombre}</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <h4 className="font-semibold">📋 Información General</h4>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Tipo:</span>
                  <div className="font-medium">{getTipoAbreviado(inversion.tipo)}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Capital:</span>
                  <div className="font-medium text-lg">${parseFloat(inversion.capital).toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Tasa:</span>
                  <div className="font-medium">{inversion.tasa_interes}% anual</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Periodicidad:</span>
                  <div className="font-medium">{getPeriodicidadAbreviada(inversion.periodicidad_pago)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="font-semibold">📅 Fechas</h4>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Inicio:</span>
                  <div className="font-medium">
                    {new Date(inversion.fecha_inicio).toLocaleDateString('es-EC', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Vencimiento:</span>
                  <div className="font-medium">
                    {new Date(inversion.fecha_vencimiento).toLocaleDateString('es-EC', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Plazo:</span>
                  <div className="font-medium">{inversion.plazo_dias} días</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de pagos */}
          <Card className="mb-6">
            <CardHeader>
              <h4 className="font-semibold">💳 Resumen de Pagos</h4>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    ${totalPagado.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Pagado</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {pagosPagados.length}
                  </div>
                  <div className="text-sm text-gray-600">Pagos Realizados</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded">
                  <div className="text-2xl font-bold text-orange-600">
                    ${proximoPago?.monto.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-600">Próximo Pago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendario de pagos */}
          <Card>
            <CardHeader>
              <h4 className="font-semibold">📅 Calendario de Pagos de Intereses</h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pagosGenerados.map((pago, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      pago.estado === 'pagado' 
                        ? 'bg-green-50 border-green-200' 
                        : pago.estado === 'pendiente'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        pago.estado === 'pagado' 
                          ? 'bg-green-500' 
                          : pago.estado === 'pendiente'
                          ? 'bg-orange-500'
                          : 'bg-gray-400'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">{pago.mes}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(pago.fecha).toLocaleDateString('es-EC', {
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        pago.estado === 'pagado' 
                          ? 'text-green-600' 
                          : pago.estado === 'pendiente'
                          ? 'text-orange-600'
                          : 'text-gray-600'
                        }`}>
                        ${pago.monto.toLocaleString()}
                      </div>
                      <div className={`text-xs ${
                        pago.estado === 'pagado' 
                          ? 'text-green-600' 
                          : pago.estado === 'pendiente'
                          ? 'text-orange-600'
                          : 'text-gray-500'
                        }`}>
                        {pago.estado === 'pagado' ? '✅ Pagado' : 
                           pago.estado === 'pendiente' ? '⏰ Por pagar' : '📅 Futuro'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getPeriodicidadAbreviada(inversion.periodicidad_pago)} - {pago.monto.toLocaleString()} de intereses
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notas */}
          {inversion.notas && (
            <Card className="mt-6">
              <CardHeader>
                <h4 className="font-semibold">📝 Notas</h4>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {inversion.notas}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </div>
    </div>
  )
}
