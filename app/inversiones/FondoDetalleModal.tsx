'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'

interface FondoInversion {
  id: number
  nombre: string
  gestora_nombre: string
  valor_liquidativo: number
  rentabilidad: number
  aporte_mensual: number
  plazo: number
  estado: string
  creado_en: string
  unidades?: number
  valor_unidad_base?: number
}

interface DatosMensualesFondo {
  id?: number
  fondo_id: number
  mes: string
  unidades_participacion: number
  valor_unidad: number
  valor_total_mes: number
  tasa_efectiva_mes: number
  aporte_mensual: number
  notas: string
}

interface FondoDetalleModalProps {
  fondo: FondoInversion
  onClose: () => void
}

export function FondoDetalleModal({ fondo, onClose }: FondoDetalleModalProps) {
  const [editando, setEditando] = useState(false)
  const [mesSeleccionado, setMesSeleccionado] = useState('Marzo 2026')
  const [imagenSubida, setImagenSubida] = useState<File | null>(null)
  const [procesando, setProcesando] = useState(false)
  const [datosIa, setDatosIa] = useState<Partial<DatosMensualesFondo> | null>(null)
  
  const [datosMensuales, setDatosMensuales] = useState<DatosMensualesFondo>({
    fondo_id: fondo.id,
    mes: 'Marzo 2026',
    unidades_participacion: fondo.unidades || 226.92760352,
    valor_unidad: fondo.valor_unidad_base || 1.34906548,
    valor_total_mes: 306.22,
    tasa_efectiva_mes: fondo.rentabilidad,
    aporte_mensual: fondo.aporte_mensual,
    notas: ''
  })

  // Generar lista de meses desde la fecha de inicio hasta el mes actual
  const generarMeses = () => {
    const meses = []
    const fechaInicio = new Date(fondo.creado_en)
    const fechaActual = new Date()
    
    // Empezar desde el mes anterior al actual (el más antiguo disponible)
    let currentDate = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
    
    // Generar meses hacia atrás hasta la fecha de inicio
    while (currentDate >= fechaInicio) {
      const nombreMes = currentDate.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      })
      meses.unshift(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1))
      currentDate.setMonth(currentDate.getMonth() - 1)
    }
    
    return meses
  }

  const mesesDisponibles = generarMeses()

  // Calcular valor total automáticamente
  const calcularValorTotal = () => {
    return datosMensuales.unidades_participacion * datosMensuales.valor_unidad
  }

  // Manejar subida de imagen
  const handleImagenSubida = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImagenSubida(file)
    }
  }

  // Subir imagen permanentemente a Supabase
  const subirImagenPermanente = async () => {
    if (!imagenSubida) return
    
    setProcesando(true)
    try {
      const formData = new FormData()
      formData.append('imagen', imagenSubida)
      formData.append('fondo_id', fondo.id.toString())
      formData.append('mes', mesSeleccionado)
      
      // Si hay datos de IA, incluirlos
      if (datosIa) {
        formData.append('datos_extraidos', JSON.stringify(datosIa))
      }
      
      const response = await fetch('/api/subir-imagen-fondo', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const resultado = await response.json()
        if (resultado.success) {
          console.log('✅ Imagen guardada permanentemente:', resultado.datos.url_publica)
          
          // Mostrar mensaje de éxito
          alert(`✅ Imagen guardada exitosamente:\n📁 Archivo: ${resultado.datos.nombre_archivo}\n🔗 URL: ${resultado.datos.url_publica}`)
          
          // Limpiar formulario
          setImagenSubida(null)
          setDatosIa(null)
        } else {
          alert(`❌ Error guardando imagen: ${resultado.error}`)
        }
      } else {
        alert('❌ Error en la respuesta del servidor')
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      alert('❌ Error subiendo imagen. Intente nuevamente.')
    } finally {
      setProcesando(false)
    }
  }

  // Cambiar mes seleccionado
  const cambiarMes = (mes: string) => {
    setMesSeleccionado(mes)
    setDatosMensuales({
      ...datosMensuales,
      mes: mes
    })
    setDatosIa(null) // Limpiar datos de IA al cambiar mes
    setImagenSubida(null) // Limpiar imagen al cambiar mes
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">💰 Detalles del Fondo</h3>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-semibold text-lg">{fondo.nombre}</h4>
              <p className="text-gray-600">{fondo.gestora_nombre}</p>
            </div>

            {/* Selector de Mes */}
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold mb-2">📅 Seleccionar Mes a Editar</h4>
              <select 
                value={mesSeleccionado}
                onChange={(e) => cambiarMes(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {mesesDisponibles.map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
            </div>

            {/* Subida de Imagen */}
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold mb-2">📷 Subir Estado de Cuenta (Opcional)</h4>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleImagenSubida}
                  className="w-full p-2 border rounded"
                />
                {imagenSubida && (
                  <div className="text-sm text-gray-600">
                    📁 Archivo: {imagenSubida.name}
                  </div>
                )}
                <Button 
                  onClick={subirImagenPermanente}
                  disabled={!imagenSubida || procesando}
                  className="w-full"
                >
                  {procesando ? '📤 Subiendo...' : '📤 Subir Imagen Permanentemente'}
                </Button>
              </div>
            </div>

            {/* Resultados de IA */}
            {datosIa && (
              <div className="bg-yellow-50 p-4 rounded">
                <h4 className="font-semibold mb-2">🤖 Datos Extraídos por IA</h4>
                <div className="text-sm space-y-1">
                  <div>✅ Unidades detectadas: {datosIa.unidades_participacion}</div>
                  <div>✅ Valor unidad: ${datosIa.valor_unidad}</div>
                  <div>✅ Tasa efectiva: {datosIa.tasa_efectiva_mes}%</div>
                  <div>✅ Total mes: ${datosIa.valor_total_mes}</div>
                </div>
              </div>
            )}

            {/* Formulario de Edición */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">✏️ Editar Datos del Mes: {mesSeleccionado}</h4>
                <Button 
                  variant="outline"
                  onClick={() => setEditando(!editando)}
                >
                  {editando ? 'Cancelar Edición' : '✏️ Editar'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidades de Participación
                  </label>
                  {editando ? (
                    <input
                      type="number"
                      step="0.000001"
                      value={datosMensuales.unidades_participacion}
                      onChange={(e) => setDatosMensuales({
                        ...datosMensuales, 
                        unidades_participacion: parseFloat(e.target.value),
                        valor_total_mes: parseFloat(e.target.value) * datosMensuales.valor_unidad
                      })}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-purple-600">
                      {datosMensuales.unidades_participacion.toFixed(8)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor por Unidad
                  </label>
                  {editando ? (
                    <input
                      type="number"
                      step="0.000001"
                      value={datosMensuales.valor_unidad}
                      onChange={(e) => setDatosMensuales({
                        ...datosMensuales, 
                        valor_unidad: parseFloat(e.target.value),
                        valor_total_mes: datosMensuales.unidades_participacion * parseFloat(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-green-600">
                      ${datosMensuales.valor_unidad.toFixed(8)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Total del Mes
                  </label>
                  <div className="text-lg font-bold text-blue-700">
                    ${calcularValorTotal().toFixed(2)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tasa Efectiva del Mes (%)
                  </label>
                  {editando ? (
                    <input
                      type="number"
                      step="0.01"
                      value={datosMensuales.tasa_efectiva_mes}
                      onChange={(e) => setDatosMensuales({...datosMensuales, tasa_efectiva_mes: parseFloat(e.target.value)})}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-orange-600">
                      {datosMensuales.tasa_efectiva_mes}%
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aporte Mensual
                  </label>
                  {editando ? (
                    <input
                      type="number"
                      step="0.01"
                      value={datosMensuales.aporte_mensual}
                      onChange={(e) => setDatosMensuales({...datosMensuales, aporte_mensual: parseFloat(e.target.value)})}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-purple-600">
                      ${datosMensuales.aporte_mensual.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {editando && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas del mes
                  </label>
                  <textarea
                    value={datosMensuales.notas}
                    onChange={(e) => setDatosMensuales({...datosMensuales, notas: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Notas sobre el rendimiento del mes..."
                  />
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">📊 Cálculos del Mes</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Unidades × Valor unidad:</span>
                  <span className="font-medium">
                    {datosMensuales.unidades_participacion.toFixed(8)} × ${datosMensuales.valor_unidad.toFixed(8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valor total calculado:</span>
                  <span className="font-medium text-blue-600">
                    ${calcularValorTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rendimiento del mes:</span>
                  <span className="font-medium text-green-600">
                    ${(calcularValorTotal() - (fondo.valor_liquidativo || 100)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Con aporte mensual:</span>
                  <span className="font-medium">
                    ${(calcularValorTotal() + datosMensuales.aporte_mensual).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              <div className="space-x-2">
                {editando ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => setEditando(false)}
                    >
                      Cancelar
                    </Button>
                    <Button>
                      💾 Guardar Datos del Mes
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => setEditando(true)}
                  >
                    ✏️ Editar Datos del Mes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
