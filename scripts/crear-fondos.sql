-- Crear tabla de fondos_inversion si no existe
CREATE TABLE IF NOT EXISTS fondos_inversion (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL, -- 'Renta Fija', 'Renta Variable', 'Mixto'
  administradora VARCHAR(255) NOT NULL,
  rentabilidad_anual DECIMAL(5,2) NOT NULL, -- Porcentaje
  riesgo VARCHAR(20) NOT NULL, -- 'Bajo', 'Medio', 'Alto'
  estado VARCHAR(20) DEFAULT 'Activa',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Insertar fondos de ejemplo
INSERT INTO fondos_inversion (nombre, tipo, administradora, rentabilidad_anual, riesgo, estado) VALUES
('Fondo Conservador Renta Fija', 'Renta Fija', 'Banco Pichincha', 6.50, 'Bajo', 'Activa'),
('Fondo Crecimiento Renta Variable', 'Renta Variable', 'Banco Guayaquil', 8.75, 'Medio', 'Activa'),
('Fondo Balanceado Mixto', 'Mixto', 'Cooperativa Juventud', 7.25, 'Medio', 'Activa'),
('Fondo Acciones Latinoamérica', 'Renta Variable', 'Internacional', 12.50, 'Alto', 'Activa'),
('Fondo Bonos Corporativos', 'Renta Fija', 'Banco del Pacífico', 5.75, 'Bajo', 'Activa'),
('Fondo Inmobiliario', 'Mixto', 'Administradora Profesional', 9.25, 'Medio', 'Activa'),
('Fondo Tecnología Global', 'Renta Variable', 'TechInvest', 15.50, 'Alto', 'Activa'),
('Fondo Emergentes', 'Renta Variable', 'GlobalAsset', 11.00, 'Alto', 'Activa'),
('Fondo Dollar', 'Renta Fija', 'DollarFund', 4.50, 'Bajo', 'Activa'),
('Fondo Index S&P 500', 'Renta Variable', 'IndexFund', 10.25, 'Medio', 'Activa'),
('Fondo Deuda Corto Plazo', 'Renta Fija', 'DeudaFund', 3.25, 'Bajo', 'Activa'),
('Fondo Sector Salud', 'Renta Variable', 'HealthFund', 8.00, 'Medio', 'Activa'),
('Fondo Materias Primas', 'Renta Variable', 'CommoditiesFund', 14.75, 'Alto', 'Activa'),
('Fondo Gubernamental', 'Renta Fija', 'GovFund', 5.50, 'Bajo', 'Activa');
