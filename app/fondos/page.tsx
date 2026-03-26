'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { useAuth } from '@/app/hooks/useAuth'

interface Fondo {
  id: number
  nombre: string
  tipo: string
  administradora: string
  rentabilidad_anual: number
  riesgo: string
  estado: string
}

interface InversionFondo {
  id: number
  nombre_inversion: string
  capital_inicial: number
  aporte_mensual: number
  aporte_extra: number
  fecha_inicio: string
  rentabilidad_esperada: number
  estado: string
  fondo: Fondo
}

export default function FondosPage() {
  const { user } = useAuth()
  const [fondos, setFondos] = useState<Fondo[]>([])
  const [inversiones, setInversiones] = useState<InversionFondo[]>([])
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState('todos')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [fondoSeleccionado, setFondoSeleccionado] = useState<Fondo | null>(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_inversion: '',
    capital_inicial: '',
    aporte_mensual: '',
    aporte_extra: '',
    fecha_inicio: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    cargarDatos()
  }, [user?.id])

  const cargarDatos = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      // Cargar fondos disponibles
      const fondosResponse = await fetch('/api/fondos')
      if (fondosResponse.ok) {
        const fondosData = await fondosResponse.json()
        setFondos(fondosData.data || [])
      }

      // Cargar inversiones del usuario
      const inversionesResponse = await fetch(`/api/inversiones-fondos?user_id=${user.id}`)
      if (inversionesResponse.ok) {
        const inversionesData = await inversionesResponse.json()
        setInversiones(inversionesData.data || [])
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fondosFiltrados = fondos.filter(fondo => {
    if (filtro === 'todos') return true
    return fondo.tipo.toLowerCase().includes(filtro.toLowerCase())
  })

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo.toLowerCase()) {
      case 'bajo': return 'text-green-600 bg-green-50'
      case 'medio': return 'text-yellow-600 bg-yellow-50'
      case 'alto': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'renta fija': return '🏦'
      case 'renta variable': return '📈'
      case 'mixto': return '⚖️'
      default: return '💰'
    }
  }

  const handleInvertir = (fondo: Fondo) => {
    setFondoSeleccionado(fondo)
    setMostrarFormulario(true)
    setFormData({
      ...formData,
      nombre_inversion: `Inversión en ${fondo.nombre}`
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id || !fondoSeleccionado) return

    try {
      const response = await fetch('/api/inversiones-fondos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          fondo_id: fondoSeleccionado.id,
          ...formData,
          rentabilidad_esperada: fondoSeleccionado.rentabilidad_anual
        })
      })

      if (response.ok) {
        setMostrarFormulario(false)
        setFondoSeleccionado(null)
        setFormData({
          nombre_inversion: '',
          capital_inicial: '',
          aporte_mensual: '',
          aporte_extra: '',
          fecha_inicio: new Date().toISOString().split('T')[0]
        })
        cargarDatos()
      }
    } catch (error) {
      console.error('Error creando inversión:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg mb-2">Cargando fondos de inversión...</div>
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
              <h1 className="text-xl font-bold text-gray-900">📈 Fondos de Inversión</h1>
              <div className="text-sm text-gray-600">
                Invierte con interés compuesto y aportes programados
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filtros */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filtro === 'todos' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFiltro('todos')}
              >
                Todos ({fondos.length})
              </Button>
              <Button
                variant={filtro === 'renta fija' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFiltro('renta fija')}
              >
                Renta Fija ({fondos.filter(f => f.tipo === 'Renta Fija').length})
              </Button>
              <Button
                variant={filtro === 'renta variable' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFiltro('renta variable')}
              >
                Renta Variable ({fondos.filter(f => f.tipo === 'Renta Variable').length})
              </Button>
              <Button
                variant={filtro === 'mixto' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFiltro('mixto')}
              >
                Mixtos ({fondos.filter(f => f.tipo === 'Mixto').length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mis Inversiones en Fondos */}
        {inversiones.length > 0 && (
          <Card className="mb-4">
            <CardHeader>
              <h2 className="text-lg font-bold">💼 Mis Inversiones en Fondos</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inversiones.map((inv) => (
                  <div key={inv.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{inv.nombre_inversion}</h3>
                        <p className="text-sm text-gray-600">{inv.fondo.nombre}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                          <span className="text-gray-500">Capital: ${inv.capital_inicial.toLocaleString()}</span>
                          <span className="text-gray-500">Aporte mensual: ${inv.aporte_mensual.toLocaleString()}</span>
                          <span className="text-gray-500">Aporte extra: ${inv.aporte_extra.toLocaleString()}</span>
                          <span className="text-gray-500">Rentabilidad: {inv.rentabilidad_esperada}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiesgoColor(inv.fondo.riesgo)}`}>
                          {inv.fondo.riesgo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fondos Disponibles */}
        <Card className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                Fondos Disponibles ({fondosFiltrados.length})
              </h2>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/fondos/crear'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                ➕ Crear Fondo Personalizado
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fondosFiltrados.map((fondo) => (
                <div key={fondo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{getTipoIcon(fondo.tipo)}</div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiesgoColor(fondo.riesgo)}`}>
                      {fondo.riesgo}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{fondo.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-3">{fondo.administradora}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium">{fondo.tipo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rentabilidad:</span>
                      <span className="font-bold text-green-600">{fondo.rentabilidad_anual}% anual</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => handleInvertir(fondo)}
                  >
                    💰 Invertir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Modal de formulario de inversión */}
      {mostrarFormulario && fondoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">💰 Invertir en {fondoSeleccionado.nombre}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la inversión
                </label>
                <Input
                  type="text"
                  value={formData.nombre_inversion}
                  onChange={(e) => setFormData({...formData, nombre_inversion: e})}
                  placeholder="Ej: Mi fondo de crecimiento"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capital inicial ($)
                </label>
                <Input
                  type="text"
                  value={formData.capital_inicial}
                  onChange={(e) => setFormData({...formData, capital_inicial: e})}
                  placeholder="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aporte mensual programado ($)
                </label>
                <Input
                  type="text"
                  value={formData.aporte_mensual}
                  onChange={(e) => setFormData({...formData, aporte_mensual: e})}
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aporte extra mensual ($) - Opcional
                </label>
                <Input
                  type="text"
                  value={formData.aporte_extra}
                  onChange={(e) => setFormData({...formData, aporte_extra: e})}
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de inicio
                </label>
                <Input
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData({...formData, fecha_inicio: e})}
                  required
                />
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Información:</strong><br/>
                  • Rentabilidad anual: {fondoSeleccionado.rentabilidad_anual}%<br/>
                  • Cálculo con interés compuesto<br/>
                  • Aportes mensuales automáticos
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Crear Inversión
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMostrarFormulario(false)
                    setFondoSeleccionado(null)
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
