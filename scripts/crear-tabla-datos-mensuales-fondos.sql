-- Crear tabla para datos mensuales reales de fondos
CREATE TABLE fondo_datos_mensuales (
  id SERIAL PRIMARY KEY,
  fondo_id INTEGER REFERENCES fondos_inversion(id),
  mes VARCHAR(20), -- "Febrero 2026", "Marzo 2026"
  unidades_participacion DECIMAL(15,8), -- 226.92760352
  valor_unidad DECIMAL(10,8), -- 1.34906548
  valor_total_mes DECIMAL(12,2), -- 306.22
  tasa_efectiva_mes DECIMAL(5,2), -- Tasa real del mes
  aporte_mensual DECIMAL(10,2), -- Aporte realizado ese mes
  notas TEXT, -- Notas adicionales
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_fondo_datos_mensuales_fondo_id ON fondo_datos_mensuales(fondo_id);
CREATE INDEX idx_fondo_datos_mensuales_mes ON fondo_datos_mensuales(mes);

-- Políticas RLS para la nueva tabla
CREATE POLICY "Los usuarios pueden ver sus datos mensuales de fondos" ON fondo_datos_mensuales
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden insertar datos mensuales de fondos" ON fondo_datos_mensuales
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Los usuarios pueden actualizar datos mensuales de fondos" ON fondo_datos_mensuales
  FOR UPDATE USING (true);

CREATE POLICY "Los usuarios pueden eliminar datos mensuales de fondos" ON fondo_datos_mensuales
  FOR DELETE USING (true);
