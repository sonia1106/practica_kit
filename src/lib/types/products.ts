export interface ProductApi {
    id_item: number;
    descripcion: string;
    factor_conversion1: number;
    factor_conversion2: number;
    habilitacion1: number;
    habilitacion2: number;
    habilitacion3: number;
    unidad_manejo: string;
    descripcion_mini: string;
    id_proveedor: number;
    id_grupo_product_fact: number;
    proveedor: string;
    gfactura: string;
    aud_estado: number;
}

export interface Product {
    id_item: number;
    descripcion: string;
    descripcion_mini: string;
    unidad_manejo: string;
    proveedor: string;
    gfactura: string;
    aud_estado: number;
    factor_conversion1: number;
    factor_conversion2: number;
}

export interface ProductsResponse {
    IntCodigo: number;
    StrMensaje: string;
    oResultado: ProductApi[];
}
