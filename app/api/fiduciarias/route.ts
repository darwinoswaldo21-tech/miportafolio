import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Cargando fiduciarias desde Supabase...')
    
    const { data, error } = await supabase
      .from('fiduciarias')
      .select('*')
      .order('nombre', { ascending: true })

    console.log('📊 Resultado de Supabase:', { data, error })

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

    console.log('✅ Fiduciarias cargadas:', data?.length || 0)

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    })

  } catch (error) {
    console.error('❌ Error en API de fiduciarias:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
