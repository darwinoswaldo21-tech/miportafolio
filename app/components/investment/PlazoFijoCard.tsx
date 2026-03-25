'use client'

import { useState } from 'react'
import { InvestmentCard } from '@/app/components/ui/InvestmentCard'
import { Input } from '@/app/components/ui/Input'
import { Autocomplete } from '@/app/components/ui/Autocomplete'
import { Button } from '@/app/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Select } from '@/app/components/ui/Select'
import { Textarea } from '@/app/components/ui/Textarea'
import { entidadesSearchQueries, inversionesQueries } from '@/lib/supabase/queries'

interface PlazoFijoCardProps {
  onCreatePlazoFijo?: (data: any) => void
}

export function PlazoFijoCard({ onCreatePlazoFijo }: PlazoFijoCardProps) {
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    monto: '',
    tasa_interes: '',
    plazo_dias: '',
    fecha_inicio: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    fecha_vencimiento: '', // Se calculará pero podrá editarse
    entidad_id: '',
    entidad_nombre: '',
    entidad_ruc: '',
    entidad_segmento: '',
    periodicidad_pago: 'Mensual', // Valor por defecto
    notas: '' // Campo de notas del usuario
  })
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<any>(null)

  const handleEntidadSearch = async (query: string) => {
    try {
      return await entidadesSearchQueries.searchByName(query)
    } catch (error) {
      console.error('Error searching entidades:', error)
      return []
    }
  }

  // Función para calcular fecha de vencimiento automáticamente
  const calcularFechaVencimiento = (fechaInicio: string, plazoDias: string) => {
    if (!fechaInicio || !plazoDias) return ''
    
    const fecha = new Date(fechaInicio)
    const vencimiento = new Date(fecha)
    vencimiento.setDate(vencimiento.getDate() + parseInt(plazoDias))
    
    return vencimiento.toISOString().split('T')[0]
  }

  // Actualizar fecha de vencimiento cuando cambian fecha_inicio o plazo_dias
  const handleFechaInicioChange = (value: string) => {
    const nuevaFechaVencimiento = calcularFechaVencimiento(value, formData.plazo_dias)
    setFormData({
      ...formData,
      fecha_inicio: value,
      fecha_vencimiento: nuevaFechaVencimiento
    })
  }

  const handlePlazoDiasChange = (value: string) => {
    const nuevaFechaVencimiento = calcularFechaVencimiento(formData.fecha_inicio, value)
    setFormData({
      ...formData,
      plazo_dias: value,
      fecha_vencimiento: nuevaFechaVencimiento
    })
  }

  const handleEntidadSelect = (entidad: { id: string; nombre: string; ruc?: string; segmento?: string }) => {
    setFormData({
      ...formData,
      entidad_id: entidad.id,
      entidad_nombre: entidad.nombre,
      entidad_ruc: entidad.ruc || '',
      entidad_segmento: entidad.segmento || ''
    })
    setEntidadSeleccionada(entidad)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.entidad_nombre) {
      setMessage('Por favor selecciona una entidad financiera')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Combinar notas del usuario con notas automáticas del sistema
      const notasAutomaticas = `Plazo fijo a ${formData.plazo_dias} días al ${formData.tasa_interes}% - Pagos ${formData.periodicidad_pago.toLowerCase()}`
      const notasCompletas = formData.notas 
        ? `${formData.notas}\n\n${notasAutomaticas}`
        : notasAutomaticas

      // Validar fecha de vencimiento para determinar el estado correcto
      const fechaVencimiento = new Date(formData.fecha_vencimiento)
      const fechaActual = new Date()
      const estado = fechaVencimiento < fechaActual ? 'Finalizada' : 'Activa'

      console.log('Enviando datos:', {
        nombre: `Plazo Fijo - ${formData.entidad_nombre}`,
        tipo: 'Plazo Fijo',
        entidad: formData.entidad_nombre,
        capital: formData.monto,
        plazo_dias: formData.plazo_dias,
        tasa_interes: formData.tasa_interes,
        periodicidad_pago: formData.periodicidad_pago, // Usar la periodicidad seleccionada
        fecha_inicio: formData.fecha_inicio,
        fecha_vencimiento: formData.fecha_vencimiento, // Usar la fecha del formulario (calculada o editada)
        estado: estado, // Estado basado en la fecha de vencimiento
        notas: notasCompletas
      })

      const result = await inversionesQueries.create({
        nombre: `Plazo Fijo - ${formData.entidad_nombre}`,
        tipo: 'Plazo Fijo',
        entidad: formData.entidad_nombre,
        capital: formData.monto,
        plazo_dias: formData.plazo_dias,
        tasa_interes: formData.tasa_interes,
        periodicidad_pago: formData.periodicidad_pago, // Usar la periodicidad seleccionada
        fecha_inicio: formData.fecha_inicio,
        fecha_vencimiento: formData.fecha_vencimiento, // Usar la fecha del formulario
        estado: estado, // Estado basado en la fecha de vencimiento
        notas: notasCompletas
      })

      console.log('Resultado de la creación:', result)

      if (result.success) {
        setMessage('✅ Plazo fijo creado exitosamente')
        onCreatePlazoFijo?.(formData)
        
        // Limpiar formulario
        setFormData({ 
          monto: '', 
          tasa_interes: '', 
          plazo_dias: '', 
          fecha_inicio: new Date().toISOString().split('T')[0],
          fecha_vencimiento: '',
          entidad_id: '',
          entidad_nombre: '',
          entidad_ruc: '',
          entidad_segmento: '',
          periodicidad_pago: 'Mensual',
          notas: ''
        })
        setEntidadSeleccionada(null)
        
        // Cerrar formulario después de 2 segundos
        setTimeout(() => {
          setShowForm(false)
          setMessage('')
        }, 2000)
      } else {
        console.error('Error específico:', result.error)
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error completo al crear plazo fijo:', error)
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (showForm) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h3 className="text-lg font-bold">Crear Plazo Fijo</h3>
          <button 
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Monto a invertir"
              type="text"
              placeholder="1000.00"
              value={formData.monto}
              onChange={(value) => setFormData({...formData, monto: value})}
              required
            />
            
            <Input
              label="Tasa de interés (%)"
              type="text"
              placeholder="8.5"
              value={formData.tasa_interes}
              onChange={(value) => setFormData({...formData, tasa_interes: value})}
              required
            />

            <Select
              label="Periodicidad de pago de intereses"
              value={formData.periodicidad_pago}
              onChange={(value) => setFormData({...formData, periodicidad_pago: value})}
              options={[
                { value: 'Mensual', label: 'Mensual (cada mes)' },
                { value: 'Trimestral', label: 'Trimestral (cada 3 meses)' },
                { value: 'Semestral', label: 'Semestral (cada 6 meses)' },
                { value: 'Al vencimiento', label: 'Al vencimiento (todo junto)' }
              ]}
              placeholder="Selecciona periodicidad"
              required
            />
            
            <Input
              label="Plazo (días)"
              type="text"
              placeholder="180"
              value={formData.plazo_dias}
              onChange={handlePlazoDiasChange}
              required
            />

            <Input
              label="Fecha de inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={handleFechaInicioChange}
              required
            />

            <Input
              label="Fecha de vencimiento (editable)"
              type="date"
              value={formData.fecha_vencimiento}
              onChange={(value) => setFormData({...formData, fecha_vencimiento: value})}
              required
            />
            
            <Autocomplete
              label="Entidad Financiera"
              placeholder="Escribe para buscar entidad..."
              value={formData.entidad_nombre}
              onChange={(value) => setFormData({...formData, entidad_nombre: value})}
              onSearch={handleEntidadSearch}
              onSelect={handleEntidadSelect}
              required
            />

            <Textarea
              label="Notas personales (opcional)"
              placeholder="Agrega notas personales sobre esta inversión..."
              value={formData.notas}
              onChange={(value) => setFormData({...formData, notas: value})}
              rows={3}
            />

            {entidadSeleccionada && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                <div className="font-semibold text-blue-800 mb-2">Entidad Financiera Seleccionada:</div>
                <div className="space-y-1">
                  <div><strong>Nombre:</strong> {entidadSeleccionada.nombre}</div>
                  <div><strong>RUC:</strong> <span className="font-mono text-xs bg-gray-100 px-1 rounded">{entidadSeleccionada.ruc}</span></div>
                  <div><strong>Segmento:</strong> <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{entidadSeleccionada.segmento}</span></div>
                </div>
              </div>
            )}

            {formData.fecha_inicio && formData.plazo_dias && formData.fecha_vencimiento && (
              <div className={`text-sm p-2 rounded ${
                (() => {
                  const fechaVencimiento = new Date(formData.fecha_vencimiento)
                  const fechaActual = new Date()
                  return fechaVencimiento < fechaActual ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-600'
                })()
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Fecha de vencimiento:</strong> {
                      new Date(formData.fecha_vencimiento).toLocaleDateString('es-EC', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    }
                  </div>
                  <div className="text-xs">
                    {(() => {
                      const fechaInicio = new Date(formData.fecha_inicio)
                      const fechaVenc = new Date(formData.fecha_vencimiento)
                      const diasReales = Math.ceil((fechaVenc.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))
                      const diasTeoricos = parseInt(formData.plazo_dias)
                      const diferencia = diasReales - diasTeoricos
                      
                      if (diferencia === 0) return `✅ ${diasReales} días exactos`
                      if (diferencia > 0) return `⚠️ ${diasReales} días (+${diferencia})`
                      return `⚠️ ${diasReales} días (${diferencia})`
                    })()}
                  </div>
                </div>
                {(() => {
                  const fechaVencimiento = new Date(formData.fecha_vencimiento)
                  const fechaActual = new Date()
                  const diasParaVencer = Math.ceil((fechaVencimiento.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24))
                  
                  if (diasParaVencer < 0) {
                    return (
                      <div className="mt-2 text-xs font-semibold">
                        ⚠️ Esta inversión ya venció hace {Math.abs(diasParaVencer)} días
                        <br />
                        Estado será: <span className="text-red-800">FINALIZADA</span>
                      </div>
                    )
                  } else if (diasParaVencer <= 7) {
                    return (
                      <div className="mt-2 text-xs text-orange-600">
                        ⏰ Próxima a vencer en {diasParaVencer} días
                      </div>
                    )
                  } else {
                    return (
                      <div className="mt-2 text-xs text-gray-500">
                        💡 Puedes ajustar la fecha de vencimiento según la entidad financiera
                      </div>
                    )
                  }
                })()}
              </div>
            )}

            {formData.periodicidad_pago && (
              <div className="text-sm text-gray-600 bg-purple-50 p-2 rounded">
                <strong>Periodicidad de pago:</strong> {
                  formData.periodicidad_pago === 'Mensual' ? 'Cada mes' :
                  formData.periodicidad_pago === 'Trimestral' ? 'Cada 3 meses' :
                  formData.periodicidad_pago === 'Semestral' ? 'Cada 6 meses' :
                  'Todo junto al vencimiento'
                }
              </div>
            )}

            {formData.notas && (
              <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                <strong>Tus notas:</strong> {formData.notas}
              </div>
            )}

            {message && (
              <div className={`text-sm p-2 rounded ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading}
              >
                {isLoading ? 'Creando...' : 'Crear'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowForm(false)
                  setMessage('')
                }}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <InvestmentCard
      title="Plazo Fijo"
      description="Crear una inversión de tipo Plazo Fijo"
      icon="🏦"
      buttonText="Crear inversión"
      buttonColor="blue"
      onClick={() => setShowForm(true)}
    />
  )
}
