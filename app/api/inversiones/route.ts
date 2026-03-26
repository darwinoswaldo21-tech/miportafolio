import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Cargando inversiones a plazo fijo...')
    
    // Cargar todas las inversiones a plazo fijo
    const { data, error } = await supabase
      .from('inversiones')
      .select('*')
      .order('creado_en', { ascending: false })

    console.log('📊 Inversiones cargadas:', { count: data?.length || 0, error })

    if (error) {
      console.error('❌ Error cargando inversiones:', error)
      return NextResponse.json(
        { 
          error: 'Error cargando inversiones', 
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    })

  } catch (error) {
    console.error('❌ Error general en API de inversiones:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
