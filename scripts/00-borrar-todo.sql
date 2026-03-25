-- 00. BORRAR TODAS LAS TABLAS EXISTENTES
-- Ejecutar PRIMERO para limpiar completamente la base de datos

-- Borrar todas las tablas en orden inverso para evitar conflictos de claves foráneas
DROP TABLE IF EXISTS pagos_inversiones CASCADE;
DROP TABLE IF EXISTS inversiones CASCADE;
DROP TABLE IF EXISTS fondos_inversion CASCADE;
DROP TABLE IF EXISTS ahorros_programados CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS boletines_seps CASCADE;
DROP TABLE IF EXISTS fiduciarias CASCADE;
DROP TABLE IF EXISTS entidades CASCADE;

-- Confirmar que todo fue borrado
SELECT 'Todas las tablas han sido borradas correctamente. Base de datos limpia.' AS mensaje;
