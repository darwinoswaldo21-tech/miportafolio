import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🚀 API DEPURACIÓN COMPLETA RECIBIDA!!!')
  
  try {
    // PASO 1: Verificar variables de entorno
    console.log('🔍 PASO 1: Verificando variables de entorno...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('- SUPABASE_URL:', supabaseUrl ? '✅ EXISTE' : '❌ NO EXISTE')
    console.log('- SUPABASE_ANON_KEY:', supabaseKey ? '✅ EXISTE' : '❌ NO EXISTE')
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Variables de entorno faltantes')
      return NextResponse.json({
        success: false,
        error: 'Variables de entorno no configuradas',
        details: {
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey
        }
      })
    }
    
    // PASO 2: Recibir datos
    console.log('🔍 PASO 2: Recibiendo datos...')
    const formData = await request.formData()
    const imagen = formData.get('imagen') as File
    const fondo_id = formData.get('fondo_id') as string
    const mes = formData.get('mes') as string
    
    console.log('- imagen:', imagen?.name, imagen?.size, imagen?.type)
    console.log('- fondo_id:', fondo_id)
    console.log('- mes:', mes)
    
    if (!imagen || !fondo_id || !mes) {
      console.log('❌ Datos requeridos faltantes')
      return NextResponse.json({
        success: false,
        error: 'Datos requeridos faltantes'
      })
    }
    
    // PASO 3: Intentar importar Supabase
    console.log('🔍 PASO 3: Intentando importar Supabase...')
    try {
      const { createClient } = await import('@supabase/supabase-js')
      console.log('✅ Supabase importado correctamente')
      
      // PASO 4: Crear cliente
      console.log('🔍 PASO 4: Creando cliente de Supabase...')
      const supabase = createClient(supabaseUrl, supabaseKey)
      console.log('✅ Cliente de Supabase creado')
      
      // PASO 5: Probar conexión simple
      console.log('🔍 PASO 5: Probando conexión...')
      const { data: testData, error: testError } = await supabase
        .from('fondo_imagenes')
        .select('count')
        .single()
      
      if (testError) {
        console.error('❌ Error de conexión:', testError)
        return NextResponse.json({
          success: false,
          error: 'Error de conexión con Supabase',
          details: testError.message
        })
      }
      
      console.log('✅ Conexión exitosa, count:', testData)
      
      // PASO 6: Insertar datos de prueba
      console.log('🔍 PASO 6: Insertando datos de prueba...')
      const datosPrueba = {
        fondo_id: parseInt(fondo_id),
        mes: mes,
        nombre_archivo: imagen.name,
        tipo_archivo: imagen.name.split('.').pop()?.toLowerCase() || 'jpg',
        tamaño_bytes: imagen.size,
        url_imagen: `https://prueba.com/${imagen.name}`,
        creado_en: new Date().toISOString()
      }
      
      console.log('- datos a insertar:', datosPrueba)
      
      const { data: insertData, error: insertError } = await supabase
        .from('fondo_imagenes')
        .insert(datosPrueba)
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Error de inserción:', insertError)
        console.error('Código:', insertError.code)
        console.error('Mensaje:', insertError.message)
        console.error('Detalles:', insertError.details)
        
        return NextResponse.json({
          success: false,
          error: 'Error insertando en Supabase',
          details: insertError.message,
          code: insertError.code
        })
      }
      
      console.log('✅ Inserción exitosa:', insertData)
      
      return NextResponse.json({
        success: true,
        message: 'IMAGEN GUARDADA EN SUPABASE',
        datos: insertData,
        debug: {
          variables: '✅',
          importacion: '✅',
          conexion: '✅',
          insercion: '✅'
        }
      })
      
    } catch (importError) {
      console.error('❌ Error importando Supabase:', importError)
      return NextResponse.json({
        success: false,
        error: 'Error importando Supabase',
        details: importError instanceof Error ? importError.message : 'Error desconocido'
      })
    }
    
  } catch (error) {
    console.error('❌ Error general en API:', error)
    console.error('Tipo:', error instanceof Error ? error.constructor.name : 'Desconocido')
    console.error('Mensaje:', error instanceof Error ? error.message : 'Error desconocido')
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
