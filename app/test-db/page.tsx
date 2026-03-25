import { supabase } from '@/lib/supabase'

export default async function TestDB() {
  let testResult = 'Conectando...'
  let entidades: any[] = []
  let fiduciarias: any[] = []
  
  try {
    // Obtener datos de tablas reales
    const { data: entidadesData, error: entidadesError } = await supabase
      .from('entidades')
      .select('*')
      .limit(10)
    
    const { data: fiduciariasData, error: fiduciariasError } = await supabase
      .from('fiduciarias')
      .select('*')
      .limit(10)
    
    if (entidadesError || fiduciariasError) {
      testResult = `❌ Error: ${entidadesError?.message || fiduciariasError?.message}`
    } else {
      testResult = '✅ Conexión exitosa - Datos cargados'
      entidades = entidadesData || []
      fiduciarias = fiduciariasData || []
    }
  } catch (err: any) {
    testResult = `❌ Error: ${err.message}`
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard Financiero</h1>
      <p className="mb-4">Estado: {testResult}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-3">🏦 Entidades ({entidades.length})</h2>
          {entidades.length > 0 ? (
            <div className="space-y-2">
              {entidades.map((entidad) => (
                <div key={entidad.id} className="p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{entidad.nombre || 'Sin nombre'}</p>
                  <p className="text-sm text-gray-600">ID: {entidad.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay datos</p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-3">💰 Fiduciarias ({fiduciarias.length})</h2>
          {fiduciarias.length > 0 ? (
            <div className="space-y-2">
              {fiduciarias.map((fiduciaria) => (
                <div key={fiduciaria.id} className="p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{fiduciaria.nombre || fiduciaria.razon_social || fiduciaria.descripcion || `Fiduciaria ${fiduciaria.id}`}</p>
                  <p className="text-sm text-gray-600">ID: {fiduciaria.id}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.keys(fiduciaria).filter(key => key !== 'id' && key !== 'nombre').map(key => (
                      <span key={key} className="mr-2">{key}: {String(fiduciaria[key])}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay datos</p>
          )}
        </div>
      </div>
    </div>
  )
}
