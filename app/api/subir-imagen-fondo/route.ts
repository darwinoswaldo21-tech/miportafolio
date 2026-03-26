import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('� API RECIBIDA - Iniciando subida...')
  
  try {
    // Verificar método
    console.log('� Método:', request.method)
    
    // Verificar si hay body
    const body = await request.text()
    console.log('� Body recibido:', body.substring(0, 200) + '...')
    
    // Respuesta simple para probar
    return NextResponse.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error en API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
