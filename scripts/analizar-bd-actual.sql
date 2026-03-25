-- ANALIZAR ESTRUCTURA Y DATOS ACTUALES DE TU BASE DE DATOS

-- 1. Ver todas las tablas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Ver estructura de cada tabla
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;

-- 3. Contar registros en cada tabla
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public';

-- 4. Ver datos de ejemplo de cada tabla (limitado)
SELECT 'entidades' as table_name, COUNT(*) as total_records FROM entidades
UNION ALL
SELECT 'fiduciarias', COUNT(*) FROM fiduciarias
UNION ALL  
SELECT 'boletines_seps', COUNT(*) FROM boletines_seps
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'fondos_inversion', COUNT(*) FROM fondos_inversion
UNION ALL
SELECT 'inversiones', COUNT(*) FROM inversiones
UNION ALL
SELECT 'ahorros_programados', COUNT(*) FROM ahorros_programados
UNION ALL
SELECT 'pagos_inversiones', COUNT(*) FROM pagos_inversiones;

-- 5. Ver primeras 5 filas de entidades
SELECT * FROM entidades LIMIT 5;

-- 6. Ver primeras 5 filas de fiduciarias  
SELECT * FROM fiduciarias LIMIT 5;
