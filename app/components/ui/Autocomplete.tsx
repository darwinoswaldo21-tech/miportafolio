'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from './Input'

interface AutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  onSearch: (query: string) => Promise<Array<{ id: string; nombre: string }>>
  onSelect?: (item: { id: string; nombre: string }) => void
  required?: boolean
}

export function Autocomplete({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  onSearch, 
  onSelect,
  required = false 
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<Array<{ id: string; nombre: string }>>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchOptions = async () => {
      if (value.trim().length < 2) {
        setOptions([])
        setIsOpen(false)
        return
      }

      setLoading(true)
      try {
        const results = await onSearch(value.trim())
        setOptions(results)
        setIsOpen(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error searching:', error)
        setOptions([])
        setIsOpen(false)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchOptions, 300)
    return () => clearTimeout(timeoutId)
  }, [value, onSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          const selectedOption = options[selectedIndex]
          onChange(selectedOption.nombre)
          onSelect?.(selectedOption)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  const handleSelect = (option: { id: string; nombre: string }) => {
    onChange(option.nombre)
    onSelect?.(option)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-bold text-blue-600">{part}</span>
      ) : (
        <span key={index}>{part}</span>
      )
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        ref={inputRef}
        type="text"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (options.length > 0) setIsOpen(true)
        }}
      />
      
      {loading && (
        <div className="absolute right-3 top-8">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isOpen && options.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-blue-50 text-blue-900' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelect(option)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {highlightMatch(option.nombre, value.trim())}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ID: {option.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
