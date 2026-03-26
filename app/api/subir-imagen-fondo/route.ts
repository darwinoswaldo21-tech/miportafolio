import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Subiendo imagen a Supabase Storage...')
    
    const formData = await request.formData()
    const imagen = formData.get('imagen') as File
    const fondo_id = formData.get('fondo_id') as string
    const mes = formData.get('mes') as string
    const datosExtraidos = formData.get('datos_extraidos') as string
    
    if (!imagen || !fondo_id || !mes) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Crear cliente de Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Convertir imagen a buffer
    const bytes = await imagen.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileExt = imagen.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `fondo-${fondo_id}-${mes.replace(/\s+/g, '-')}.${fileExt}`
    
    console.log('📁 Subiendo archivo:', fileName)
    console.log('📊 Tamaño:', buffer.length, 'bytes')
    
    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('fondos-imagenes')
      .upload(fileName, buffer, {
        contentType: imagen.type,
        upsert: false
      })

    if (error) {
      console.error('❌ Error subiendo a Storage:', error)
      return NextResponse.json(
        { success: false, error: 'Error subiendo imagen', details: error.message },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('fondos-imagenes')
      .getPublicUrl(fileName)

    console.log('✅ Imagen subida exitosamente')
    console.log('🔗 URL pública:', publicUrl)

    // Guardar en base de datos
    const { error: dbError } = await supabase
      .from('fondo_imagenes')
      .insert({
        fondo_id: parseInt(fondo_id),
        mes: mes,
        nombre_archivo: imagen.name,
        tipo_archivo: fileExt,
        tamaño_bytes: buffer.length,
        url_storage: data.path,
        url_publica: publicUrl,
        datos_extraidos: datosExtraidos ? JSON.parse(datosExtraidos) : null,
        confianza_ia: datosExtraidos ? 0.95 : null,
        procesado: !!datosExtraidos,
        creado_en: new Date().toISOString()
      })

    if (dbError) {
      console.error('❌ Error guardando en BD:', dbError)
      return NextResponse.json(
        { success: false, error: 'Error guardando registro', details: dbError.message },
        { status: 500 }
      )
    }

    console.log('✅ Imagen guardada exitosamente en BD y Storage')

    return NextResponse.json({
      success: true,
      mensaje: 'Imagen subida y guardada exitosamente',
      datos: {
        id: data.id,
        nombre_archivo: fileName,
        url_publica: publicUrl,
        url_storage: data.path,
        tamaño_bytes: buffer.length,
        mes: mes,
        fondo_id: parseInt(fondo_id)
      }
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

// GET: Obtener imágenes de un fondo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fondo_id = searchParams.get('fondo_id')
    
    if (!fondo_id) {
      return NextResponse.json(
        { success: false, error: 'Falta ID del fondo' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('fondo_imagenes')
      .select('*')
      .eq('fondo_id', parseInt(fondo_id))
      .order('creado_en', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo imágenes:', error)
      return NextResponse.json(
        { success: false, error: 'Error obteniendo imágenes', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
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
