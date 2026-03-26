import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('fiduciarias')
      .select('*')
      .eq('estado', 'Activa')
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error cargando fiduciarias:', error)
      return NextResponse.json(
        { error: 'Error cargando fiduciarias' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Error en API de fiduciarias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
