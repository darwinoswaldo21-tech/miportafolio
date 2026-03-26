import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🚀 API RECIBIDA - Iniciando subida...')
  
  try {
    // Verificar método
    console.log('📋 Método:', request.method)
    
    // Verificar si hay body
    const body = await request.text()
    console.log('📋 Body recibido:', body.substring(0, 200) + '...')
    
    // Verificar si hay contenido
    if (!body || body.length === 0) {
      console.log('❌ Body vacío')
      return NextResponse.json(
        { success: false, error: 'No se recibieron datos' },
        { status: 400 }
      )
    }
    
    // Respuesta simple para probar
    console.log('✅ Enviando respuesta de éxito')
    return NextResponse.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      bodyLength: body.length
    })
    
  } catch (error) {
    console.error('❌ Error en API:', error)
    console.error('Tipo de error:', error instanceof Error ? error.constructor.name : 'Desconocido')
    console.error('Mensaje:', error instanceof Error ? error.message : 'Error desconocido')
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    )
  }
}
