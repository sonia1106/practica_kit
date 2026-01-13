export interface ClienteForm {
  id_clientes: number;
  nit: number;
  razon_social: string;
  direccion: string;
  telefono: string;
  grupo: string;
  contacto?: string;
}
export interface Cliente {
  id_clientes: number;
  nit: number;
  razon_social: string;
  direccion: string;
  telefono: string;
  grupo: string;
  contacto?: string;
  id_grupo_clientes: number;
}

