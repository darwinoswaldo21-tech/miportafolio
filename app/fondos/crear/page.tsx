'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { useAuth } from '@/app/hooks/useAuth'

interface FondoPersonalizado {
  nombre: string
  plazo_dias: number
  administradora: string
  valor_liquidativo: number
  rentabilidad: number
  aporte_mensual: number
  fecha_inicio: string
  fecha_vencimiento: string
  estado: string
  notas: string
}

export default function CrearFondoPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fiduciarias, setFiduciarias] = useState<Array<{id: string, razon_social: string}>>([])
  const [loadingFiduciarias, setLoadingFiduciarias] = useState(true)
  const [errores, setErrores] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<FondoPersonalizado>({
    nombre: '',
    plazo_dias: 0,
    administradora: '',
    valor_liquidativo: 0,
    rentabilidad: 0,
    aporte_mensual: 0,
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    estado: 'Activo',
    notas: ''
  })

  const calcularFechaVencimiento = () => {
    if (formData.fecha_inicio && formData.plazo_dias > 0) {
      const fecha = new Date(formData.fecha_inicio)
      fecha.setDate(fecha.getDate() + formData.plazo_dias)
      setFormData({
        ...formData,
        fecha_vencimiento: fecha.toISOString().split('T')[0]
      })
    }
  }

  useEffect(() => {
    calcularFechaVencimiento()
  }, [formData.fecha_inicio, formData.plazo_dias])

  useEffect(() => {
    const cargarFiduciarias = async () => {
      try {
        console.log('🔍 Iniciando carga de fiduciarias...')
        setLoadingFiduciarias(true)
        
        const response = await fetch('/api/fiduciarias')
        console.log('📡 Respuesta HTTP:', response.status, response.statusText)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('📊 Datos recibidos:', data)
        
        if (data.success) {
          setFiduciarias(data.data || [])
          console.log('✅ Fiduciarias cargadas:', data.data?.length || 0)
        } else {
          console.error('❌ Error en respuesta de API:', data.error)
        }
      } catch (error) {
        console.error('❌ Error cargando fiduciarias:', error)
      } finally {
        setLoadingFiduciarias(false)
      }
    }

    cargarFiduciarias()
  }, [])

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido'
    if (!formData.plazo_dias || formData.plazo_dias <= 0) nuevosErrores.plazo_dias = 'El plazo es requerido'
    if (!formData.administradora) nuevosErrores.administradora = 'Seleccione una administradora'
    if (!formData.valor_liquidativo || formData.valor_liquidativo <= 0) nuevosErrores.valor_liquidativo = 'El valor liquidativo es requerido'
    if (!formData.rentabilidad || formData.rentabilidad <= 0) nuevosErrores.rentabilidad = 'La rentabilidad es requerida'
    if (!formData.fecha_inicio) nuevosErrores.fecha_inicio = 'La fecha de inicio es requerida'
    if (!formData.fecha_vencimiento) nuevosErrores.fecha_vencimiento = 'La fecha de vencimiento es requerida'
    if (new Date(formData.fecha_vencimiento) <= new Date(formData.fecha_inicio)) {
      nuevosErrores.fecha_vencimiento = 'La fecha de vencimiento debe ser posterior a la de inicio'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) return

    setLoading(true)
    try {
      console.log('🔍 Guardando fondo en la base de datos...')
      
      // Preparar los datos para guardar
      const fondoData = {
        nombre: formData.nombre,
        administradora: formData.administradora,
        plazo_dias: formData.plazo_dias,
        valor_liquidativo: formData.valor_liquidativo,
        rentabilidad: formData.rentabilidad,
        aporte_mensual: formData.aporte_mensual,
        fecha_inicio: formData.fecha_inicio,
        fecha_vencimiento: formData.fecha_vencimiento,
        estado: formData.estado,
        notas: formData.notas
      }

      console.log('📊 Datos a guardar:', fondoData)

      // Guardar en Supabase
      const response = await fetch('/api/fondos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fondoData)
      })

      console.log('📡 Respuesta HTTP:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Error del servidor:', errorData)
        throw new Error(errorData.details || errorData.error || 'Error al guardar el fondo')
      }

      const result = await response.json()
      console.log('📡 Respuesta del servidor:', result)
      console.log('✅ Fondo guardado exitosamente:', result)
      alert('¡Fondo de inversión creado exitosamente!')
      window.location.href = '/'
      
    } catch (error) {
      console.error('❌ Error creando fondo:', error)
      alert(`Error al crear el fondo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">💼 Fondos de Inversión</h1>
              <p className="text-sm text-gray-600">Registra y gestiona tus fondos</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 hover:bg-gray-700"
              >
                🏠 Volver al Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/login'}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Formulario completo en una sola página */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">💰</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Fondo de Inversión</h2>
                <p className="text-sm text-gray-600">Completa todos los campos para registrar tu fondo</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid de 2 columnas para mejor organización */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Columna 1: Información Básica */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">📋 Información Básica</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Fondo <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.nombre}
                          onChange={(value) => setFormData({...formData, nombre: value})}
                          placeholder="Fondo Crecimiento 2026"
                          className={errores.nombre ? 'border-red-500' : ''}
                        />
                        {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plazo (días) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.plazo_dias ? formData.plazo_dias.toString() : ''}
                          onChange={(value) => setFormData({...formData, plazo_dias: parseInt(value) || 0})}
                          placeholder="360"
                          className={errores.plazo_dias ? 'border-red-500' : ''}
                        />
                        {errores.plazo_dias && <p className="text-red-500 text-xs mt-1">{errores.plazo_dias}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Administradora <span className="text-red-500">*</span>
                        </label>
                        {loadingFiduciarias ? (
                          <div className="w-full p-2 border rounded-md border-gray-300 text-gray-500">
                            Cargando fiduciarias...
                          </div>
                        ) : (
                          <select
                            value={formData.administradora}
                            onChange={(e) => setFormData({...formData, administradora: e.target.value})}
                            className={`w-full p-2 border rounded-md ${errores.administradora ? 'border-red-500' : 'border-gray-300'}`}
                          >
                            <option value="">Seleccione una fiduciaria...</option>
                            {fiduciarias.map(fiduciaria => (
                              <option key={fiduciaria.id} value={fiduciaria.razon_social}>
                                {fiduciaria.razon_social}
                              </option>
                            ))}
                            <option value="Otra">Otra (no registrada)</option>
                          </select>
                        )}
                        {errores.administradora && <p className="text-red-500 text-xs mt-1">{errores.administradora}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Detalles Financieros */}
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">💰 Detalles Financieros</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor Liquidativo ($) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.valor_liquidativo ? formData.valor_liquidativo.toString() : ''}
                          onChange={(value) => setFormData({...formData, valor_liquidativo: parseFloat(value) || 0})}
                          placeholder="100.00"
                          className={errores.valor_liquidativo ? 'border-red-500' : ''}
                        />
                        {errores.valor_liquidativo && <p className="text-red-500 text-xs mt-1">{errores.valor_liquidativo}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rentabilidad (%) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.rentabilidad ? formData.rentabilidad.toString() : ''}
                          onChange={(value) => setFormData({...formData, rentabilidad: parseFloat(value) || 0})}
                          placeholder="8.5"
                          className={errores.rentabilidad ? 'border-red-500' : ''}
                        />
                        {errores.rentabilidad && <p className="text-red-500 text-xs mt-1">{errores.rentabilidad}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Aporte Mensual ($) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.aporte_mensual ? formData.aporte_mensual.toString() : ''}
                          onChange={(value) => setFormData({...formData, aporte_mensual: parseFloat(value) || 0})}
                          placeholder="500.00"
                        />
                        {errores.aporte_mensual && <p className="text-red-500 text-xs mt-1">{errores.aporte_mensual}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna 3: Fechas y Estado */}
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-3">📅 Fechas y Estado</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha Inicio <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={formData.fecha_inicio}
                          onChange={(value) => setFormData({...formData, fecha_inicio: value})}
                          className={errores.fecha_inicio ? 'border-red-500' : ''}
                        />
                        {errores.fecha_inicio && <p className="text-red-500 text-xs mt-1">{errores.fecha_inicio}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha Vencimiento <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={formData.fecha_vencimiento}
                          onChange={(value) => setFormData({...formData, fecha_vencimiento: value})}
                          className={errores.fecha_vencimiento ? 'border-red-500' : ''}
                        />
                        {errores.fecha_vencimiento && <p className="text-red-500 text-xs mt-1">{errores.fecha_vencimiento}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                          Calculada automáticamente: {formData.plazo_dias} días desde el inicio
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.estado}
                          onChange={(e) => setFormData({...formData, estado: e.target.value})}
                          className="w-full p-2 border rounded-md border-gray-300"
                        >
                          <option value="Activo">✅ Activo</option>
                          <option value="Inactivo">❌ Inactivo</option>
                          <option value="Pendiente">⏳ Pendiente</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas - ocupa todo el ancho */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-3">📝 Notas Adicionales</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentarios y Observaciones
                  </label>
                  <textarea
                    value={formData.notas}
                    onChange={(e) => setFormData({...formData, notas: e.target.value})}
                    placeholder="Información adicional, estrategia, observaciones sobre el fondo..."
                    rows={3}
                    className="w-full p-2 border rounded-md border-gray-300"
                  />
                </div>
              </div>

              {/* Resumen y Botones */}
              <div className="border-t pt-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">📌 Resumen del Fondo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Fondo:</span>
                      <div className="font-medium">{formData.nombre || '—'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Plazo:</span>
                      <div className="font-medium">{formData.plazo_dias || '—'} días</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor Liquidativo:</span>
                      <div className="font-medium">${(formData.valor_liquidativo || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Rentabilidad:</span>
                      <div className="font-medium">{formData.rentabilidad || '—'}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Aporte Mensual:</span>
                      <div className="font-medium">${(formData.aporte_mensual || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Administradora:</span>
                      <div className="font-medium">{formData.administradora || '—'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Inicio:</span>
                      <div className="font-medium">{formData.fecha_inicio ? new Date(formData.fecha_inicio).toLocaleDateString('es-EC') : '—'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Vencimiento:</span>
                      <div className="font-medium">{formData.fecha_vencimiento ? new Date(formData.fecha_vencimiento).toLocaleDateString('es-EC') : '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                  >
                    {loading ? 'Guardando...' : '💾 Crear Fondo de Inversión'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          © 2026 MiPortafolio. Todos los derechos reservados.
        </div>
      </main>
    </div>
  )
}
