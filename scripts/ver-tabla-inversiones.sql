-- VERIFICAR TABLA INVERSIONES

-- 1. Ver si existe la tabla
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'inversiones';

-- 2. Ver estructura de la tabla inversiones
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'inversiones' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Ver si hay datos en inversiones
SELECT COUNT(*) as total_inversiones FROM inversiones;

-- 4. Ver si hay políticas RLS en inversiones
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'inversiones';

-- 5. Ver si el usuario actual puede insertar
-- (Esto mostrará los permisos actuales)
SELECT has_table_privilege('public.inversiones', 'INSERT') as puede_insertar,
       has_table_privilege('public.inversiones', 'SELECT') as puede_seleccionar,
       has_table_privilege('public.inversiones', 'UPDATE') as puede_actualizar;
