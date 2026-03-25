export interface Database {
  public: {
    Tables: {
      entidades: {
        Row: {
          id: string;
          nombre: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      fiduciarias: {
        Row: {
          id: string;
          nombre?: string;
          razon_social?: string;
          descripcion?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          nombre?: string;
          razon_social?: string;
          descripcion?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          razon_social?: string;
          descripcion?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
