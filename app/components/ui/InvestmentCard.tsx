interface InvestmentCardProps {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  buttonColor: 'blue' | 'green' | 'purple' | 'orange' | 'gray';
  onClick?: () => void;
  stats?: { label: string; value: string }[];
}

export function InvestmentCard({ 
  title, 
  description, 
  icon, 
  buttonText, 
  buttonColor,
  onClick,
  stats = []
}: InvestmentCardProps) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
    orange: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
    gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mb-4 space-y-2">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{stat.label}:</span>
              <span className="font-medium text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onClick}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorClasses[buttonColor]}`}
      >
        {buttonText}
      </button>
    </div>
  )
}
