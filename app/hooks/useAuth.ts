'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }

  return { user, loading, signOut }
}
