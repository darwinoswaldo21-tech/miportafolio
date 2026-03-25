-- Script corregido para Supabase PostgreSQL
-- Sin backticks, usando comillas dobles estándar

-- Limpiar tablas existentes
DROP TABLE IF EXISTS ahorros_programados CASCADE;
DROP TABLE IF EXISTS boletines_seps CASCADE;
DROP TABLE IF EXISTS entidades CASCADE;
DROP TABLE IF EXISTS fiduciarias CASCADE;
DROP TABLE IF EXISTS fondos_inversion CASCADE;
DROP TABLE IF EXISTS plazos_fijos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Crear tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla entidades
CREATE TABLE entidades (
  id SERIAL PRIMARY KEY,
  ruc VARCHAR(13) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  segmento VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla fiduciarias
CREATE TABLE fiduciarias (
  id SERIAL PRIMARY KEY,
  ruc VARCHAR(13),
  nombre VARCHAR(255),
  razon_social VARCHAR(255),
  descripcion TEXT,
  tipo VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla plazos_fijos
CREATE TABLE plazos_fijos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  monto DECIMAL(15,2) NOT NULL,
  tasa_interes DECIMAL(5,2) NOT NULL,
  plazo_dias INTEGER NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  entidad_id INTEGER REFERENCES entidades(id),
  estado VARCHAR(20) DEFAULT 'activa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla ahorros_programados
CREATE TABLE ahorros_programados (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre_meta VARCHAR(255) NOT NULL,
  monto_objetivo DECIMAL(15,2) NOT NULL,
  monto_inicial DECIMAL(15,2) DEFAULT 0,
  monto_mensual DECIMAL(15,2) NOT NULL,
  plazo_meses INTEGER NOT NULL,
  institucion_id INTEGER REFERENCES entidades(id),
  institucion_nombre VARCHAR(255),
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  tasa_interes DECIMAL(5,2) DEFAULT 0.00,
  retiros_permitidos VARCHAR(2) DEFAULT 'no',
  email_notificacion VARCHAR(255),
  notas TEXT,
  estado VARCHAR(20) DEFAULT 'activa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla fondos_inversion
CREATE TABLE fondos_inversion (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  monto_inversion DECIMAL(15,2) NOT NULL,
  rentabilidad_actual DECIMAL(8,4) DEFAULT 0,
  fecha_inversion DATE NOT NULL,
  entidad_id INTEGER REFERENCES entidades(id),
  estado VARCHAR(20) DEFAULT 'activa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla boletines_seps
CREATE TABLE boletines_seps (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre_archivo VARCHAR(255) NOT NULL,
  segmento VARCHAR(20) NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  fecha_boletin DATE,
  fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tamanio_kb INTEGER,
  notas VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_entidades_nombre ON entidades(nombre);
CREATE INDEX idx_entidades_ruc ON entidades(ruc);
CREATE INDEX idx_plazos_fijos_usuario ON plazos_fijos(usuario_id);
CREATE INDEX idx_ahorros_programados_usuario ON ahorros_programados(usuario_id);
CREATE INDEX idx_fondos_inversion_usuario ON fondos_inversion(usuario_id);
CREATE INDEX idx_boletines_seps_usuario ON boletines_seps(usuario_id);

-- Insertar datos de entidades (solo primeros 10 para prueba)
INSERT INTO entidades (id, ruc, nombre, tipo, segmento) VALUES
(1, '0190021769001', 'COOPERATIVA DE AHORRO Y CREDITO LA MERCED LIMITADA', 'Cooperativa', 'Segmento 1'),
(2, '0190024733001', 'COOPERATIVA DE AHORRO Y CREDITO ERCO LIMITADA', 'Cooperativa', 'Segmento 1'),
(3, '0190087603001', 'COOPERATIVA DE AHORRO Y CREDITO ALFONSO JARAMILLO LEON CAJA', 'Cooperativa', 'Segmento 1'),
(4, '0190115798001', 'COOPERATIVA DE AHORRO Y CREDITO JUVENTUD ECUATORIANA PROGRESISTA LIMITADA', 'Cooperativa', 'Segmento 1'),
(5, '0190155722001', 'COOPERATIVA DE AHORRO Y CREDITO JARDIN AZUAYO LIMITADA', 'Cooperativa', 'Segmento 1'),
(6, '0190158977001', 'COOPERATIVA DE AHORRO Y CREDITO CREA LIMITADA', 'Cooperativa', 'Segmento 1'),
(7, '0290003288001', 'COOPERATIVA DE AHORRO Y CREDITO SAN JOSE LIMITADA', 'Cooperativa', 'Segmento 1'),
(8, '0390027923001', 'COOPERATIVA DE AHORRO Y CREDITO DE LA PEQUEÑA EMPRESA BIBLIAN LIMITADA', 'Cooperativa', 'Segmento 1'),
(9, '0490001883001', 'COOPERATIVA DE AHORRO Y CREDITO PABLO MUÑOZ VEGA LIMITADA', 'Cooperativa', 'Segmento 1'),
(10, '0490002669001', 'COOPERATIVA DE AHORRO Y CREDITO TULCAN LIMITADA', 'Cooperativa', 'Segmento 1');
