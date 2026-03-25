'use client'

import { useState } from 'react'
import React from 'react'
import { Button } from './Button'
import { useNotifications } from '@/app/hooks/useNotifications'

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, removeNotification } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    setIsOpen(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_due': return '💳'
      case 'payment_overdue': return '⚠️'
      case 'investment_maturing': return '⏰'
      case 'investment_matured': return '📅'
      default: return 'ℹ️'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment_overdue': return 'border-red-200 bg-red-50'
      case 'payment_due': return 'border-orange-200 bg-orange-50'
      case 'investment_maturing': return 'border-yellow-200 bg-yellow-50'
      case 'investment_matured': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        🔔 Notificaciones
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notificaciones</h3>
              <span className="text-sm text-gray-600">
                {unreadCount} no leídas
              </span>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icono */}
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-900">
                            {notification.title}
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(notification.date).toLocaleDateString('es-EC', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p>No tienes notificaciones</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.location.href = '/inversiones'}
              >
                Ver todas las inversiones
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
