export interface ApiResponse<T> {
    IntCodigo: number;
    StrMensaje: string;
    oResultado: T;
}

export interface Manguera {
    id_manguera: number;
    descripcion: string;
    id_lado: number;
    id_tanque: number;
    aud_estado: number;
    aud_usuario: string;
    aud_fecha: string;
    nro_logico_manguera: number;
    orden: number;
}

export interface MedicionResponse {
    param1: number;
    param2: number;
    param3: number;
    param4: number;
    param7: number; // Valor del Metter
    param8: number;
    param9: number;
    param0: string;
    param11: number;
    param12: number;
}

export interface PrecioResponse {
    param1: number;
    param2: number;
    param3: number;
    param4: number;
    param7: number; // Precio Nacional
    param8: number; // Precio Internacional
    param9: number;
    param0: string;
    param11: number;
    param12: number;
}

export interface DatosClienteResponse {
    param1: number;
    param2: number;
    param3: number;
    param4: number;
    param5: string; // Nombre Cliente
    param7: number;
    param8: number;
    param9: number; // NIT
    param0: string;
    param11: number;
    param12: number;
}

export interface TipoPago {
    id: number;
    descripcion: string; // EFECTIVO, CHEQUE, etc.
    descripcion_corta: string; // EFE, CHE, etc.
    descripcion_larga: string;
    codigosin: number;
}

export interface Parametrica {
    id: number;
    descripcion: string;
    auxInt1: number;
}

export interface Condicion {
    id: number;
    descripcion: string;
    auxInt1: number;
}

// Representa un registro en el reporte de libro de ventas
export interface TransaccionVenta {
    id_transaccion: number;
    nit: number;
    nombre_factura: string;
    pais: string;
    placa: string;
    nro_factura: number;
    nro_autorizacion: string;
    fecha_venta: string;
    monto_total: number;
    monto_descuento: number;
    monto_ice: number;
    monto_exento: number;
    sujeto: number;
    debito: number;
    estado: string;
    codigo_control: string;
    envase: string;
    producto: string;
    autorizacion: string;
    cantidad: number;
    precio: number;
    tipo_credito_fiscal: number;
    tipo_factura: number;
    desc_tfactura: string;
    id_padre: number;
    id_tipo_pago: number;
    producto1: string;
    id_precio_lista: number;
    manguera: string;
    id_tipo_autorizacion: number;
    id_item: number;
    nombre_factura_original: string;
    id_cliente: number;
    id_tipo_consumidor: number;
    bloqueo: number;
    // Helper property for display
    tv?: string;
    cliente?: string;
    est?: string;
    lv?: string;
}

export interface FacturaManualPayload {
    fecha_venta: string;
    id_tipo_pago: number;
    id_precio_lista: number; // 1: Nacional, 2: Internacional (Inferred)
    id_tipo_consumidor: number;
    id_manguera: number;
    nit: number;
    nombre_factura: string;
    id_item: number;
    precio: number;
    nro_factura: number;
    id_pais: number;
    id_padre: string | number; // Docs say empty string, but could be number
    id_usuario: number; // Usually 1
    nro_autorizacionInt: string | number;
    nro_facturaInt: number;
    monto_total: number;
    id_mediciones: number;
    autoriza: number; // 0
    tipoAnulacion: number; // 5
    tipovale: number; // 2
    id_estacion: number; // 8
    tipo_int: number; // 2
    placa: string;
    nro_vale?: number; // Optional?
    nro_autorizacion: string;
    tipo_autorizacion?: number;
    dependiente: number; // 0
    id_clDependiente: number; // 0
    id_transaccion: number; // 0
}
