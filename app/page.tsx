'use client'

import { Dashboard } from '@/app/components/Dashboard'
import { LoginForm } from '@/app/components/forms/LoginForm'
import { useAuth } from '@/app/hooks/useAuth'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginForm />
}
