'use client'

import { useState } from 'react'
import { InvestmentCard } from '@/app/components/ui/InvestmentCard'
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card'

interface AhorroProgramadoCardProps {
  onCreateAhorro?: (data: any) => void
}

export function AhorroProgramadoCard({ onCreateAhorro }: AhorroProgramadoCardProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    meta_nombre: '',
    meta_monto: '',
    aportacion_mensual: '',
    fecha_meta: '',
    entidad_id: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateAhorro?.(formData)
    setShowForm(false)
    setFormData({ meta_nombre: '', meta_monto: '', aportacion_mensual: '', fecha_meta: '', entidad_id: '' })
  }

  if (showForm) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h3 className="text-lg font-bold">Crear Ahorro Programado</h3>
          <button 
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de la meta"
              type="text"
              placeholder="Fondo de emergencia"
              value={formData.meta_nombre}
              onChange={(value) => setFormData({...formData, meta_nombre: value})}
              required
            />
            <Input
              label="Meta de ahorro"
              type="text"
              placeholder="5000.00"
              value={formData.meta_monto}
              onChange={(value) => setFormData({...formData, meta_monto: value})}
              required
            />
            <Input
              label="Aportación mensual"
              type="text"
              placeholder="200.00"
              value={formData.aportacion_mensual}
              onChange={(value) => setFormData({...formData, aportacion_mensual: value})}
              required
            />
            <Input
              label="Fecha meta"
              type="text"
              placeholder="2024-12-31"
              value={formData.fecha_meta}
              onChange={(value) => setFormData({...formData, fecha_meta: value})}
              required
            />
            <Input
              label="Entidad"
              type="text"
              placeholder="Seleccionar entidad"
              value={formData.entidad_id}
              onChange={(value) => setFormData({...formData, entidad_id: value})}
              required
            />
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">Crear</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <InvestmentCard
      title="Ahorro Programado"
      description="Crear una meta de ahorro programado"
      icon="🎯"
      buttonText="Crear ahorro"
      buttonColor="green"
      onClick={() => setShowForm(true)}
    />
  )
}
