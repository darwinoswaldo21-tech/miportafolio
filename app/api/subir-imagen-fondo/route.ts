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

    // Convertir imagen a buffer
    const bytes = await imagen.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileExt = imagen.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `fondo-${fondo_id}-${mes.replace(/\s+/g, '-')}.${fileExt}`
    
    console.log('📁 Subiendo archivo:', fileName)
    console.log('📊 Tamaño:', buffer.length, 'bytes')
    
    // Subir a Supabase Storage
    console.log('📤 Subiendo a Supabase Storage...')
    const { data, error } = await supabase.storage
      .from('fondos-imagenes')
      .upload(fileName, buffer, {
        contentType: imagen.type,
        upsert: false
      })

    console.log('📊 Resultado subida Storage:')
    console.log('- data:', data)
    console.log('- error:', error)

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
    console.log('💾 Guardando en base de datos...')
    const datosBD = {
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
    }
    
    console.log('- datos a guardar:', datosBD)
    
    const { error: dbError } = await supabase
      .from('fondo_imagenes')
      .insert(datosBD)

    console.log('� Resultado guardado BD:')
    console.log('- dbError:', dbError)

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
      message: 'Imagen subida y guardada exitosamente',
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
