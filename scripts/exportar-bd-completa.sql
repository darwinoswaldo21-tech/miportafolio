-- EXPORTAR COMPLETA BASE DE DATOS POSTGRESQL
-- Ejecutar este script y copiar TODO el resultado

-- 1. Mostrar estructura de tablas
SELECT 
    '=== ESTRUCTURA DE TABLAS ===' as info,
    '' as table_name,
    '' as column_info
UNION ALL
SELECT 
    'TABLA: ' || table_name,
    'COLUMNAS: ' || string_agg(column_name || ' (' || data_type || ')', ', '),
    ''
FROM information_schema.columns 
WHERE table_schema = 'public' 
GROUP BY table_name
ORDER BY table_name;

-- 2. Mostrar todos los datos de entidades (limitado para no sobrecargar)
SELECT 
    '=== DATOS ENTIDADES (primeros 20) ===' as info,
    '' as table_name,
    '' as column_info
UNION ALL
SELECT 
    'ID: ' || id::text || ' | RUC: ' || ruc || ' | ' || LEFT(nombre, 50) || '...',
    '',
    ''
FROM entidades 
LIMIT 20;

-- 3. Mostrar todos los datos de fiduciarias
SELECT 
    '=== DATOS FIDUCIARIAS (completo) ===' as info,
    '' as table_name,
    '' as column_info
UNION ALL
SELECT 
    'ID: ' || id::text || ' | RUC: ' || ruc || ' | ' || LEFT(razon_social, 40) || '...',
    '',
    ''
FROM fiduciarias;

-- 4. Contar registros en todas las tablas
SELECT 
    '=== CONTEO DE REGISTROS ===' as info,
    table_name,
    registros::text
FROM (
    SELECT 'entidades' as table_name, COUNT(*) as registros FROM entidades
    UNION ALL
    SELECT 'fiduciarias', COUNT(*) FROM fiduciarias
    UNION ALL
    SELECT 'usuarios', COUNT(*) FROM usuarios
    UNION ALL
    SELECT 'boletines_seps', COUNT(*) FROM boletines_seps
    UNION ALL
    SELECT 'fondos_inversion', COUNT(*) FROM fondos_inversion
    UNION ALL
    SELECT 'inversiones', COUNT(*) FROM inversiones
    UNION ALL
    SELECT 'ahorros_programados', COUNT(*) FROM ahorros_programados
    UNION ALL
    SELECT 'pagos_inversiones', COUNT(*) FROM pagos_inversiones
) as counts;

-- 5. Mostrar usuarios (sin passwords)
SELECT 
    '=== USUARIOS ===' as info,
    '' as table_name,
    '' as column_info
UNION ALL
SELECT 
    'ID: ' || id::text || ' | Nombre: ' || nombre || ' | Email: ' || email,
    '',
    ''
FROM usuarios;

-- 6. Generar INSERT statements para entidades (primeros 50)
SELECT 
    '=== INSERTS PARA ENTIDADES (primeros 50) ===' as info,
    '' as table_name,
    '' as column_info
UNION ALL
SELECT 
    'INSERT INTO entidades (id, ruc, nombre, tipo, segmento) VALUES (' || 
    id::text || ', ''' || ruc || ''', ''' || REPLACE(nombre, '''', '''''') || ''', ''' || tipo || ''', ''' || COALESCE(segmento, '') || ''');',
    '',
    ''
FROM entidades 
ORDER BY id
LIMIT 50;

-- 7. Generar INSERT statements para fiduciarias (completo)
SELECT 
    '=== INSERTS PARA FIDUCIARIAS (completo) ===' as info,
    '' as table_name,
    '' as column_info
UNION ALL
SELECT 
    'INSERT INTO fiduciarias (id, ruc, razon_social, sector, sistema) VALUES (' || 
    id::text || ', ''' || ruc || ''', ''' || REPLACE(razon_social, '''', '''''') || ''', ''' || COALESCE(sector, '') || ''', ''' || COALESCE(sistema, '') || ''');',
    '',
    ''
FROM fiduciarias 
ORDER BY id;
