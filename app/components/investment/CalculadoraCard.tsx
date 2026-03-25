'use client'

import { InvestmentCard } from '@/app/components/ui/InvestmentCard'

interface CalculadoraCardProps {
  onAbrirCalculadora?: () => void
}

export function CalculadoraCard({ onAbrirCalculadora }: CalculadoraCardProps) {
  return (
    <InvestmentCard
      title="🧮 Calculadora"
      description="Simula Plazo Fijo, Fondos, Ahorro Programado y compara opciones antes de invertir"
      icon="🧮"
      buttonText="Abrir calculadora"
      buttonColor="gray"
      onClick={onAbrirCalculadora}
    />
  )
}
