'use client'

import { useState } from 'react'
import { InvestmentCard } from '@/app/components/ui/InvestmentCard'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'

interface AnalisisIACardProps {
  onAnalizarCooperativa?: (data: any) => void
}

export function AnalisisIACard({ onAnalizarCooperativa }: AnalisisIACardProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('Enero 2026')
  const [selectedCooperative, setSelectedCooperative] = useState('')

  const periods = [
    { label: 'Enero 2026', type: 'mensual', date: '2026-01-30' },
    { label: 'Diciembre 2025', type: 'mensual', date: '2025-12-30' },
    { label: '2025 T3', type: 'trimestral', date: '2025-09-29' },
    { label: '2025 T2', type: 'trimestral', date: '2025-06-30' }
  ]

  const cooperatives = [
    'Cooperativa ABC',
    'Cooperativa XYZ',
    'Cooperativa Financiera 123',
    'Cooperativa de Ahorro y Crédito'
  ]

  if (showForm) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h3 className="text-lg font-bold">🤖 Análisis de Cooperativa con IA</h3>
          <button 
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Paso 1 — Selecciona el período a analizar
              </label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {periods.map((period) => (
                  <option key={period.label} value={period.label}>
                    {period.label}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-sm text-gray-600">
                {periods.find(p => p.label === selectedPeriod)?.type === 'mensual' 
                  ? '📅 Mensual Seg.1-3' 
                  : '📆 Trimestral Seg.4-5'}
                <br />
                Corte: {periods.find(p => p.label === selectedPeriod)?.date}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 Paso 2 — Selecciona la cooperativa
              </label>
              <select 
                value={selectedCooperative}
                onChange={(e) => setSelectedCooperative(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar cooperativa...</option>
                {cooperatives.map((coop) => (
                  <option key={coop} value={coop}>
                    {coop}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  onAnalizarCooperativa?.({ period: selectedPeriod, cooperative: selectedCooperative })
                  setShowForm(false)
                }}
                className="flex-1"
                disabled={!selectedCooperative}
              >
                Analizar con IA
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <InvestmentCard
      title="🤖"
      description="Análisis de Cooperativa con IA"
      icon="🤖"
      buttonText="Seleccionar período y buscar cooperativa a analizar"
      buttonColor="purple"
      onClick={() => setShowForm(true)}
    />
  )
}
