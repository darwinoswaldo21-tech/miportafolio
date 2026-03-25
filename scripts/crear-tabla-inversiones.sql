-- CREAR TABLA INVERSIONES CON ESTRUCTURA COMPLETA

-- Eliminar tabla si existe (para empezar fresco)
DROP TABLE IF EXISTS inversiones CASCADE;

-- Crear tabla inversiones
CREATE TABLE inversiones (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Plazo Fijo', 'Fondo de Inversión', 'Ahorro Programado')),
    entidad VARCHAR(255) NOT NULL,
    capital DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    plazo_dias INTEGER NOT NULL DEFAULT 0,
    tasa_interes DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    periodicidad_pago VARCHAR(50) DEFAULT 'Mensual',
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Activa' CHECK (estado IN ('Activa', 'Finalizada', 'Cancelada')),
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_inversiones_user_id ON inversiones(user_id);
CREATE INDEX idx_inversiones_estado ON inversiones(estado);
CREATE INDEX idx_inversiones_tipo ON inversiones(tipo);
CREATE INDEX idx_inversiones_fecha_inicio ON inversiones(fecha_inicio);

-- Habilitar Row Level Security (RLS)
ALTER TABLE inversiones ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
-- 1. Los usuarios pueden ver solo sus inversiones
CREATE POLICY "Los usuarios pueden ver sus propias inversiones"
    ON inversiones FOR SELECT
    USING (auth.uid() = user_id);

-- 2. Los usuarios pueden insertar sus propias inversiones
CREATE POLICY "Los usuarios pueden insertar sus propias inversiones"
    ON inversiones FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. Los usuarios pueden actualizar sus propias inversiones
CREATE POLICY "Los usuarios pueden actualizar sus propias inversiones"
    ON inversiones FOR UPDATE
    USING (auth.uid() = user_id);

-- 4. Los usuarios pueden eliminar sus propias inversiones
CREATE POLICY "Los usuarios pueden eliminar sus propias inversiones"
    ON inversiones FOR DELETE
    USING (auth.uid() = user_id);

-- Crear trigger para actualizar el campo actualizado_en
CREATE OR REPLACE FUNCTION update_inversiones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inversiones_updated_at
    BEFORE UPDATE ON inversiones
    FOR EACH ROW
    EXECUTE FUNCTION update_inversiones_updated_at();

-- Confirmación
SELECT 'Tabla inversiones creada exitosamente con RLS y políticas' AS resultado;
