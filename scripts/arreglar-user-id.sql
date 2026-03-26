-- Solución 1: Poner un valor por defecto a user_id
ALTER TABLE fondos_inversion ALTER COLUMN user_id SET DEFAULT 1;

-- Opción 2: Permitir nulos temporariamente
ALTER TABLE fondos_inversion ALTER COLUMN user_id DROP NOT NULL;
