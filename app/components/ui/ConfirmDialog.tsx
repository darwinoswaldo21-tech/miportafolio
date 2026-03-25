'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Card, CardContent, CardHeader } from './Card'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️'
      case 'warning':
        return '⏰'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <CardHeader className={`border-b ${getTypeStyles()}`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getIcon()}</span>
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <p className="text-gray-700 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button 
              variant={type === 'danger' ? 'primary' : 'outline'}
              onClick={onConfirm}
              className={type === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
