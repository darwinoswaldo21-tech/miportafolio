-- VER ESTRUCTURA DE BASE DE DATOS (SIMPLE Y SIN ERRORES)

-- 1. Ver todas las tablas
SELECT '=== TABLAS ENCONTRADAS ===' as info
UNION ALL
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Contar registros en cada tabla
SELECT '=== REGISTROS POR TABLA ===' as info
UNION ALL
SELECT 'entidades: ' || COUNT(*)::text FROM entidades
UNION ALL
SELECT 'fiduciarias: ' || COUNT(*)::text FROM fiduciarias
UNION ALL
SELECT 'usuarios: ' || COUNT(*)::text FROM usuarios
UNION ALL
SELECT 'inversiones: ' || COUNT(*)::text FROM inversiones
UNION ALL
SELECT 'boletines_seps: ' || COUNT(*)::text FROM boletines_seps
UNION ALL
SELECT 'fondos_inversion: ' || COUNT(*)::text FROM fondos_inversion
UNION ALL
SELECT 'ahorros_programados: ' || COUNT(*)::text FROM ahorros_programados
UNION ALL
SELECT 'pagos_inversiones: ' || COUNT(*)::text FROM pagos_inversiones;

-- 3. Estructura de entidades
SELECT '=== ESTRUCTURA ENTIDADES ===' as info
UNION ALL
SELECT column_name || ' (' || data_type || 
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE ' NULL' END ||
    CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || LEFT(column_default::text, 20) ELSE '' END || ')'
FROM information_schema.columns 
WHERE table_name = 'entidades' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Estructura de inversiones
SELECT '=== ESTRUCTURA INVERSIONES ===' as info
UNION ALL
SELECT column_name || ' (' || data_type || 
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE ' NULL' END ||
    CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || LEFT(column_default::text, 20) ELSE '' END || ')'
FROM information_schema.columns 
WHERE table_name = 'inversiones' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Datos de ejemplo
SELECT '=== DATOS DE EJEMPLO ===' as info
UNION ALL
SELECT 'Entidad 1: ' || COALESCE(LEFT(nombre, 40), 'NULL') FROM entidades LIMIT 1
UNION ALL
SELECT 'Entidad 2: ' || COALESCE(LEFT(nombre, 40), 'NULL') FROM entidades LIMIT 1 OFFSET 1
UNION ALL
SELECT 'Inversión 1: ' || COALESCE(LEFT(nombre, 40), 'NULL') FROM inversiones LIMIT 1;
