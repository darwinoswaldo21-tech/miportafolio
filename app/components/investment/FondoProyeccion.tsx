'use client'

import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'

interface FondoProyeccionProps {
  capitalInicial: number
  aporteMensual: number
  aporteExtra: number
  rentabilidadAnual: number
  plazoMeses: number
}

export function FondoProyeccion({ 
  capitalInicial, 
  aporteMensual, 
  aporteExtra, 
  rentabilidadAnual, 
  plazoMeses 
}: FondoProyeccionProps) {
  
  const calcularProyeccion = () => {
    const rentabilidadMensual = rentabilidadAnual / 100 / 12
    const proyecciones = []
    let saldoAcumulado = capitalInicial
    let totalAportes = capitalInicial
    let totalRendimientos = 0

    for (let mes = 1; mes <= plazoMeses; mes++) {
      // Calcular rendimiento del mes anterior
      const rendimientoMes = saldoAcumulado * rentabilidadMensual
      totalRendimientos += rendimientoMes
      
      // Sumar aportes del mes
      const aportesMes = aporteMensual + aporteExtra
      totalAportes += aportesMes
      
      // Actualizar saldo con rendimiento y aportes
      saldoAcumulado = saldoAcumulado + rendimientoMes + aportesMes
      
      proyecciones.push({
        mes,
        saldoAnterior: saldoAcumulado - rendimientoMes - aportesMes,
        rendimiento: rendimientoMes,
        aportes: aportesMes,
        saldoProyectado: saldoAcumulado,
        totalAportes: totalAportes,
        totalRendimientos: totalRendimientos
      })
    }
    
    return proyecciones
  }

  const proyecciones = calcularProyeccion()
  const saldoFinal = proyecciones[proyecciones.length - 1]?.saldoProyectado || 0
  const totalAportes = proyecciones[proyecciones.length - 1]?.totalAportes || 0
  const totalRendimientos = proyecciones[proyecciones.length - 1]?.totalRendimientos || 0
  const gananciaNeta = saldoFinal - totalAportes
  const rentabilidadTotal = ((gananciaNeta / totalAportes) * 100)

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(valor)
  }

  return (
    <div className="space-y-4">
      {/* Resumen de proyección */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <h4 className="font-semibold text-green-800">📈 Proyección a {plazoMeses} meses</h4>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">
                {formatearMoneda(saldoFinal)}
              </div>
              <div className="text-sm text-gray-600">Saldo Final</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">
                {formatearMoneda(totalAportes)}
              </div>
              <div className="text-sm text-gray-600">Total Aportes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">
                {formatearMoneda(totalRendimientos)}
              </div>
              <div className="text-sm text-gray-600">Total Rendimientos</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-lg font-bold text-orange-600">
                {rentabilidadTotal.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Rentabilidad Total</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-100 rounded">
            <p className="text-sm text-green-800">
              <strong>Ganancia neta:</strong> {formatearMoneda(gananciaNeta)}
              <span className="ml-2">(Interés compuesto con aportes mensuales)</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de proyección mensual */}
      <Card>
        <CardHeader>
          <h4 className="font-semibold">📅 Detalle Mensual (Primeros 6 meses)</h4>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Mes</th>
                  <th className="text-right p-2">Saldo Anterior</th>
                  <th className="text-right p-2">Rendimiento</th>
                  <th className="text-right p-2">Aportes</th>
                  <th className="text-right p-2">Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {proyecciones.slice(0, 6).map((proyeccion) => (
                  <tr key={proyeccion.mes} className="border-b">
                    <td className="p-2 font-medium">Mes {proyeccion.mes}</td>
                    <td className="text-right p-2">{formatearMoneda(proyeccion.saldoAnterior)}</td>
                    <td className="text-right p-2 text-green-600">
                      {formatearMoneda(proyeccion.rendimiento)}
                    </td>
                    <td className="text-right p-2 text-blue-600">
                      {formatearMoneda(proyeccion.aportes)}
                    </td>
                    <td className="text-right p-2 font-bold">
                      {formatearMoneda(proyeccion.saldoProyectado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {proyecciones.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                Ver todos los {proyecciones.length} meses
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico visual */}
      <Card>
        <CardHeader>
          <h4 className="font-semibold">📊 Crecimiento del Capital</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {proyecciones.slice(0, 12).map((proyeccion) => {
              const porcentajeCrecimiento = (proyeccion.saldoProyectado / saldoFinal) * 100
              return (
                <div key={proyeccion.mes} className="flex items-center space-x-3">
                  <div className="w-16 text-sm">Mes {proyeccion.mes}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${porcentajeCrecimiento}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {formatearMoneda(proyeccion.saldoProyectado)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
