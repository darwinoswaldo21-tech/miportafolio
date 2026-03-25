interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  className?: string
  error?: string
  rows?: number
}

export function Textarea({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = "",
  error,
  rows = 4
}: TextareaProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
          error ? 'border-red-500' : ''
        }`}
        required={required}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
