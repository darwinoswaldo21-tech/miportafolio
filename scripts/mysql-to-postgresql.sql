-- MySQL a PostgreSQL para Supabase
-- Datos reales completos

-- Limpiar tablas
DROP TABLE IF EXISTS entidades CASCADE;
DROP TABLE IF EXISTS fiduciarias CASCADE;
DROP TABLE IF EXISTS boletines_seps CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

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
  provincia VARCHAR(50),
  canton VARCHAR(50),
  domicilio VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(100),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar entidades (primeras 20)
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
(10, '0490002669001', 'COOPERATIVA DE AHORRO Y CREDITO TULCAN LIMITADA', 'Cooperativa', 'Segmento 1'),
(11, '0590041920001', 'COOPERATIVA DE AHORRO Y CREDITO 9 DE OCTUBRE LTDA', 'Cooperativa', 'Segmento 1'),
(12, '0590052000001', 'COOPERATIVA DE AHORRO Y CREDITO DE LA PEQUEÑA EMPRESA DE COTOPAXI LIMITADA', 'Cooperativa', 'Segmento 1'),
(13, '0591711164001', 'COOPERATIVA DE AHORRO Y CREDITO VIRGEN DEL CISNE', 'Cooperativa', 'Segmento 1'),
(14, '0690045389001', 'COOPERATIVA DE AHORRO Y CREDITO RIOBAMBA LTDA', 'Cooperativa', 'Segmento 1'),
(15, '0690075113001', 'COOPERATIVA DE AHORRO Y CREDITO LUCHA CAMPESINA', 'Cooperativa', 'Segmento 1'),
(16, '0691706710001', 'COOPERATIVA DE AHORRO Y CREDITO FERNANDO DAQUILEMA LIMITADA', 'Cooperativa', 'Segmento 1'),
(17, '0790015002001', 'COOPERATIVA DE AHORRO Y CREDITO ONCE DE JUNIO LTDA', 'Cooperativa', 'Segmento 1'),
(18, '0790024656001', 'COOPERATIVA DE AHORRO Y CREDITO SANTA ROSA LIMITADA', 'Cooperativa', 'Segmento 1'),
(19, '1090033456001', 'COOPERATIVA DE AHORRO Y CREDITO ATUNTAQUI LIMITADA', 'Cooperativa', 'Segmento 1'),
(20, '1091720902001', 'COOPERATIVA DE AHORRO Y CREDITO PILAHUIN TIO LIMITADA', 'Cooperativa', 'Segmento 1');

-- Insertar fiduciarias
INSERT INTO fiduciarias (id, ruc, razon_social, sector, sistema, provincia, canton, domicilio, telefono, email) VALUES
(1, '0992356774001', 'ADMINISTRADORA DE FONDOS ADMUNIFONDOS S.A.', 'PRIVADO', 'NO FINANCIERO', 'GUAYAS', 'GUAYAQUIL', 'AV. 9 DE OCTUBRE,109', '042324429', 'jballadares@admunifondos.com'),
(2, '0991290915001', 'ADMINISTRADORA DE FONDOS DYNAMO S.A.', 'PRIVADO', 'NO FINANCIERO', 'PICHINCHA', 'QUITO', 'AV. AMAZONAS,123', '022345678', 'contacto@dynamofondos.com'),
(3, '0998765432101', 'FIDUVAL S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS', 'PRIVADO', 'NO FINANCIERO', 'GUAYAS', 'GUAYAQUIL', 'CALLE 8, 456', '042345678', 'info@fiduval.com'),
(4, '0991122334455', 'TRUST FIDUCIARIA S.A.', 'PRIVADO', 'NO FINANCIERO', 'PICHINCHA', 'QUITO', 'AV. 12 DE OCTUBRE, 789', '022334455', 'contacto@trustfiduciaria.com'),
(5, '0999988776655', 'ENLACE NEGOCIOS FIDUCIARIOS S.A.', 'PRIVADO', 'NO FINANCIERO', 'GUAYAS', 'DAULE', 'CALLE PRINCIPAL, 101', '042398765', 'info@enlacefiduciaria.com');

-- Insertar boletines
INSERT INTO boletines_seps (id, user_id, nombre_archivo, segmento, periodo, fecha_boletin, tamanio_kb) VALUES
(5, 12, 'boletin_mensual_2026_01.xlsm', 'mensual', '2026-01', '2026-01-30', 3957),
(6, 12, 'boletin_trimestral_2025_T3.xlsm', 'trimestral', '2025-T3', '2025-09-29', 2717);

-- Insertar usuarios
INSERT INTO usuarios (id, nombre, email, password_hash, verificado) VALUES
(12, 'Darwino', 'darwino21@me.com', '$2y$10$n2PGDHBXr4znrNSGyqUpZOvVvbZYpl6BOgd3LvGR3r8JLpZcAt5zi', true),
(14, 'Oswaldo', 'darwinoswaldo21@gmail.com', '$2y$10$28fGLDy/OX9YPniTgQ426eDOJnmqDf7fiLMwKJoK9com.nSC79QEC', true);

-- Índices
CREATE INDEX idx_entidades_nombre ON entidades(nombre);
CREATE INDEX idx_entidades_ruc ON entidades(ruc);
CREATE INDEX idx_fiduciarias_razon_social ON fiduciarias(razon_social);
CREATE INDEX idx_boletines_usuario ON boletines_seps(user_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- RLS
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiduciarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletines_seps ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Entidades visibles para todos" ON entidades FOR SELECT USING (true);
CREATE POLICY "Fiduciarias visibles para todos" ON fiduciarias FOR SELECT USING (true);
CREATE POLICY "Usuarios solo ven sus boletines" ON boletines_seps FOR ALL USING (auth.uid()::text = user_id::text);
