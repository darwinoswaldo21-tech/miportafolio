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
  const [pasoActual, setPasoActual] = useState(1)
  const [loading, setLoading] = useState(false)
  
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

  const [errores, setErrores] = useState<Record<string, string>>({})
  const [fiduciarias, setFiduciarias] = useState<Array<{id: string, razon_social: string}>>([])
  const [loadingFiduciarias, setLoadingFiduciarias] = useState(true)

  const validarPaso = (paso: number): boolean => {
    const nuevosErrores: Record<string, string> = {}

    switch (paso) {
      case 1:
        if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido'
        if (!formData.plazo_dias || formData.plazo_dias <= 0) nuevosErrores.plazo_dias = 'El plazo es requerido'
        if (!formData.administradora) nuevosErrores.administradora = 'Seleccione una administradora'
        break
      case 2:
        if (!formData.valor_liquidativo || formData.valor_liquidativo <= 0) nuevosErrores.valor_liquidativo = 'El valor liquidativo es requerido'
        if (!formData.rentabilidad || formData.rentabilidad <= 0) nuevosErrores.rentabilidad = 'La rentabilidad es requerida'
        if (!formData.aporte_mensual || formData.aporte_mensual < 0) nuevosErrores.aporte_mensual = 'El aporte mensual es requerido'
        break
      case 3:
        if (!formData.fecha_inicio) nuevosErrores.fecha_inicio = 'La fecha de inicio es requerida'
        if (!formData.fecha_vencimiento) nuevosErrores.fecha_vencimiento = 'La fecha de vencimiento es requerida'
        if (new Date(formData.fecha_vencimiento) <= new Date(formData.fecha_inicio)) {
          nuevosErrores.fecha_vencimiento = 'La fecha de vencimiento debe ser posterior a la de inicio'
        }
        break
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const siguientePaso = () => {
    if (validarPaso(pasoActual)) {
      if (pasoActual < 4) {
        setPasoActual(pasoActual + 1)
      }
    }
  }

  const pasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1)
    }
  }

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
        console.log('🔍 Iniciando carga de fiduciarias en el formulario...')
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
          console.log('✅ Fiduciarias cargadas en formulario:', data.data?.length || 0)
        } else {
          console.error('❌ Error en respuesta de API:', data.error)
          // Agregar fiduciarias reales por defecto si falla la API
          setFiduciarias([
            { id: '1', razon_social: 'ADMINISTRADORA DE FONDOS ADMUNIFONDOS S.A. (ADMIN. MUNICIPAL DE FONDOS Y FIDEICOMISOS SOC. ANONIMA)' },
            { id: '2', razon_social: 'ADMINISTRADORA DE FONDOS DYNAMO S.A.' },
            { id: '3', razon_social: 'FIDUVAL S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
            { id: '4', razon_social: 'TRUST FIDUCIARIA S.A.' },
            { id: '5', razon_social: 'ENLACE NEGOCIOS FIDUCIARIOS S.A.' },
            { id: '8', razon_social: 'AFPV ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
            { id: '9', razon_social: 'ANALYTICAFUNDS MANAGEMENT C.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
            { id: '10', razon_social: 'ANEFI S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
            { id: '11', razon_social: 'ARAFISA S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
            { id: '12', razon_social: 'BANCO CENTRAL DEL ECUADOR' },
            { id: '13', razon_social: 'CAPITALIUM ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
            { id: '14', razon_social: 'CORPORACION FINANCIERA NACIONAL BP' },
            { id: '15', razon_social: 'CORPORACION NACIONAL DE FINANZAS POPULARES Y SOLIDARIAS' },
            { id: '16', razon_social: 'ENLACE NEGOCIOS FIDUCIARIOS S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
            { id: '17', razon_social: 'FIDES TRUST, ADMINISTRADORA DE NEGOCIOS FIDUCIARIOS FITRUST S.A.' },
            { id: '18', razon_social: 'FIDUCIA S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS MERCANTILES' },
            { id: '19', razon_social: 'FIDUCIARIA ATLÁNTIDA FIDUTLAN ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
            { id: '20', razon_social: 'FIDUCIARIA DEL PACIFICO S.A. FIDUPACIFICO' },
            { id: '21', razon_social: 'FIDUCIARIA ECUADOR FIDUECUADOR S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
            { id: '22', razon_social: 'FIDUNEGOCIOS S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
            { id: '23', razon_social: 'GENERATRUST ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
            { id: '24', razon_social: 'HEIMDALTRUST ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
            { id: '25', razon_social: 'LATINTRUST S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
            { id: '46', razon_social: 'PLUS FONDOS S.A.' }
          ])
        }
      } catch (error) {
        console.error('❌ Error cargando fiduciarias en formulario:', error)
        // Agregar fiduciarias reales por defecto si hay error de red
        setFiduciarias([
          { id: '1', razon_social: 'ADMINISTRADORA DE FONDOS ADMUNIFONDOS S.A. (ADMIN. MUNICIPAL DE FONDOS Y FIDEICOMISOS SOC. ANONIMA)' },
          { id: '2', razon_social: 'ADMINISTRADORA DE FONDOS DYNAMO S.A.' },
          { id: '3', razon_social: 'FIDUVAL S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
          { id: '4', razon_social: 'TRUST FIDUCIARIA S.A.' },
          { id: '5', razon_social: 'ENLACE NEGOCIOS FIDUCIARIOS S.A.' },
          { id: '8', razon_social: 'AFPV ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
          { id: '9', razon_social: 'ANALYTICAFUNDS MANAGEMENT C.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
          { id: '10', razon_social: 'ANEFI S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
          { id: '11', razon_social: 'ARAFISA S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
          { id: '12', razon_social: 'BANCO CENTRAL DEL ECUADOR' },
          { id: '13', razon_social: 'CAPITALIUM ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
          { id: '14', razon_social: 'CORPORACION FINANCIERA NACIONAL BP' },
          { id: '15', razon_social: 'CORPORACION NACIONAL DE FINANZAS POPULARES Y SOLIDARIAS' },
          { id: '16', razon_social: 'ENLACE NEGOCIOS FIDUCIARIOS S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
          { id: '17', razon_social: 'FIDES TRUST, ADMINISTRADORA DE NEGOCIOS FIDUCIARIOS FITRUST S.A.' },
          { id: '18', razon_social: 'FIDUCIA S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS MERCANTILES' },
          { id: '19', razon_social: 'FIDUCIARIA ATLÁNTIDA FIDUTLAN ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
          { id: '20', razon_social: 'FIDUCIARIA DEL PACIFICO S.A. FIDUPACIFICO' },
          { id: '21', razon_social: 'FIDUCIARIA ECUADOR FIDUECUADOR S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
          { id: '22', razon_social: 'FIDUNEGOCIOS S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
          { id: '23', razon_social: 'GENERATRUST ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
          { id: '24', razon_social: 'HEIMDALTRUST ADMINISTRADORA DE FONDOS Y FIDEICOMISOS S.A.' },
          { id: '25', razon_social: 'LATINTRUST S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS' },
          { id: '46', razon_social: 'PLUS FONDOS S.A.' }
        ])
      } finally {
        setLoadingFiduciarias(false)
      }
    }

    cargarFiduciarias()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarPaso(3)) return

    setLoading(true)
    try {
      // Simulación de guardado
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('¡Fondo de inversión creado exitosamente!')
      window.location.href = '/fondos'
    } catch (error) {
      console.error('Error creando fondo:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-semibold">Información Básica</h3>
              <p className="text-sm text-gray-600">Configura los datos principales de tu fondo</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Fondo <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e})}
                placeholder="Ej: Fondo Crecimiento 2026"
                className={errores.nombre ? 'border-red-500' : ''}
              />
              {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plazo <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.plazo_dias ? formData.plazo_dias.toString() : ''}
                onChange={(e) => setFormData({...formData, plazo_dias: parseInt(e) || 0})}
                placeholder="Ej: 360 días o 12 meses"
                className={errores.plazo_dias ? 'border-red-500' : ''}
              />
              {errores.plazo_dias && <p className="text-red-500 text-xs mt-1">{errores.plazo_dias}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gestora / Administradora <span className="text-red-500">*</span>
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
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-semibold">Detalles Financieros</h3>
              <p className="text-sm text-gray-600">Configura los valores y rentabilidad</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Liquidativo ($) <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.valor_liquidativo ? formData.valor_liquidativo.toString() : ''}
                onChange={(e) => setFormData({...formData, valor_liquidativo: parseFloat(e) || 0})}
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
                onChange={(e) => setFormData({...formData, rentabilidad: parseFloat(e) || 0})}
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
                onChange={(e) => setFormData({...formData, aporte_mensual: parseFloat(e) || 0})}
                placeholder="500.00"
                className={errores.aporte_mensual ? 'border-red-500' : ''}
              />
              {errores.aporte_mensual && <p className="text-red-500 text-xs mt-1">{errores.aporte_mensual}</p>}
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> La rentabilidad se calculará sobre el valor liquidativo más los aportes acumulados con interés compuesto.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-semibold">Fechas y Estado</h3>
              <p className="text-sm text-gray-600">Define el período y estado del fondo</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({...formData, fecha_inicio: e})}
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
                onChange={(e) => setFormData({...formData, fecha_vencimiento: e})}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 Notas / Comentarios
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({...formData, notas: e.target.value})}
                placeholder="Información adicional, estrategia, observaciones sobre el fondo..."
                rows={4}
                className="w-full p-2 border rounded-md border-gray-300"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📌</div>
              <h3 className="text-lg font-semibold">Resumen del registro</h3>
              <p className="text-sm text-gray-600">Revisa toda la información antes de guardar</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📋 Información Básica</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Fondo:</span> <span className="font-medium">{formData.nombre || '—'}</span></div>
                      <div><span className="text-gray-600">Plazo:</span> <span className="font-medium">{formData.plazo_dias || '—'} días</span></div>
                      <div><span className="text-gray-600">Administradora:</span> <span className="font-medium">{formData.administradora || '—'}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">💰 Detalles Financieros</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Valor liquidativo:</span> <span className="font-medium">${(formData.valor_liquidativo || 0).toLocaleString()}</span></div>
                      <div><span className="text-gray-600">Rentabilidad:</span> <span className="font-medium">{formData.rentabilidad || '—'}%</span></div>
                      <div><span className="text-gray-600">Aporte mensual:</span> <span className="font-medium">${(formData.aporte_mensual || 0).toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📅 Fechas y Estado</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Inicio:</span> <span className="font-medium">{formData.fecha_inicio ? new Date(formData.fecha_inicio).toLocaleDateString('es-EC') : '—'}</span></div>
                      <div><span className="text-gray-600">Vencimiento:</span> <span className="font-medium">{formData.fecha_vencimiento ? new Date(formData.fecha_vencimiento).toLocaleDateString('es-EC') : '—'}</span></div>
                      <div><span className="text-gray-600">Estado:</span> <span className="font-medium">{formData.estado}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📝 Notas</h4>
                    <div className="text-sm">
                      {formData.notas ? <p>{formData.notas}</p> : <p className="text-gray-500">Sin notas adicionales</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-800">
                <strong>✅ Listo para guardar:</strong> Revisa que toda la información sea correcta antes de confirmar el registro.
              </p>
            </div>
          </div>
        )

      default:
        return null
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
              <Button variant="outline" onClick={() => window.location.href = '/fondos'}>
                ⬅ Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/login'}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((paso) => (
              <div key={paso} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  pasoActual === paso 
                    ? 'bg-blue-600 text-white' 
                    : pasoActual > paso 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {pasoActual > paso ? '✓' : paso}
                </div>
                {paso < 4 && (
                  <div className={`w-full h-1 mx-2 ${
                    pasoActual > paso ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Básico</span>
            <span>Financiero</span>
            <span>Fechas</span>
            <span>Confirmar</span>
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {renderPaso()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={pasoAnterior}
                  disabled={pasoActual === 1}
                  className={pasoActual === 1 ? 'invisible' : ''}
                >
                  ← Anterior
                </Button>

                {pasoActual < 4 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={siguientePaso}
                  >
                    Siguiente →
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? 'Guardando...' : '💾 Guardar Fondo de Inversión'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          © 2026 MiPortafolio. Todos los derechos reservados.
        </div>
      </main>
    </div>
  )
}
