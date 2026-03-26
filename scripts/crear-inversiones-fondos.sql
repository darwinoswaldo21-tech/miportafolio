-- Tabla para inversiones en fondos con interés compuesto
CREATE TABLE IF NOT EXISTS inversiones_fondos (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  fondo_id INTEGER REFERENCES fondos_inversion(id),
  nombre_inversion VARCHAR(255) NOT NULL,
  capital_inicial DECIMAL(15,2) NOT NULL,
  aporte_mensual DECIMAL(15,2) DEFAULT 0,
  aporte_extra DECIMAL(15,2) DEFAULT 0,
  fecha_inicio DATE NOT NULL,
  rentabilidad_esperada DECIMAL(5,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'Activa',
  notas TEXT,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla para tracking de aportes y rendimiento
CREATE TABLE IF NOT EXISTS movimientos_fondos (
  id SERIAL PRIMARY KEY,
  inversion_fondo_id INTEGER REFERENCES inversiones_fondos(id),
  tipo_movimiento VARCHAR(50) NOT NULL, -- 'aporte_inicial', 'aporte_mensual', 'aporte_extra', 'rendimiento'
  monto DECIMAL(15,2) NOT NULL,
  fecha_movimiento DATE NOT NULL,
  saldo_acumulado DECIMAL(15,2) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla para proyecciones mensuales
CREATE TABLE IF NOT EXISTS proyecciones_fondos (
  id SERIAL PRIMARY KEY,
  inversion_fondo_id INTEGER REFERENCES inversiones_fondos(id),
  mes_proyeccion DATE NOT NULL,
  saldo_anterior DECIMAL(15,2) NOT NULL,
  aportes DECIMAL(15,2) DEFAULT 0,
  rendimiento DECIMAL(15,2) DEFAULT 0,
  saldo_proyectado DECIMAL(15,2) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE inversiones_fondos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_fondos ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecciones_fondos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Los usuarios pueden ver sus inversiones en fondos" ON inversiones_fondos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus inversiones en fondos" ON inversiones_fondos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus inversiones en fondos" ON inversiones_fondos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus inversiones en fondos" ON inversiones_fondos
  FOR DELETE USING (auth.uid() = user_id);
