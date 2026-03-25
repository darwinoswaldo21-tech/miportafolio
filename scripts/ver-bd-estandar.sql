-- VER ESTRUCTURA - SQL ESTÁNDAR SIMPLE

-- 1. Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Ver cuántos registros tiene entidades
SELECT COUNT(*) as total_entidades FROM entidades;

-- 3. Ver cuántos fiduciarias tienes
SELECT COUNT(*) as total_fiduciarias FROM fiduciarias;

-- 4. Ver cuántos usuarios tienes
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- 5. Ver cuántas inversiones tienes
SELECT COUNT(*) as total_inversiones FROM inversiones;

-- 6. Ver estructura de entidades
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'entidades' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. Ver estructura de inversiones
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'inversiones' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Ver 3 entidades de ejemplo
SELECT id, ruc, LEFT(nombre, 30) as nombre, tipo, segmento 
FROM entidades 
LIMIT 3;

-- 9. Ver 3 inversiones de ejemplo
SELECT id, nombre, tipo, entidad, capital, estado
FROM inversiones 
LIMIT 3;
