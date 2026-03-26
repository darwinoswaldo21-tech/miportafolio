import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando nuevo fondo de inversión...')
    
    const body = await request.json()
    console.log('📊 Datos recibidos:', body)

    const { nombre, tipo, administradora, rentabilidad_anual, riesgo, estado } = body

    // Validar datos requeridos
    if (!nombre || !administradora || !rentabilidad_anual) {
      return NextResponse.json(
        { 
          error: 'Faltan datos requeridos',
          details: 'Se requiere nombre, administradora y rentabilidad_anual'
        },
        { status: 400 }
      )
    }

    // Insertar en la tabla fondos_inversion
    const { data, error } = await supabase
      .from('fondos_inversion')
      .insert([
        {
          nombre: nombre.trim(),
          tipo: tipo || 'Personalizado',
          administradora: administradora.trim(),
          rentabilidad_anual: parseFloat(rentabilidad_anual),
          riesgo: riesgo || 'Medio',
          estado: estado || 'Activa',
          creado_en: new Date().toISOString()
        }
      ])
      .select()

    console.log('📊 Resultado de la inserción:', { data, error })

    if (error) {
      console.error('❌ Error insertando fondo:', error)
      return NextResponse.json(
        { 
          error: 'Error al crear el fondo', 
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Fondo creado exitosamente:', data)

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Fondo de inversión creado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error general en API de fondos:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Cargando fondos de inversión...')
    
    const { data, error } = await supabase
      .from('fondos_inversion')
      .select('*')
      .order('creado_en', { ascending: false })

    console.log('📊 Fondos cargados:', { count: data?.length || 0, error })

    if (error) {
      console.error('❌ Error cargando fondos:', error)
      return NextResponse.json(
        { 
          error: 'Error cargando fondos', 
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
    console.error('❌ Error general en API de fondos:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
