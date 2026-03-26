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
}

interface FondoDetalleModalProps {
  fondo: FondoInversion
  onClose: () => void
}

export function FondoDetalleModal({ fondo, onClose }: FondoDetalleModalProps) {
  const [tasaActual, setTasaActual] = useState(fondo.rentabilidad)
  const [aporteExtra, setAporteExtra] = useState(fondo.aporte_mensual)
  const [editando, setEditando] = useState(false)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">💰 Detalles del Fondo</h3>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-semibold text-lg">{fondo.nombre}</h4>
              <p className="text-gray-600">{fondo.gestora_nombre}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Liquidativo Actual
                </label>
                <div className="text-lg font-semibold text-green-600">
                  ${fondo.valor_liquidativo.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tasa de Rentabilidad (%)
                </label>
                {editando ? (
                  <input
                    type="number"
                    step="0.01"
                    value={tasaActual}
                    onChange={(e) => setTasaActual(parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <div className="text-lg font-semibold text-blue-600">
                    {tasaActual}%
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
                    value={aporteExtra}
                    onChange={(e) => setAporteExtra(parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <div className="text-lg font-semibold text-purple-600">
                    ${aporteExtra.toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plazo
                </label>
                <div className="text-lg font-semibold">
                  {fondo.plazo} días
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">📊 Proyección Mensual</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Rendimiento mensual:</span>
                  <span className="font-medium">
                    ${(fondo.valor_liquidativo * tasaActual / 100 / 12).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total con aporte:</span>
                  <span className="font-medium">
                    ${(fondo.valor_liquidativo + aporteExtra + (fondo.valor_liquidativo * tasaActual / 100 / 12)).toFixed(2)}
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
                      💾 Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => setEditando(true)}
                  >
                    ✏️ Editar
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
