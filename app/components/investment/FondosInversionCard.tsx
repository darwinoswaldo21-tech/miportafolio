'use client'

import { InvestmentCard } from '@/app/components/ui/InvestmentCard'

interface FondosInversionCardProps {
  onVerFondos?: () => void
}

export function FondosInversionCard({ onVerFondos }: FondosInversionCardProps) {
  return (
    <InvestmentCard
      title="Fondos de Inversión"
      description="Invierte con interés compuesto y aportes programados"
      icon="📈"
      buttonText="Ver Fondos"
      buttonColor="purple"
      onClick={() => window.location.href = '/fondos'}
      stats={[
        { label: "Renta Fija", value: "12 fondos" },
        { label: "Renta Variable", value: "8 fondos" },
        { label: "Mixtos", value: "5 fondos" }
      ]}
    />
  )
}
