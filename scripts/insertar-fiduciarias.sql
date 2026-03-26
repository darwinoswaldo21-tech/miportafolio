-- Insertar fiduciarias de ejemplo si no existen
INSERT INTO fiduciarias (id, nombre, razon_social, descripcion) VALUES
('1', 'Banco Pichincha CA', 'Banco Pichincha Casa de Valores S.A.', 'Administradora de fondos de inversión'),
('2', 'Banco Guayaquil CA', 'Banco Guayaquil Casa de Valores S.A.', 'Administradora de fondos de inversión'),
('3', 'Cooperativa de Ahorro y Crédito Juventud Ecuatoriana', 'Cooperativa de Ahorro y Crédito Juventud Ecuatoriana Limitada', 'Servicios financieros y administración de fondos'),
('4', 'Banco del Pacífico CA', 'Banco del Pacífico Casa de Valores S.A.', 'Administradora de fondos de inversión'),
('5', 'Banco Internacional CA', 'Banco Internacional Casa de Valores S.A.', 'Administradora de fondos de inversión'),
('6', 'Produbanco CA', 'Produbanco Casa de Valores S.A.', 'Administradora de fondos de inversión'),
('7', 'IESS', 'Instituto Ecuatoriano de Seguridad Social', 'Administradora de fondos de pensiones y cesantía'),
('8', 'Banco Amazonas CA', 'Banco Amazonas Casa de Valores S.A.', 'Administradora de fondos de inversión'),
('9', 'Banco Bolivariano CA', 'Banco Bolivariano Casa de Valores S.A.', 'Administradora de fondos de inversión'),
('10', 'Distribuidora de Títulos Valores DITVAL S.A.', 'DITVAL S.A.', 'Distribuidora y administradora de valores'),
('11', 'Alianza Valores S.A.', 'Alianza Valores Casa de Bolsa S.A.', 'Administradora de fondos de inversión'),
('12', 'Fidelity Worldwide Investment', 'Fidelity Investments', 'Administradora internacional de fondos'),
('13', 'BlackRock', 'BlackRock Chile Administradora General de Fondos', 'Administradora internacional de fondos'),
('14', 'Schroders', 'Schroders Investment Management', 'Administradora internacional de fondos')
ON CONFLICT (id) DO NOTHING;
