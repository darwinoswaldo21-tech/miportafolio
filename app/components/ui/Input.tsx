interface InputProps {
  type?: 'text' | 'email' | 'password' | 'date'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  className?: string
  required?: boolean
  ref?: React.Ref<HTMLInputElement>
  onKeyDown?: (e: React.KeyboardEvent) => void
  onFocus?: () => void
}

export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  label, 
  error,
  className = '',
  required = false,
  ref,
  onKeyDown,
  onFocus
}: InputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        required={required}
        ref={ref}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
