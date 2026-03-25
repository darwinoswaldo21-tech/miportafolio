'use client'

import { InvestmentCard } from '@/app/components/ui/InvestmentCard'

interface FondosInversionCardProps {
  onVerFondos?: () => void
}

export function FondosInversionCard({ onVerFondos }: FondosInversionCardProps) {
  return (
    <InvestmentCard
      title="Fondos de Inversión"
      description="Ver Fondos de Inversión"
      icon="📈"
      buttonText="Abrir fondos"
      buttonColor="purple"
      onClick={onVerFondos}
      stats={[
        { label: "Renta Fija", value: "12 fondos" },
        { label: "Renta Variable", value: "8 fondos" },
        { label: "Mixtos", value: "5 fondos" }
      ]}
    />
  )
}
