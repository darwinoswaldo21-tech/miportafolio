-- Script convertido para Supabase PostgreSQL
-- Basado en: if0_40661518_portafolio.sql

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

-- Habilitar Row Level Security (RLS)
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiduciarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE plazos_fijos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ahorros_programados ENABLE ROW LEVEL SECURITY;
ALTER TABLE fondos_inversion ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletines_seps ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para entidades (lectura pública para todos)
CREATE POLICY "Entidades son visibles para todos" ON entidades
  FOR SELECT USING (true);

-- Políticas RLS para fiduciarias (lectura pública para todos)
CREATE POLICY "Fiduciarias son visibles para todos" ON fiduciarias
  FOR SELECT USING (true);

-- Políticas RLS para tablas de usuario (solo dueño puede ver/modificar)
CREATE POLICY "Usuarios solo ven sus plazos fijos" ON plazos_fijos
  FOR ALL USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Usuarios solo ven sus ahorros programados" ON ahorros_programados
  FOR ALL USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Usuarios solo ven sus fondos de inversión" ON fondos_inversion
  FOR ALL USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Usuarios solo ven sus boletines" ON boletines_seps
  FOR ALL USING (auth.uid()::text = usuario_id::text);

-- Insertar datos de entidades (convertidos de MySQL)
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
(20, '1091720902001', 'COOPERATIVA DE AHORRO Y CREDITO PILAHUIN TIO LIMITADA', 'Cooperativa', 'Segmento 1'),
(21, '1190015110001', 'COOPERATIVA DE AHORRO Y CREDITO PADRE JULIAN LORENTE LTDA', 'Cooperativa', 'Segmento 1'),
(22, '1190068389001', 'COOPERATIVA DE AHORRO Y CREDITO VICENTINA MANUEL ESTEBAN GODOY ORTEGA LIMITADA', 'Cooperativa', 'Segmento 1'),
(23, '1190075539001', 'COOPERATIVA DE AHORRO Y CREDITO DE LA PEQUEÑA EMPRESA CACPE LOJA LTDA', 'Cooperativa', 'Segmento 1'),
(24, '1390001920001', 'COOPERATIVA DE AHORRO Y CREDITO CALCETA LTDA', 'Cooperativa', 'Segmento 1'),
(25, '1390007791001', 'COOPERATIVA DE AHORRO Y CREDITO CHONE LTDA', 'Cooperativa', 'Segmento 1'),
(26, '1390013678001', 'COOPERATIVA DE AHORRO Y CREDITO 15 DE ABRIL LTDA', 'Cooperativa', 'Segmento 1'),
(27, '1390089410001', 'COOPERATIVA DE AHORRO Y CREDITO COMERCIO LTDA', 'Cooperativa', 'Segmento 1'),
(28, '1490005710001', 'COOPERATIVA DE AHORRO Y CREDITO DE LA PEQUEÑA EMPRESA GUALAQUIZA', 'Cooperativa', 'Segmento 1'),
(29, '1690012606001', 'COOPERATIVA DE AHORRO Y CREDITO DE LA PEQUEÑA EMPRESA DE PASTAZA LIMITADA', 'Cooperativa', 'Segmento 1'),
(30, '1790093204001', 'COOPERATIVA DE AHORRO Y CREDITO 23 DE JULIO LIMITADA', 'Cooperativa', 'Segmento 1'),
(31, '1790325083001', 'COOPERATIVA DE AHORRO Y CREDITO ANDALUCIA LIMITADA', 'Cooperativa', 'Segmento 1'),
(32, '1790451801001', 'COOPERATIVA DE AHORRO Y CREDITO COOPROGRESO LIMITADA', 'Cooperativa', 'Segmento 1'),
(33, '1790501469001', 'COOPERATIVA DE AHORRO Y CREDITO ALIANZA DEL VALLE LIMITADA', 'Cooperativa', 'Segmento 1'),
(34, '1790567699001', 'COOPERATIVA DE AHORRO Y CREDITO 29 DE OCTUBRE LTDA', 'Cooperativa', 'Segmento 1'),
(35, '1790866084001', 'COOPERATIVA DE AHORRO Y CREDITO POLICIA NACIONAL LIMITADA', 'Cooperativa', 'Segmento 1'),
(36, '1790979016001', 'COOPERATIVA DE AHORRO Y CREDITO DE LOS SERVIDORES PUBLICOS DEL MINISTERIO DE EDUCACION Y CULTURA', 'Cooperativa', 'Segmento 1'),
(37, '1791708040001', 'CAJA CENTRAL FINANCOOP', 'Cooperativa', 'Segmento 1'),
(38, '1890001323001', 'COOPERATIVA DE AHORRO Y CREDITO OSCUS LIMITADA', 'Cooperativa', 'Segmento 1'),
(39, '1890003628001', 'COOPERATIVA DE AHORRO Y CREDITO SAN FRANCISCO LTDA', 'Cooperativa', 'Segmento 1'),
(40, '1890037646001', 'COOPERATIVA DE AHORRO Y CREDITO EL SAGRARIO LTDA', 'Cooperativa', 'Segmento 1'),
(41, '1890141877001', 'COOPERATIVA DE AHORRO Y CREDITO MUSHUC RUNA LTDA', 'Cooperativa', 'Segmento 1'),
(42, '1890142679001', 'COOPERATIVA DE AHORRO Y CREDITO INDIGENA SAC LTDA', 'Cooperativa', 'Segmento 1'),
(43, '1891709591001', 'COOPERATIVA DE AHORRO Y CREDITO AMBATO LTDA', 'Cooperativa', 'Segmento 1'),
(44, '1891710255001', 'COOPERATIVA DE AHORRO Y CREDITO KULLKI WASI LTDA', 'Cooperativa', 'Segmento 1'),
(45, '1891710328001', 'COOPERATIVA DE AHORRO Y CREDITO CHIBULEO LIMITADA', 'Cooperativa', 'Segmento 1'),
(46, '1768168480001', 'CORPORACION NACIONAL DE FINANZAS POPULARES Y SOLIDARIAS', 'Cooperativa', 'Segmento 1'),
(47, '1790075494001', 'ASOCIACION MUTUALISTA DE AHORRO Y CREDITO PARA LA VIVIENDA PICHINCHA', 'Cooperativa', 'Segmento 1'),
(50, '1890012015001', 'ASOCIACION MUTUALISTA DE AHORRO Y CREDITO PARA LA VIVIENDA AMBATO', 'Mutualista', 'Segmento 1'),
(51, '0190006247001', 'ASOCIACION MUTUALISTA DE AHORRO Y CREDITO PARA LA VIVIENDA AZUAY LTDA', 'Mutualista', 'Segmento 1'),
(52, '1090056286001', 'ASOCIACION MUTUALISTA DE AHORRO Y CREDITO PARA LA VIVIENDA IMBABURA', 'Mutualista', 'Segmento 1'),
(53, '0190021513001', 'COOPERATIVA DE AHORRO Y CREDITO EDUCADORES DEL AZUAY LTDA', 'Cooperativa', 'Segmento 1'),
(54, '0190093581001', 'COOPERATIVA DE AHORRO Y CREDITO COOPAC AUSTRO LTDA', 'Cooperativa', 'Segmento 2'),
(55, '0190160378001', 'COOPERATIVA DE AHORRO Y CREDITO SANTA ISABEL LTDA', 'Cooperativa', 'Segmento 2'),
(56, '0190160459001', 'COOPERATIVA DE AHORRO Y CREDITO MULTIEMPRESARIAL', 'Cooperativa', 'Segmento 2');

-- Insertar datos de boletines
INSERT INTO boletines_seps (id, usuario_id, nombre_archivo, segmento, periodo, fecha_boletin, tamanio_kb, notas) VALUES
(5, 12, 'boletin_mensual_2026_01.xlsm', 'mensual', '2026-01', '2026-01-30', 3957, NULL),
(6, 12, 'boletin_trimestral_2025_T3.xlsm', 'trimestral', '2025-T3', '2025-09-29', 2717, NULL);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_entidades_updated_at BEFORE UPDATE ON entidades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fiduciarias_updated_at BEFORE UPDATE ON fiduciarias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plazos_fijos_updated_at BEFORE UPDATE ON plazos_fijos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ahorros_programados_updated_at BEFORE UPDATE ON ahorros_programados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fondos_inversion_updated_at BEFORE UPDATE ON fondos_inversion
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
