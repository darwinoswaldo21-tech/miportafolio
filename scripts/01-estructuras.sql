-- 01. CREAR ESTRUCTURAS DE TABLAS
-- Ejecutar PRIMERO

-- Limpiar tablas existentes
DROP TABLE IF EXISTS entidades CASCADE;
DROP TABLE IF EXISTS fiduciarias CASCADE;
DROP TABLE IF EXISTS boletines_seps CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS ahorros_programados CASCADE;
DROP TABLE IF EXISTS fondos_inversion CASCADE;
DROP TABLE IF EXISTS inversiones CASCADE;
DROP TABLE IF EXISTS pagos_inversiones CASCADE;

-- Tabla entidades
CREATE TABLE entidades (
  id SERIAL PRIMARY KEY,
  ruc VARCHAR(13) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  segmento VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla fiduciarias  
CREATE TABLE fiduciarias (
  id SERIAL PRIMARY KEY,
  ruc VARCHAR(20) NOT NULL,
  razon_social VARCHAR(255) NOT NULL,
  sector VARCHAR(50),
  sistema VARCHAR(50),
  nro_inscripcion VARCHAR(50),
  fecha_inscripcion DATE,
  representante_legal VARCHAR(100),
  cargo VARCHAR(50),
  provincia VARCHAR(50),
  canton VARCHAR(50),
  parroquia VARCHAR(50),
  domicilio VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(100),
  sitio_web VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla boletines_seps
CREATE TABLE boletines_seps (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  segmento VARCHAR(20) NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  fecha_boletin DATE,
  fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tamanio_kb INTEGER,
  notas VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  verificado BOOLEAN DEFAULT false,
  token VARCHAR(255),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  token_expira TIMESTAMP WITH TIME ZONE
);

-- Tabla ahorros_programados
CREATE TABLE ahorros_programados (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  nombre_meta VARCHAR(255) NOT NULL,
  monto_objetivo DECIMAL(15,2) NOT NULL,
  monto_inicial DECIMAL(15,2) NOT NULL DEFAULT 0,
  monto_mensual DECIMAL(15,2) NOT NULL,
  plazo_meses INTEGER NOT NULL,
  tiempo_permanencia INTEGER NOT NULL,
  institucion_id INTEGER NOT NULL,
  institucion_nombre VARCHAR(255),
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  tasa_interes DECIMAL(5,2) DEFAULT 0.00,
  retiros_permitidos VARCHAR(2) DEFAULT 'no',
  email_notificacion VARCHAR(255) NOT NULL,
  notas TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla fondos_inversion
CREATE TABLE fondos_inversion (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  gestora_id INTEGER NOT NULL,
  gestora_nombre VARCHAR(255) NOT NULL,
  plazo VARCHAR(100) NOT NULL,
  valor_liquidativo DECIMAL(12,2) NOT NULL,
  rentabilidad DECIMAL(5,2) NOT NULL,
  aporte_mensual DECIMAL(12,2) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE,
  estado VARCHAR(50) NOT NULL DEFAULT 'Activo',
  notas TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unidades DECIMAL(14,8),
  valor_unidad_base DECIMAL(14,8),
  fecha_base DATE,
  es_fondo_unidades BOOLEAN DEFAULT false
);

-- Tabla inversiones
CREATE TABLE inversiones (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  entidad VARCHAR(100) NOT NULL,
  capital DECIMAL(12,2) NOT NULL,
  plazo_dias INTEGER,
  tasa_interes DECIMAL(5,2) NOT NULL,
  periodicidad_pago VARCHAR(50) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'Activa',
  notas TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla pagos_inversiones
CREATE TABLE pagos_inversiones (
  id SERIAL PRIMARY KEY,
  inversion_id INTEGER NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  pagado BOOLEAN DEFAULT false,
  fecha_pago DATE
);

-- Índices para rendimiento
CREATE INDEX idx_entidades_nombre ON entidades(nombre);
CREATE INDEX idx_entidades_ruc ON entidades(ruc);
CREATE INDEX idx_fiduciarias_razon_social ON fiduciarias(razon_social);
CREATE INDEX idx_boletines_usuario ON boletines_seps(user_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_inversiones_usuario ON inversiones(user_id);
CREATE INDEX idx_fondos_usuario ON fondos_inversion(user_id);

-- RLS
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiduciarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletines_seps ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE inversiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE fondos_inversion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Entidades visibles para todos" ON entidades FOR SELECT USING (true);
CREATE POLICY "Fiduciarias visibles para todos" ON fiduciarias FOR SELECT USING (true);
CREATE POLICY "Usuarios solo ven sus datos" ON usuarios FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "Usuarios solo ven sus boletines" ON boletines_seps FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Usuarios solo ven sus inversiones" ON inversiones FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Usuarios solo ven sus fondos" ON fondos_inversion FOR ALL USING (auth.uid()::text = user_id::text);
