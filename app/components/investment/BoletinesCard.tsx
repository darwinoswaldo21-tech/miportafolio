'use client'

import { InvestmentCard } from '@/app/components/ui/InvestmentCard'

interface BoletinesCardProps {
  onGestionarBoletines?: () => void
}

export function BoletinesCard({ onGestionarBoletines }: BoletinesCardProps) {
  return (
    <InvestmentCard
      title="📊 Boletines SEPS"
      description="Sube los boletines financieros de la SEPS para consultar datos reales de cooperativas"
      icon="📊"
      buttonText="Gestionar boletines"
      buttonColor="blue"
      onClick={onGestionarBoletines}
    />
  )
}
