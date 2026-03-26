'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'

interface Fiduciaria {
  id: string
  nombre?: string
  razon_social?: string
  descripcion?: string
  created_at?: string
  updated_at?: string
}

export default function DebugFiduciariasPage() {
  const [loading, setLoading] = useState(true)
  const [fiduciarias, setFiduciarias] = useState<Fiduciaria[]>([])
  const [error, setError] = useState('')
  const [apiResponse, setApiResponse] = useState<any>(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🔍 Probando API de fiduciarias...')
        
        const response = await fetch('/api/fiduciarias')
        const data = await response.json()
        
        console.log('📊 Respuesta completa de la API:', data)
        
        setApiResponse(data)
        
        if (data.success) {
          setFiduciarias(data.data || [])
          console.log('✅ Fiduciarias cargadas:', data.data?.length || 0)
        } else {
          setError(data.error || 'Error desconocido')
          console.error('❌ Error en API:', data.error)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error de red'
        setError(errorMessage)
        console.error('❌ Error de red:', err)
      } finally {
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔍 Debug de Fiduciarias</h1>
        
        {/* Estado de la API */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Estado de la API</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-lg">⏳ Cargando...</div>
                <div className="text-sm text-gray-600">Probando conexión con la API</div>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <div className="text-lg text-red-600">❌ Error</div>
                <div className="text-sm text-red-600">{error}</div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-lg text-green-600">✅ Conectado</div>
                <div className="text-sm text-green-600">API funcionando correctamente</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Respuesta completa de la API */}
        {apiResponse && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Respuesta de la API</h2>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Fiduciarias cargadas */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              Fiduciarias Cargadas ({fiduciarias.length})
            </h2>
          </CardHeader>
          <CardContent>
            {fiduciarias.length > 0 ? (
              <div className="space-y-2">
                {fiduciarias.map((fiduciaria) => (
                  <div key={fiduciaria.id} className="border p-3 rounded">
                    <div className="font-medium">{fiduciaria.nombre}</div>
                    {fiduciaria.razon_social && (
                      <div className="text-sm text-gray-600">{fiduciaria.razon_social}</div>
                    )}
                    <div className="text-xs text-gray-500">ID: {fiduciaria.id}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <div>No se encontraron fiduciarias</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex space-x-4">
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
          >
            🔄 Recargar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            🏠 Volver al Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/fondos/crear'}
          >
            📋 Ir al Formulario
          </Button>
        </div>
      </div>
    </div>
  )
}
