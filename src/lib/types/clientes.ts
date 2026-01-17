export interface Cliente {
  id_clientes: number;
  nit: number;
  razon_social: string;
  direccion: string;
  telefono: string;
  grupo: string;
  contacto?: string;
}

export interface ClienteForm {
  id_clientes?: number;
  nit: number | string;
  razon_social: string;
  direccion: string;
  telefono: string;
  grupo?: string;
  contacto?: string;
}

export interface ClienteApi {
  aud_estado: number;
  aud_fecha: string;
  contacto: string;
  direccion: string;
  DocumentId: number;
  grupo: string;
  id_clientes: number;
  id_grupo_clientes: number;
  nit: number;
  NitValido: boolean;
  razon_social: string;
  telefono: string;
}
export interface ClienteOperacionDTO {
  id_clientes: number;
  razon_social: string;
  nit: number;
  direccion: string;
  telefono: string;
  contacto?: string;
  id_grupo_clientes: number;
  tipo: 1 | 2;
}

