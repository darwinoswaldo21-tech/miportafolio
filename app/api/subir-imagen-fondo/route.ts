import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🚀🚀🚀 API SIN SUPABASE RECIBIDA!!!')
  
  try {
    // Solo probar que llegue la solicitud
    const formData = await request.formData()
    const imagen = formData.get('imagen') as File
    const fondo_id = formData.get('fondo_id') as string
    const mes = formData.get('mes') as string
    
    console.log('📊 Datos recibidos:')
    console.log('- imagen:', imagen?.name, imagen?.size, imagen?.type)
    console.log('- fondo_id:', fondo_id)
    console.log('- mes:', mes)
    
    if (!imagen || !fondo_id || !mes) {
      console.log('❌ Faltan datos requeridos')
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }
    
    // Simular guardado exitoso sin Supabase
    console.log('✅ Simulación de guardado exitoso')
    
    return NextResponse.json({
      success: true,
      message: 'IMAGEN SUBIDA (SIMULACIÓN)',
      datos: {
        id: 999,
        nombre_archivo: imagen.name,
        url_imagen: 'https://simulacion.com/' + imagen.name,
        tamaño_bytes: imagen.size,
        mes: mes,
        fondo_id: parseInt(fondo_id)
      }
    })
    
  } catch (error) {
    console.error('❌❌❌ Error en API SIN SUPABASE:', error)
    console.error('Tipo:', error instanceof Error ? error.constructor.name : 'Desconocido')
    console.error('Mensaje:', error instanceof Error ? error.message : 'Error desconocido')
    
    return NextResponse.json({
      success: false,
      error: 'Error en API SIN SUPABASE',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
