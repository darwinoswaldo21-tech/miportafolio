-- Crear tabla de inversiones
CREATE TABLE IF NOT EXISTS inversiones (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  entidad VARCHAR(255) NOT NULL,
  capital DECIMAL(15,2) NOT NULL,
  plazo_dias INTEGER NOT NULL,
  tasa_interes DECIMAL(5,2) NOT NULL,
  periodicidad_pago VARCHAR(50) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'Activa',
  notas TEXT,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de entidades
CREATE TABLE IF NOT EXISTS entidades (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(100),
  direccion TEXT,
  telefono VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'Activa',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de fiduciarias
CREATE TABLE IF NOT EXISTS fiduciarias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  razon_social VARCHAR(255),
  ruc VARCHAR(20),
  direccion TEXT,
  telefono VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'Activa',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de fondos_inversion
CREATE TABLE IF NOT EXISTS fondos_inversion (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(100),
  administradora VARCHAR(255),
  rentabilidad_anual DECIMAL(5,2),
  riesgo VARCHAR(20),
  estado VARCHAR(20) DEFAULT 'Activa',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de ahorros_programados
CREATE TABLE IF NOT EXISTS ahorros_programados (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  nombre VARCHAR(255) NOT NULL,
  meta_monto DECIMAL(15,2) NOT NULL,
  monto_mensual DECIMAL(15,2) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_meta DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'Activo',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de boletines_seps
CREATE TABLE IF NOT EXISTS boletines_seps (
  id SERIAL PRIMARY KEY,
  nombre_archivo VARCHAR(255) NOT NULL,
  tipo VARCHAR(50),
  fecha_publicacion DATE,
  url_archivo TEXT,
  estado VARCHAR(20) DEFAULT 'Activo',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE inversiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ahorros_programados ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Los usuarios pueden ver sus propias inversiones" ON inversiones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias inversiones" ON inversiones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias inversiones" ON inversiones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias inversiones" ON inversiones
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden ver sus propios ahorros" ON ahorros_programados
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios ahorros" ON ahorros_programados
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios ahorros" ON ahorros_programados
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios ahorros" ON ahorros_programados
  FOR DELETE USING (auth.uid() = user_id);
