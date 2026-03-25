-- ESTRUCTURA COMPLETA DE BASE DE DATOS
-- Copia y pega todo el resultado aquí

-- 1. Todas las tablas con sus registros
SELECT 
    'TABLAS Y REGISTROS' as seccion,
    '' as tabla,
    '' as registros
UNION ALL
SELECT 
    table_name,
    COUNT(*)::text,
    ''
FROM information_schema.tables t
LEFT JOIN (
    SELECT table_name, COUNT(*) as cnt
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    GROUP BY table_name
) c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
GROUP BY table_name, cnt
ORDER BY table_name;

-- 2. Estructura de cada tabla
SELECT 
    'ESTRUCTURA DETALLADA' as seccion,
    table_name,
    column_name || ' (' || data_type || 
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
    CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END || ')'
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;

-- 3. Datos de ejemplo de cada tabla
SELECT 
    'DATOS DE EJEMPLO' as seccion,
    'entidades' as tabla,
    'ID: ' || COALESCE(id::text, 'NULL') || ' | RUC: ' || COALESCE(ruc, 'NULL') || ' | ' || COALESCE(LEFT(nombre, 30), 'NULL')
FROM entidades LIMIT 3
UNION ALL
SELECT 
    'DATOS DE EJEMPLO',
    'fiduciarias',
    'ID: ' || COALESCE(id::text, 'NULL') || ' | RUC: ' || COALESCE(ruc, 'NULL') || ' | ' || COALESCE(LEFT(razon_social, 30), 'NULL')
FROM fiduciarias LIMIT 3
UNION ALL
SELECT 
    'DATOS DE EJEMPLO',
    'usuarios',
    'ID: ' || COALESCE(id::text, 'NULL') || ' | ' || COALESCE(nombre, 'NULL') || ' | ' || COALESCE(email, 'NULL')
FROM usuarios LIMIT 3
UNION ALL
SELECT 
    'DATOS DE EJEMPLO',
    'inversiones',
    'ID: ' || COALESCE(id::text, 'NULL') || ' | ' || COALESCE(nombre, 'NULL') || ' | $' || COALESCE(capital::text, '0')
FROM inversiones LIMIT 3
UNION ALL
SELECT 
    'DATOS DE EJEMPLO',
    'boletines_seps',
    'ID: ' || COALESCE(id::text, 'NULL') || ' | ' || COALESCE(nombre_archivo, 'NULL')
FROM boletines_seps LIMIT 3
UNION ALL
SELECT 
    'DATOS DE EJEMPLO',
    'fondos_inversion',
    'ID: ' || COALESCE(id::text, 'NULL') || ' | ' || COALESCE(nombre, 'NULL')
FROM fondos_inversion LIMIT 3;
