import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  console.log('🚀 API RECIBIDA - Iniciando subida completa...')
  
  try {
    const formData = await request.formData()
    const imagen = formData.get('imagen') as File
    const fondo_id = formData.get('fondo_id') as string
    const mes = formData.get('mes') as string
    const datosExtraidos = formData.get('datos_extraidos') as string
    
    console.log('📊 Datos recibidos:')
    console.log('- imagen:', imagen?.name, imagen?.size, imagen?.type)
    console.log('- fondo_id:', fondo_id)
    console.log('- mes:', mes)
    console.log('- datos_extraidos:', datosExtraidos)
    
    if (!imagen || !fondo_id || !mes) {
      console.log('❌ Faltan datos requeridos')
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Verificar variables de entorno
    console.log('🔍 Variables de entorno:')
    console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')
    console.log('- SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌')
    
    // Crear cliente de Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // PRIMERO: Probar conexión simple
    console.log('� Probando conexión con Supabase...')
    const { data: testData, error: testError } = await supabase
      .from('fondo_imagenes')
      .select('count')
      .single()

    console.log('📊 Resultado prueba conexión:')
    console.log('- testData:', testData)
    console.log('- testError:', testError)

    if (testError) {
      console.error('❌ Error de conexión con Supabase:', testError)
      return NextResponse.json(
        { success: false, error: 'Error conectando con Supabase', details: testError.message },
        { status: 500 }
      )
    }

    // SEGUNDO: Intentar inserción simple
    console.log('💾 Intentando inserción simple...')
    const datosPrueba = {
      fondo_id: parseInt(fondo_id),
      mes: mes,
      nombre_archivo: 'prueba.jpg',
      tipo_archivo: 'jpg',
      tamaño_bytes: 1234,
      url_storage: 'prueba.jpg',
      url_publica: 'https://prueba.com',
      creado_en: new Date().toISOString()
    }
    
    console.log('- datos de prueba:', datosPrueba)
    
    const { error: insertError } = await supabase
      .from('fondo_imagenes')
      .insert(datosPrueba)

    console.log('📊 Resultado inserción:')
    console.log('- insertError:', insertError)

    if (insertError) {
      console.error('❌ Error en inserción:', insertError)
      console.error('Código:', insertError.code)
      console.error('Mensaje:', insertError.message)
      console.error('Detalles:', insertError.details)
      
      return NextResponse.json(
        { success: false, error: 'Error guardando en Supabase', details: insertError.message, code: insertError.code },
        { status: 500 }
      )
    }

    console.log('✅ Inserción exitosa')

    return NextResponse.json({
      success: true,
      message: 'PRUEBA: Inserción exitosa en Supabase',
      test: true,
      datos: datosPrueba
    })

  } catch (error) {
    console.error('❌ Error general:', error)
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
