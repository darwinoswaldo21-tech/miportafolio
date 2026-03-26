import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando nuevo fondo de inversión...')
    
    const body = await request.json()
    console.log('📊 Datos recibidos:', body)

    const { nombre, administradora, plazo_dias, valor_liquidativo, rentabilidad, aporte_mensual, fecha_inicio, fecha_vencimiento, estado, notas } = body

    // Validar datos requeridos
    if (!nombre || !administradora || !valor_liquidativo || !rentabilidad) {
      return NextResponse.json(
        { 
          error: 'Faltan datos requeridos',
          details: 'Se requiere nombre, administradora, valor_liquidativo y rentabilidad'
        },
        { status: 400 }
      )
    }

    // Buscar el ID de la gestora fiduciaria
    let gestora_id = null
    let gestora_nombre = administradora
    
    try {
      const { data: fiduciariaData } = await supabase
        .from('fiduciarias')
        .select('id, razon_social')
        .eq('razon_social', administradora)
        .single()
      
      if (fiduciariaData) {
        gestora_id = fiduciariaData.id
        gestora_nombre = fiduciariaData.razon_social
      }
    } catch (error) {
      console.log('⚠️ No se encontró la fiduciaria, se usará como texto plano')
    }

    // Preparar datos exactamente como en la tabla
    const fondoData = {
      user_id: null, // Por ahora null, después se puede actualizar con auth
      nombre: nombre.trim(),
      gestora_id: gestora_id,
      gestora_nombre: gestora_nombre.trim(),
      plazo: parseInt(plazo_dias) || 360,
      valor_liquidativo: parseFloat(valor_liquidativo),
      rentabilidad: parseFloat(rentabilidad),
      aporte_mensual: parseFloat(aporte_mensual) || 0,
      fecha_inicio: fecha_inicio || new Date().toISOString().split('T')[0],
      fecha_vencimiento: fecha_vencimiento || new Date().toISOString().split('T')[0],
      estado: estado || 'Activo',
      notas: notas || '',
      creado_en: new Date().toISOString(),
      unidades: 0,
      valor_unidad_base: parseFloat(valor_liquidativo),
      fecha_base: new Date().toISOString().split('T')[0],
      es_fondo_unidades: false
    }

    console.log('📊 Datos a insertar:', fondoData)

    // Insertar en la tabla fondos_inversion
    const { data, error } = await supabase
      .from('fondos_inversion')
      .insert([fondoData])
      .select()

    console.log('📊 Resultado de la inserción:', { data, error })

    if (error) {
      console.error('❌ Error insertando fondo:', error)
      return NextResponse.json(
        { 
          error: 'Error al crear el fondo', 
          details: error.message,
          full_error: error
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
        details: error instanceof Error ? error.message : 'Error desconocido',
        full_error: error
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
