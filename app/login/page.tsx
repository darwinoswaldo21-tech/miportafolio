'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular login exitoso
    setTimeout(() => {
      // Guardar sesión simulada
      localStorage.setItem('user', JSON.stringify({
        id: 'demo-user',
        email: email,
        name: 'Usuario Demo'
      }))
      
      // Redirigir al dashboard
      window.location.href = '/'
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            💰 MiPortafolio
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión para gestionar tus inversiones
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Iniciar Sesión</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e)}
                  placeholder="tu@email.com"
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e)}
                  placeholder="•••••••••"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Modo Demo: Usa cualquier correo y contraseña</p>
              <p>Ej: admin@demo.com / password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
