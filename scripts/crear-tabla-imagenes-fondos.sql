-- Crear tabla para guardar imágenes de estados de cuenta de fondos
CREATE TABLE fondo_imagenes (
  id SERIAL PRIMARY KEY,
  fondo_id INTEGER REFERENCES fondos_inversion(id),
  mes VARCHAR(20), -- "Marzo 2026", "Abril 2026"
  nombre_archivo VARCHAR(255), -- "estado-cuenta-marzo.jpg"
  tipo_archivo VARCHAR(10), -- 'jpg', 'png', 'pdf'
  tamaño_bytes INTEGER, -- Tamaño del archivo en bytes
  url_storage TEXT, -- URL de Supabase Storage
  url_publica TEXT, -- URL pública para acceder
  datos_extraidos JSONB, -- Datos extraídos por la IA
  confianza_ia DECIMAL(3,2), -- Nivel de confianza de la IA (0.00 a 1.00)
  procesado BOOLEAN DEFAULT FALSE, -- Si la IA ya procesó la imagen
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_fondo_imagenes_fondo_id ON fondo_imagenes(fondo_id);
CREATE INDEX idx_fondo_imagenes_mes ON fondo_imagenes(mes);
CREATE INDEX idx_fondo_imagenes_creado_en ON fondo_imagenes(creado_en);

-- Políticas RLS para la nueva tabla
CREATE POLICY "Los usuarios pueden ver sus imágenes de fondos" ON fondo_imagenes
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden insertar imágenes de fondos" ON fondo_imagenes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Los usuarios pueden actualizar imágenes de fondos" ON fondo_imagenes
  FOR UPDATE USING (true);

CREATE POLICY "Los usuarios pueden eliminar imágenes de fondos" ON fondo_imagenes
  FOR DELETE USING (true);

-- Crear bucket en Supabase Storage (ejecutar esto en la sección Storage)
-- Nombre del bucket: "fondos-imagenes"
-- Políticas: Permitir uploads de imágenes, acceso público para lectura
