'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'

export default function DebugPage() {
  const [user, setUser] = useState<any>(null)
  const [inversiones, setInversiones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const debug = async () => {
      try {
        // 1. Obtener usuario actual
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        setUser(user)
        console.log('Usuario:', user)

        // 2. Obtener todas las inversiones (sin filtro)
        const { data: allInversiones, error: allError } = await supabase
          .from('inversiones')
          .select('*')
        
        if (allError) throw allError
        console.log('Todas las inversiones:', allInversiones)

        // 3. Obtener inversiones del usuario
        if (user) {
          const { data: userInversiones, error: userError } = await supabase
            .from('inversiones')
            .select('*')
            .eq('user_id', user.id)
          
          if (userError) throw userError
          console.log('Inversiones del usuario:', userInversiones)
          setInversiones(userInversiones || [])
        }

      } catch (err: any) {
        console.error('Error de debug:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    debug()
  }, [])

  if (loading) {
    return <div className="p-8">Cargando debug...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug de Inversiones</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <Card className="mb-4">
        <CardHeader>
          <h3 className="font-semibold">Información del Usuario</h3>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Creado:</strong> {new Date(user.created_at).toLocaleString()}</p>
            </div>
          ) : (
            <p>No hay usuario autenticado</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold">Inversiones Encontradas ({inversiones.length})</h3>
        </CardHeader>
        <CardContent>
          {inversiones.length > 0 ? (
            <div className="space-y-4">
              {inversiones.map((inv) => (
                <div key={inv.id} className="border p-4 rounded">
                  <h4 className="font-semibold">{inv.nombre}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>Tipo:</strong> {inv.tipo}</p>
                    <p><strong>Entidad:</strong> {inv.entidad}</p>
                    <p><strong>Capital:</strong> ${inv.capital}</p>
                    <p><strong>User ID:</strong> {inv.user_id}</p>
                    <p><strong>Estado:</strong> {inv.estado}</p>
                    <p><strong>Creado:</strong> {new Date(inv.creado_en).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No se encontraron inversiones</p>
          )}
        </CardContent>
      </Card>

      <div className="mt-4">
        <Button onClick={() => window.location.href = '/'}>
          Volver al Dashboard
        </Button>
      </div>
    </div>
  )
}
