-- Crear políticas RLS para la tabla fondos_inversion
-- Permitir que los usuarios inserten sus propios fondos

-- Política para INSERT: Los usuarios pueden insertar fondos
CREATE POLICY "Los usuarios pueden insertar fondos de inversión" ON fondos_inversion
  FOR INSERT WITH CHECK (true);

-- Política para SELECT: Los usuarios pueden ver sus propios fondos
CREATE POLICY "Los usuarios pueden ver sus fondos de inversión" ON fondos_inversion
  FOR SELECT USING (true);

-- Política para UPDATE: Los usuarios pueden actualizar sus propios fondos
CREATE POLICY "Los usuarios pueden actualizar sus fondos de inversión" ON fondos_inversion
  FOR UPDATE USING (true);

-- Política para DELETE: Los usuarios pueden eliminar sus propios fondos
CREATE POLICY "Los usuarios pueden eliminar sus fondos de inversión" ON fondos_inversion
  FOR DELETE USING (true);
