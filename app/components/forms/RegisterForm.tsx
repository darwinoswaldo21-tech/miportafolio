'use client'

import { useState } from 'react'
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Verificar variables de entorno
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      console.log('Supabase URL:', supabaseUrl)
      console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing')
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variables de entorno de Supabase no configuradas')
      }

      // Importar dinámicamente Supabase
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      })

      if (error) throw error
      
      setSuccess('¡Usuario creado! Revisa tu email para confirmar la cuenta.')
      
      // Si el usuario se crea sin confirmación (para desarrollo)
      if (data.user && !data.user.email_confirmed_at) {
        setTimeout(() => {
          window.location.href = '/login'
        }, 3000)
      }
    } catch (err: any) {
      console.error('Error en registro:', err)
      setError(err.message || 'Error al crear usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Regístrate para acceder al sistema financiero
          </p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Registrarse</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={setPassword}
                required
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <a href="/login" className="text-blue-600 hover:text-blue-500 text-sm">
                ¿Ya tienes cuenta? Inicia sesión
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
