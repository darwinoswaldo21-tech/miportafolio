-- VER BASE DE DATOS - MUY SIMPLE
-- Ejecutar cada consulta por separado

-- 1. Tablas que tienes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Cuántos registros tiene entidades
SELECT COUNT(*) as entidades_registros FROM entidades;

-- 3. Cuántos fiduciarias tienes
SELECT COUNT(*) as fiduciarias_registros FROM fiduciarias;

-- 4. Cuántos usuarios tienes
SELECT COUNT(*) as usuarios_registros FROM usuarios;

-- 5. Ver primeras 3 entidades
SELECT id, ruc, LEFT(nombre, 30) as nombre_corto, tipo, segmento 
FROM entidades 
LIMIT 3;

-- 6. Ver primeras 3 fiduciarias
SELECT id, ruc, LEFT(razon_social, 25) as nombre_corto, sector 
FROM fiduciarias 
LIMIT 3;

-- 7. Ver usuarios (sin passwords)
SELECT id, nombre, email, verificado 
FROM usuarios 
LIMIT 3;
