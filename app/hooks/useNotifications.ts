'use client'

import { useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'payment_due' | 'payment_overdue' | 'investment_maturing' | 'investment_matured' | 'info'
  title: string
  message: string
  date: string
  read: boolean
  inversionId?: number
  actionUrl?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Generar notificaciones automáticas basadas en las inversiones
  const generateNotifications = (inversiones: any[]) => {
    const newNotifications: Notification[] = []
    const today = new Date()

    inversiones.forEach(inversion => {
      const fechaVencimiento = new Date(inversion.fecha_vencimiento)
      const diasParaVencer = Math.ceil((fechaVencimiento.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      // Notificación de inversión próxima a vencer (7 días)
      if (diasParaVencer > 0 && diasParaVencer <= 7 && inversion.estado === 'Activa') {
        newNotifications.push({
          id: `maturity_${inversion.id}`,
          type: 'investment_maturing',
          title: '⏰ Inversión por vencer',
          message: `Tu inversión en ${inversion.entidad} vence en ${diasParaVencer} días`,
          date: today.toISOString(),
          read: false,
          inversionId: inversion.id,
          actionUrl: '/inversiones'
        })
      }

      // Notificación de inversión vencida
      if (diasParaVencer < 0 && inversion.estado === 'Activa') {
        newNotifications.push({
          id: `matured_${inversion.id}`,
          type: 'investment_matured',
          title: '📅 Inversión vencida',
          message: `Tu inversión en ${inversion.entidad} venció hace ${Math.abs(diasParaVencer)} días`,
          date: today.toISOString(),
          read: false,
          inversionId: inversion.id,
          actionUrl: '/inversiones'
        })
      }

      // Generar notificaciones de pagos próximos
      if (inversion.periodicidad_pago !== 'Al vencimiento') {
        const pagos = generatePaymentSchedule(inversion)
        pagos.forEach(pago => {
          const fechaPago = new Date(pago.fecha)
          const diasParaPago = Math.ceil((fechaPago.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          // Notificación de pago próximo (3 días antes)
          if (diasParaPago > 0 && diasParaPago <= 3 && pago.estado === 'futuro') {
            newNotifications.push({
              id: `payment_${inversion.id}_${pago.fecha}`,
              type: 'payment_due',
              title: '💳 Pago de intereses próximo',
              message: `Tienes un pago de $${pago.monto.toFixed(2)} en ${diasParaPago} días (${inversion.entidad})`,
              date: today.toISOString(),
              read: false,
              inversionId: inversion.id,
              actionUrl: '/inversiones'
            })
          }
          
          // Notificación de pago atrasado
          if (diasParaPago < 0 && pago.estado === 'pendiente') {
            newNotifications.push({
              id: `overdue_${inversion.id}_${pago.fecha}`,
              type: 'payment_overdue',
              title: '⚠️ Pago de intereses atrasado',
              message: `Tu pago de $${pago.monto.toFixed(2)} está atrasado (${inversion.entidad})`,
              date: today.toISOString(),
              read: false,
              inversionId: inversion.id,
              actionUrl: '/inversiones'
            })
          }
        })
      }
    })

    return newNotifications
  }

  // Generar calendario de pagos
  const generatePaymentSchedule = (inversion: any) => {
    const pagos = []
    const fechaInicio = new Date(inversion.fecha_inicio)
    const fechaActual = new Date()
    
    let frecuenciaMeses = 1
    if (inversion.periodicidad_pago === 'Trimestral') frecuenciaMeses = 3
    if (inversion.periodicidad_pago === 'Semestral') frecuenciaMeses = 6
    
    const fechaVencimiento = new Date(inversion.fecha_vencimiento)
    const mesesTotales = Math.ceil((fechaVencimiento.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const numeroPagos = Math.floor(mesesTotales / frecuenciaMeses)
    
    for (let i = 0; i < numeroPagos; i++) {
      const fechaPago = new Date(fechaInicio)
      fechaPago.setMonth(fechaPago.getMonth() + (i * frecuenciaMeses))
      
      let estado = 'futuro'
      if (fechaPago < fechaActual) {
        estado = 'pagado'
      } else if (fechaPago.getMonth() === fechaActual.getMonth() && 
                 fechaPago.getFullYear() === fechaActual.getFullYear()) {
        estado = 'pendiente'
      }
      
      const tasaDecimal = parseFloat(inversion.tasa_interes) / 100
      const tasaMensual = tasaDecimal / 12
      const montoInteres = parseFloat(inversion.capital) * tasaMensual * frecuenciaMeses
      
      pagos.push({
        fecha: fechaPago.toISOString().split('T')[0],
        monto: montoInteres,
        estado
      })
    }
    
    return pagos
  }

  // Marcar notificación como leída
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  // Eliminar notificación
  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  // Obtener notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    generateNotifications,
    markAsRead,
    removeNotification,
    unreadCount
  }
}
