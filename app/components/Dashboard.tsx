'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { useAuth } from '@/app/hooks/useAuth'
import { dashboardQueries } from '@/lib/supabase/queries'
import { DashboardStats, Entidad, Fiduciaria } from '@/app/types'
import { PlazoFijoCard } from '@/app/components/investment/PlazoFijoCard'
import { AhorroProgramadoCard } from '@/app/components/investment/AhorroProgramadoCard'
import { FondosInversionCard } from '@/app/components/investment/FondosInversionCard'
import { MisInversionesCard } from '@/app/components/investment/MisInversionesCard'
import { CalculadoraCard } from '@/app/components/investment/CalculadoraCard'
import { BoletinesCard } from '@/app/components/investment/BoletinesCard'
import { AnalisisIACard } from '@/app/components/investment/AnalisisIACard'
import { NotificationsDropdown } from '@/app/components/ui/NotificationsDropdown'
import { FloatingPanel } from '@/app/components/ui/FloatingPanel'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({ total: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar stats solo si es primera vez o si están vacías
        if (stats.total === 0) {
          const statsData = await dashboardQueries.getStats()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, []) // Sin dependencias, solo se ejecuta una vez

  const handleCreatePlazoFijo = (data: any) => {
    console.log('Creando Plazo Fijo:', data)
    // TODO: Implementar creación en Supabase
  }

  const handleCreateAhorro = (data: any) => {
    console.log('Creando Ahorro Programado:', data)
    // TODO: Implementar creación en Supabase
  }

  const handleVerFondos = () => {
    console.log('Ver Fondos de Inversión')
    // TODO: Navegar a página de fondos
  }

  const handleVerInversiones = () => {
    console.log('Ver Mis Inversiones')
    // TODO: Navegar a página de inversiones
  }

  const handleAbrirCalculadora = () => {
    console.log('Abrir Calculadora')
    // TODO: Navegar a calculadora
  }

  const handleGestionarBoletines = () => {
    console.log('Gestionar Boletines SEPS')
    // TODO: Navegar a gestión de boletines
  }

  const handleAnalizarCooperativa = (data: any) => {
    console.log('Analizando Cooperativa con IA:', data)
    // TODO: Implementar análisis con IA
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">� MiPortafolio</h1>
              <p className="text-gray-600">Gestiona tus inversiones financieras</p>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationsDropdown />
              <Button variant="outline" onClick={signOut}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Investment Cards Grid - Cards principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <PlazoFijoCard onCreatePlazoFijo={handleCreatePlazoFijo} />
          <AhorroProgramadoCard onCreateAhorro={handleCreateAhorro} />
          <FondosInversionCard onVerFondos={handleVerFondos} />
          <CalculadoraCard onAbrirCalculadora={handleAbrirCalculadora} />
        </div>

        {/* Tools Row - Herramientas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <BoletinesCard onGestionarBoletines={handleGestionarBoletines} />
          <AnalisisIACard onAnalizarCooperativa={handleAnalizarCooperativa} />
        </div>

        {/* Stats Section - Estadísticas importantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-2xl">🏦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Entidades Financieras</p>
                  <p className="text-2xl font-bold text-gray-900">198</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Invertido</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.total?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mis Inversiones - Al final para no estorbar */}
        <div className="mb-8">
          <MisInversionesCard onVerInversiones={handleVerInversiones} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © 2026 MiPortafolio. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Panel Flotante de Personalización */}
      <FloatingPanel />
    </div>
  )
}
