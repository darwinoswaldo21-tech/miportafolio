-- EXPORTAR BASE DE DATOS SIMPLE Y SIN ERRORES
-- Ejecutar este script y copiar el resultado

-- 1. Ver todas las tablas
SELECT '=== TABLAS ENCONTRADAS ===' as seccion
UNION ALL
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Contar registros en cada tabla
SELECT '=== CONTEO DE REGISTROS ===' as seccion
UNION ALL
SELECT 'entidades: ' || COUNT(*)::text FROM entidades
UNION ALL
SELECT 'fiduciarias: ' || COUNT(*)::text FROM fiduciarias
UNION ALL
SELECT 'usuarios: ' || COUNT(*)::text FROM usuarios
UNION ALL
SELECT 'boletines_seps: ' || COUNT(*)::text FROM boletines_seps
UNION ALL
SELECT 'fondos_inversion: ' || COUNT(*)::text FROM fondos_inversion
UNION ALL
SELECT 'inversiones: ' || COUNT(*)::text FROM inversiones
UNION ALL
SELECT 'ahorros_programados: ' || COUNT(*)::text FROM ahorros_programados
UNION ALL
SELECT 'pagos_inversiones: ' || COUNT(*)::text FROM pagos_inversiones;

-- 3. Ver estructura de entidades
SELECT '=== ESTRUCTURA TABLA ENTIDADES ===' as seccion
UNION ALL
SELECT 'Columna: ' || column_name || ' | Tipo: ' || data_type
FROM information_schema.columns 
WHERE table_name = 'entidades' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Ver primeras 5 entidades
SELECT '=== PRIMERAS 5 ENTIDADES ===' as seccion
UNION ALL
SELECT 'ID: ' || COALESCE(id::text, 'NULL') || ' | RUC: ' || COALESCE(ruc, 'NULL') || ' | Nombre: ' || COALESCE(LEFT(nombre, 50), 'NULL')
FROM entidades 
LIMIT 5;

-- 5. Ver estructura de fiduciarias
SELECT '=== ESTRUCTURA TABLA FIDUCIARIAS ===' as seccion
UNION ALL
SELECT 'Columna: ' || column_name || ' | Tipo: ' || data_type
FROM information_schema.columns 
WHERE table_name = 'fiduciarias' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Ver primeras 5 fiduciarias
SELECT '=== PRIMERAS 5 FIDUCIARIAS ===' as seccion
UNION ALL
SELECT 'ID: ' || COALESCE(id::text, 'NULL') || ' | RUC: ' || COALESCE(ruc, 'NULL') || ' | Nombre: ' || COALESCE(LEFT(razon_social, 40), 'NULL')
FROM fiduciarias 
LIMIT 5;
