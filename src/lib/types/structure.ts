export interface ApiResponse<T> {
    IntCodigo: number;
    StrMensaje?: string;
    oResultado: T[];
}

export interface Empresa {
    id: number;
    descripcion: string;
    auxInt1: number;
    razon_social?: string;
    propietario?: string;
    direccion?: string;
    telefono?: string;
}

export interface Estacion {
    id_estaciones?: number; // Optional because it might not be present in list view (id vs id_estaciones)
    id?: number; // In list view it is just 'id'
    descripcion?: string; // In list view
    llave_mdw?: string;
    razon_social?: string;
    representante_legal?: string;
    nit?: string;
    direccion?: string;
    telefono?: string;
    conectividad?: string;
    tipoconectividad?: string;
    latitud?: string | number;
    longitud?: string | number;
    id_empresas?: number;
    id_ubicacion?: number;
    aud_estado?: number;
    aud_fecha?: string;
    tipo?: number; // For payload
}

export interface Playa {
    id_playas?: number;
    id?: number;
    descripcion: string;
    id_estacion?: number;
    aud_estado?: number;
    aud_fecha?: string;
    tipo?: number;
    auxInt1?: number;
}

export interface Isla {
    id_islas?: number;
    id?: number;
    descripcion: string;
    id_playa?: number;
    id_antena?: number;
    aud_estado?: number;
    aud_fecha?: string;
    tipo?: number;
    auxInt1?: number;
}

export interface Dispenser {
    id_dispenser?: number;
    id?: number;
    descripcion: string;
    id_isla?: number;
    id_equipo?: number;
    aud_estado?: number;
    aud_fecha?: string;
    habilitacion_cg?: number;
    cambio_precio?: number;
    es_virtual?: number;
    es_autorizacion?: number;
    marca?: string;
    protocolo?: string;
    tipo?: number;
    auxInt1?: number;
}

export interface Lado {
    id_lado_dispenser?: number;
    id?: number;
    descripcion: string;
    id_dispenser?: number;
    punto_abastecimiento_logico?: number;
    aud_estado?: number;
    aud_fecha?: string;
    tipo?: number;
    auxInt1?: number;
}

export interface Manguera {
    id_manguera?: number;
    id?: number;
    descripcion: string;
    id_lado?: number;
    id_tanque?: number;
    nro_logico_manguera?: number;
    orden?: number;
    aud_estado?: number;
    aud_fecha?: string;
    tipo?: number;
    auxInt1?: number;
}

export interface Antena {
    id: number;
    descripcion: string;
    auxInt1: number;
}

export interface Ciudad {
    id: number;
    descripcion: string;
    auxInt1: number;
}

export interface Terminal {
    id: number;
    descripcion: string;
    auxInt1: number;
}

export interface Tanque {
    id: number;
    descripcion: string;
}

export interface Equipo {
    id: number;
    descripcion: string;
}

export interface Ubicacion {
    id: number;
    descripcion: string;
}

