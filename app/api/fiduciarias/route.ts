import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando carga de fiduciarias...')
    console.log('🔑 Variables de entorno:', {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'
    })

    // Verificar conexión con Supabase
    const { data: testData, error: testError } = await supabase
      .from('fiduciarias')
      .select('count')
      .single()

    console.log('🧪 Test de conexión:', { testData, testError })

    if (testError) {
      console.error('❌ Error de conexión con Supabase:', testError)
      return NextResponse.json(
        { 
          error: 'Error de conexión con Supabase', 
          details: testError.message 
        },
        { status: 500 }
      )
    }

    // Cargar todas las fiduciarias
    const { data, error } = await supabase
      .from('fiduciarias')
      .select('*')
      .order('nombre', { ascending: true })

    console.log('📊 Datos de fiduciarias:', { 
      count: data?.length || 0, 
      firstItem: data?.[0], 
      error 
    })

    if (error) {
      console.error('❌ Error cargando fiduciarias:', error)
      return NextResponse.json(
        { 
          error: 'Error cargando fiduciarias', 
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Fiduciarias cargadas exitosamente:', data?.length || 0)

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      message: `Se cargaron ${data?.length || 0} fiduciarias`
    })

  } catch (error) {
    console.error('❌ Error general en API de fiduciarias:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
