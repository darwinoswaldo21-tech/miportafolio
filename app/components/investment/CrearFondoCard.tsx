'use client'

import { InvestmentCard } from '@/app/components/ui/InvestmentCard'

interface CrearFondoCardProps {
  onCrearFondo?: () => void
}

export function CrearFondoCard({ onCrearFondo }: CrearFondoCardProps) {
  return (
    <InvestmentCard
      title="Crear Fondo de Inversión"
      description="Crea tu propio fondo de inversión personalizado"
      icon="📈"
      buttonText="Crear Fondo"
      buttonColor="purple"
      onClick={() => window.location.href = '/fondos/crear'}
      stats={[
        { label: "Interés Compuesto", value: "✓ Activo" },
        { label: "Aportes Programados", value: "✓ Activo" },
        { label: "Rentabilidad Variable", value: "✓ Activo" }
      ]}
    />
  )
}
