'use client'

import { useState, useEffect } from 'react'
import { InvestmentCard } from '@/app/components/ui/InvestmentCard'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { inversionesQueries } from '@/lib/supabase/queries'
import { useAuth } from '@/app/hooks/useAuth'

interface Inversion {
  id: number
  nombre: string
  tipo: string
  entidad: string
  capital: string
  plazo_dias: number
  tasa_interes: string
  periodicidad_pago: string
  fecha_inicio: string
  fecha_vencimiento: string
  estado: string
  notas: string
  creado_en: string
}

interface MisInversionesCardProps {
  onVerInversiones?: () => void
}

export function MisInversionesCard({ onVerInversiones }: MisInversionesCardProps) {
  const { user } = useAuth()
  const [inversiones, setInversiones] = useState<Inversion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadInversiones = async () => {
      if (!user?.id) return
      
      try {
        const result = await inversionesQueries.getByUserId(user.id)
        if (result.success && result.data) {
          setInversiones(result.data)
        }
      } catch (error) {
        console.error('Error cargando inversiones:', error)
      }
    }

    // Solo cargar si no hay datos
    if (inversiones.length === 0) {
      loadInversiones()
    }
  }, [user?.id])

  const totalInvertido = inversiones.reduce((sum, inv) => sum + parseFloat(inv.capital), 0)
  
  const stats = [
    { label: "Plazos Fijos", value: `${inversiones.filter(inv => inv.tipo === 'Plazo Fijo').length} activos` },
    { label: "Fondos", value: `${inversiones.filter(inv => inv.tipo === 'Fondo de Inversión').length} activos` },
    { label: "Ahorros", value: `${inversiones.filter(inv => inv.tipo === 'Ahorro Programado').length} activos` },
    { label: "Total invertido", value: `$${totalInvertido.toLocaleString()}` }
  ]

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <h3 className="text-lg font-bold">💼 Mis Inversiones</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-gray-500">Cargando inversiones...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">💼 Mis Inversiones</h3>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => window.location.href = '/inversiones'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            📋 Ver Todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Stats principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mensaje de acción - siempre visible */}
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Gestiona todas tus inversiones
          </h4>
          <p className="text-gray-600 mb-4">
            Consulta detalles, estados y fechas de vencimiento
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/inversiones'}
            className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            📋 Ver Todas Mis Inversiones ({inversiones.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
