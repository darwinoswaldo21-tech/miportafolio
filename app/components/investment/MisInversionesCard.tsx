'use client'

import { useState, useEffect } from 'react'
import { InvestmentCard } from '@/app/components/ui/InvestmentCard'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { inversionesQueries } from '@/lib/supabase/queries'
import { useAuth } from '@/app/hooks/useAuth'
import { FondoDetalleModal } from '@/app/inversiones/FondoDetalleModal'

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

interface FondoInversion {
  id: number
  nombre: string
  gestora_nombre: string
  valor_liquidativo: number
  rentabilidad: number
  aporte_mensual: number
  plazo: number
  estado: string
  creado_en: string
  unidades?: number
  valor_unidad_base?: number
}

type TodasLasInversiones = Inversion | FondoInversion

interface MisInversionesCardProps {
  onVerInversiones?: () => void
}

export function MisInversionesCard({ onVerInversiones }: MisInversionesCardProps) {
  const { user } = useAuth()
  const [inversiones, setInversiones] = useState<Inversion[]>([])
  const [fondos, setFondos] = useState<FondoInversion[]>([])
  const [todasLasInversiones, setTodasLasInversiones] = useState<TodasLasInversiones[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedInversion, setSelectedInversion] = useState<FondoInversion | null>(null)

  const esFondoInversion = (inversion: TodasLasInversiones): inversion is FondoInversion => {
    return 'valor_liquidativo' in inversion
  }

  useEffect(() => {
    const loadTodasLasInversiones = async () => {
      setLoading(true)
      try {
        let inversionesData: Inversion[] = []
        let fondosData: FondoInversion[] = []

        // Cargar inversiones a plazo fijo
        try {
          const inversionesResult = await inversionesQueries.getByUserId(user?.id?.toString() || "1")
          if (inversionesResult.success && inversionesResult.data) {
            inversionesData = inversionesResult.data
            setInversiones(inversionesData)
          }
        } catch (error) {
          console.log('⚠️ Error cargando inversiones a plazo fijo')
        }

        // Cargar fondos de inversión
        try {
          const fondosResponse = await fetch('/api/fondos')
          if (fondosResponse.ok) {
            const fondosResult = await fondosResponse.json()
            fondosData = fondosResult.data || []
            setFondos(fondosData)
          }
        } catch (error) {
          console.log('⚠️ Error cargando fondos de inversión')
        }

        // Combinar todas las inversiones
        const combinadas = [
          ...inversionesData,
          ...fondosData
        ].sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())

        setTodasLasInversiones(combinadas)
      } catch (error) {
        console.error('Error cargando todas las inversiones:', error)
      } finally {
        setLoading(false)
      }
    }

    // Solo cargar si no hay datos
    if (todasLasInversiones.length === 0) {
      loadTodasLasInversiones()
    }
  }, [user?.id])

  // Calcular estadísticas combinadas
  const totalInvertido = todasLasInversiones.reduce((sum, inv) => {
    if ('capital' in inv) {
      return sum + parseFloat(inv.capital)
    } else if ('valor_liquidativo' in inv) {
      return sum + inv.valor_liquidativo
    }
    return sum
  }, 0)

  const plazosFijosCount = todasLasInversiones.filter(inv => !esFondoInversion(inv)).length
  const fondosCount = todasLasInversiones.filter(esFondoInversion).length
  
  const stats = [
    { label: "Plazos Fijos", value: `${plazosFijosCount} activos` },
    { label: "Fondos", value: `${fondosCount} activos` },
    { label: "Total", value: `${todasLasInversiones.length} inversiones` },
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

        {/* Lista de Fondos de Inversión con botones de detalles */}
        <div className="space-y-3 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">💰 Fondos de Inversión</h4>
          {todasLasInversiones.filter(esFondoInversion).map((fondo) => (
            <div key={fondo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{fondo.nombre}</div>
                <div className="text-sm text-gray-600">{fondo.gestora_nombre}</div>
                <div className="text-sm font-semibold text-green-600">
                  ${fondo.valor_liquidativo.toLocaleString()}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Abrir modal de detalles del fondo
                  setSelectedInversion(fondo)
                }}
              >
                📋 Detalles
              </Button>
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

      {/* Modal de detalles del fondo */}
      {selectedInversion && (
        <FondoDetalleModal 
          fondo={selectedInversion} 
          onClose={() => setSelectedInversion(null)} 
        />
      )}
    </Card>
  )
}
