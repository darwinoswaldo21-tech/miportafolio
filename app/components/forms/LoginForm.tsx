'use client'

import { useState } from 'react'
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { supabase } from '@/lib/supabase'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      // Redirección automática al dashboard
      if (data.user) {
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sistema Financiero
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión para acceder al dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Iniciar Sesión</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={email}
                onChange={setEmail}
                required
              />
              
              <Input
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                required
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <a href="/register" className="text-blue-600 hover:text-blue-500 text-sm">
                ¿No tienes cuenta? Regístrate
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
