export interface Entidad {
  id: string;
  nombre: string;
  created_at?: string;
  updated_at?: string;
}

export interface Fiduciaria {
  id: string;
  nombre?: string;
  razon_social?: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  entidades?: number;
  total: number;
}
