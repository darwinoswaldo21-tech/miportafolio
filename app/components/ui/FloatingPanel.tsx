'use client'

import { useState } from 'react'
import { Button } from './Button'

interface FloatingPanelProps {
  onClose?: () => void
}

export function FloatingPanel({ onClose }: FloatingPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState('medium')
  const [fontFamily, setFontFamily] = useState('inter')
  const [primaryColor, setPrimaryColor] = useState('green')

  const themes = [
    { value: 'light', label: 'Claro', icon: '☀️' },
    { value: 'dark', label: 'Oscuro', icon: '🌙' },
    { value: 'auto', label: 'Automático', icon: '🎨' }
  ]

  const fontSizes = [
    { value: 'small', label: 'Pequeño', preview: 'Aa' },
    { value: 'medium', label: 'Mediano', preview: 'Aa' },
    { value: 'large', label: 'Grande', preview: 'Aa' }
  ]

  const fontFamilies = [
    { value: 'inter', label: 'Inter', style: 'font-sans' },
    { value: 'roboto', label: 'Roboto', style: 'font-sans' },
    { value: 'mono', label: 'Monospace', style: 'font-mono' }
  ]

  const colors = [
    { value: 'green', label: 'Verde', class: 'bg-green-500' },
    { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
    { value: 'purple', label: 'Morado', class: 'bg-purple-500' },
    { value: 'red', label: 'Rojo', class: 'bg-red-500' }
  ]

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.classList.remove('light', 'dark')
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.add('light')
    }
    localStorage.setItem('theme', newTheme)
  }

  const applyFontSize = (size: string) => {
    setFontSize(size)
    const root = document.documentElement
    root.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px'
    localStorage.setItem('fontSize', size)
  }

  const applyFontFamily = (font: string) => {
    setFontFamily(font)
    document.body.style.fontFamily = font === 'mono' ? 'monospace' : font === 'roboto' ? 'Roboto, sans-serif' : 'Inter, sans-serif'
    localStorage.setItem('fontFamily', font)
  }

  const applyColor = (color: string) => {
    setPrimaryColor(color)
    // Aquí podrías actualizar variables CSS o clases
    localStorage.setItem('primaryColor', color)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
        >
          ⚙️
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">⚙️ Personalización</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {/* Theme */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🎨 Tema
          </label>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <Button
                key={t.value}
                variant={theme === t.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => applyTheme(t.value)}
                className="flex flex-col items-center p-2"
              >
                <span className="text-lg">{t.icon}</span>
                <span className="text-xs">{t.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔤 Tamaño de Letra
          </label>
          <div className="grid grid-cols-3 gap-2">
            {fontSizes.map((size) => (
              <Button
                key={size.value}
                variant={fontSize === size.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => applyFontSize(size.value)}
                className="flex flex-col items-center p-2"
              >
                <span className={size.value === 'small' ? 'text-xs' : size.value === 'large' ? 'text-lg' : 'text-sm'}>
                  {size.preview}
                </span>
                <span className="text-xs">{size.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📝 Tipo de Letra
          </label>
          <div className="space-y-2">
            {fontFamilies.map((font) => (
              <Button
                key={font.value}
                variant={fontFamily === font.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => applyFontFamily(font.value)}
                className="w-full justify-start"
              >
                {font.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🎨 Color Principal
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => applyColor(color.value)}
                className={`w-12 h-12 rounded-lg ${color.class} ${
                  primaryColor === color.value ? 'ring-2 ring-offset-2 ring-gray-800' : ''
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              applyTheme('dark')
              applyFontSize('medium')
              applyFontFamily('inter')
              applyColor('green')
            }}
            className="w-full"
          >
            🔄 Restablecer Valores
          </Button>
        </div>
      </div>
    </div>
  )
}
