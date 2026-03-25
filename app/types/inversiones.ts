export interface PlazoFijo {
  id: string;
  monto: number;
  tasa_interes: number;
  plazo_dias: number;
  fecha_inicio: string;
  fecha_vencimiento: string;
  entidad_id: string;
  usuario_id: string;
  estado: 'activa' | 'vencida' | 'cancelada';
  created_at?: string;
}

export interface AhorroProgramado {
  id: string;
  meta_nombre: string;
  meta_monto: number;
  monto_actual: number;
  aportacion_mensual: number;
  fecha_inicio: string;
  fecha_meta: string;
  entidad_id: string;
  usuario_id: string;
  estado: 'activa' | 'completada' | 'pausada';
  created_at?: string;
}

export interface FondoInversion {
  id: string;
  nombre: string;
  tipo: 'renta_fija' | 'renta_variable' | 'mixto';
  monto_inversion: number;
  rentabilidad_actual: number;
  fecha_inversion: string;
  entidad_id: string;
  usuario_id: string;
  estado: 'activa' | 'retirada';
  created_at?: string;
}

export interface BoletinSEPS {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_publicacion: string;
  archivo_url?: string;
  tipo: 'trimestral' | 'mensual';
  periodo: string;
  created_at?: string;
}
