-- VER TODA LA BASE DE DATOS COMPLETA EN UNA SOLA CONSULTA

-- Mostrar todo en un formato simple
SELECT 'TABLAS:' as tipo, table_name as nombre, '' as detalle
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name

UNION ALL

SELECT 'REGISTROS:', 'entidades', COUNT(*)::text
FROM entidades

UNION ALL

SELECT 'REGISTROS:', 'fiduciarias', COUNT(*)::text
FROM fiduciarias

UNION ALL

SELECT 'REGISTROS:', 'usuarios', COUNT(*)::text
FROM usuarios

UNION ALL

SELECT 'REGISTROS:', 'inversiones', COUNT(*)::text
FROM inversiones

UNION ALL

SELECT 'REGISTROS:', 'boletines_seps', COUNT(*)::text
FROM boletines_seps

UNION ALL

SELECT 'REGISTROS:', 'fondos_inversion', COUNT(*)::text
FROM fondos_inversion

UNION ALL

SELECT 'COLUMNAS ENTIDADES:', column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'entidades' AND table_schema = 'public'
ORDER BY ordinal_position

UNION ALL

SELECT 'COLUMNAS INVERSIONES:', column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'inversiones' AND table_schema = 'public'
ORDER BY ordinal_position

UNION ALL

SELECT 'EJEMPLO ENTIDAD:', LEFT(nombre, 40), ruc
FROM entidades 
LIMIT 3

UNION ALL

SELECT 'EJEMPLO INVERSION:', LEFT(nombre, 40), capital::text
FROM inversiones 
LIMIT 3

ORDER BY tipo, nombre;
