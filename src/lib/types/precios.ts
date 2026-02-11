export interface PrecioApi {
    producto: string;
    precio_lista: string;
    precio_venta: number;
    fecha_actualizacion: string;
    precio_costo: number;
    ice: number;
    icep: number;
    fecha_activacion: string;
    id_precio_lista: number;
    id_precio: number;
    id_item: number;
}

export interface Precio {
    producto: string;
    tipo: string; // Nacional o Internacional
    precio: number;
    fechaActualizacion: string;
    id_precio: number;
    id_item: number;
}

export interface PreciosResponse {
    IntCodigo: number;
    StrMensaje: string;
    oResultado: PrecioApi[];
}
