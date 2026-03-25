-- VER TABLAS Y REGISTROS (SIMPLE)

-- Ver todas las tablas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Cuántos registros tiene cada tabla
SELECT 
    'entidades' as tabla, COUNT(*) as registros FROM entidades
UNION ALL SELECT 'fiduciarias', COUNT(*) FROM fiduciarias  
UNION ALL SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL SELECT 'boletines_seps', COUNT(*) FROM boletines_seps
UNION ALL SELECT 'fondos_inversion', COUNT(*) FROM fondos_inversion
UNION ALL SELECT 'inversiones', COUNT(*) FROM inversiones;
