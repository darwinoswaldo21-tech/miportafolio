import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🚀🚀🚀 API RECIBIDA - FUNCIONANDO!!!')
  
  try {
    // Simplemente devolver éxito
    return NextResponse.json({
      success: true,
      message: 'API funciona correctamente',
      timestamp: new Date().toISOString(),
      test: true
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en API'
    })
  }
}

export async function GET() {
  console.log('🚀🚀🚀 API GET RECIBIDA - FUNCIONANDO!!!')
  
  return NextResponse.json({
    success: true,
    message: 'API GET funciona correctamente',
    timestamp: new Date().toISOString(),
    test: true
  })
}
