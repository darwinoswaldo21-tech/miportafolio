-- 07. INSERTAR DATOS ADICIONALES
-- Ejecutar AL FINAL de todas las entidades

-- Insertar boletines
INSERT INTO boletines_seps (id, user_id, nombre_archivo, segmento, periodo, fecha_boletin, tamanio_kb, notas) VALUES
(5, 12, 'boletin_mensual_2026_01.xlsm', 'mensual', '2026-01', '2026-01-30', 3957, NULL),
(6, 12, 'boletin_trimestral_2025_T3.xlsm', 'trimestral', '2025-T3', '2025-09-29', 2717, NULL);

-- Insertar usuarios
INSERT INTO usuarios (id, nombre, email, password_hash, verificado) VALUES
(12, 'Darwino', 'darwino21@me.com', '$2y$10$n2PGDHBXr4znrNSGyqUpZOvVvbZYpl6BOgd3LvGR3r8JLpZcAt5zi', true),
(14, 'Oswaldo', 'darwinoswaldo21@gmail.com', '$2y$10$28fGLDy/OX9YPniTgQ426eDOJnmqDf7fiLMwKJoK9com.nSC79QEC', true);

-- Insertar fondos_inversion
INSERT INTO fondos_inversion (id, user_id, nombre, gestora_id, gestora_nombre, plazo, valor_liquidativo, rentabilidad, aporte_mensual, fecha_inicio, fecha_vencimiento, estado, notas, creado_en, unidades, valor_unidad_base, fecha_base, es_fondo_unidades) VALUES
(3, 12, 'Fondo Acumulacion', 18, 'FIDUCIA S.A. ADMINISTRADORA DE FONDOS Y FIDEICOMISOS MERCANTILES', '12', '2000.00', '6.89', '50.00', '2025-06-11', '2026-06-11', 'Activo', 'mi primer fondo', '2026-03-03 17:13:44', '11.15712270', '238.78492741', '2026-02-28', true),
(5, 12, 'Fondo PLUS360', 46, 'PLUS FONDOS S.A.', '12', '100.00', '8.17', '100.00', '2025-10-17', '2026-10-17', 'Activo', 'PLUS FONDO 360', '2026-03-04 16:50:18', '226.92760352', '1.34906548', '2026-02-28', true);

-- Insertar inversiones
INSERT INTO inversiones (id, user_id, nombre, tipo, entidad, capital, plazo_dias, tasa_interes, periodicidad_pago, fecha_inicio, fecha_vencimiento, estado, notas, creado_en) VALUES
(16, 12, 'MUSHUC RUNA 2025', 'Plazo Fijo', 'COOPERATIVA DE AHORRO Y CREDITO MUSHUC RUNA LTDA', '20500.00', 365, '8.75', 'Mensual', '2025-02-10', '2026-02-11', 'Finalizado', 'primera inversión en cooperativa', '2026-02-09 19:02:06'),
(24, 12, 'IMBACOOP 2026', 'Plazo Fijo', 'COOPERATIVA DE AHORRO Y CREDITO IMBABURA IMBACOOP LTDA', '20500.00', 368, '12.00', 'Mensual', '2026-02-13', '2027-02-16', 'Activo', '???? Conclusión General a Enero2026\r\nImbacoop cerró enero 2026 prácticamente en equilibrio, con una utilidad simbólica. Los riesgos principales son: provisiones altas (posible deterioro de cartera), gastos operativos que consumen todo el margen financiero, y dependencia total de ingresos por intereses. Para un análisis más profundo de solvencia, liquidez y morosidad se necesitaría el balance general (activos, pasivos y patrimonio), que no está incluido en este boletín de resultados.', '2026-03-03 19:11:47');
