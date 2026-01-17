export interface Item {
    aud_estado: number;
    descripcion: string;
    descripcion_mini: string;
    factor_conversion1: number;
    factor_conversion2: number;
    gfactura: string;
    habilitacion1: number;
    habilitacion2: number;
    habilitacion3: number;
    id_grupo_product_fact: number;
    id_item: number;
    id_proveedor: number;
    proveedor: string;
    unidad_manejo: string;
}

export interface Tanque {
    aud_estado: number;
    aud_fecha: string;
    capacidad: number;
    descripcion: string;
    existencia_minima: number;
    factor_conversion1: number;
    id_item: number;
    id_tanques: number;
    med_fecha: string;
    medicion_agua: number;
    medicion_fecha: string;
    medicion_id: number;
    medicion_temperatura: number;
    medicion_volumen: number;
}

export interface ProductoMovimientoDTO {
    cantidad: string;
    id: string; // id_item en string
    id_tanque: string;
    monto_total: number;
    precio: string;
    producto: string;
    tanque: string;
    tipo: 1; // Always 1 for now?
}

export interface MovimientoRegistroDTO {
    bancarizacion: string;
    codigo_control: string;
    conductor: string;
    destino: string;
    fecha_factura: string;
    fecha_venta: string;
    grupoProducto: number;
    id_antena: number;
    id_autorizacion: number;
    id_banco: number;
    id_consumidor: number;
    id_estacion: string;
    id_liquidacion: number;
    id_transaccion_tipo: string;
    id_usuario: number; // hardcoded 46 per example?
    monto_total: number;
    nro_autorizacion: string;
    nro_despacho: string;
    nro_factura: string;
    nro_orden: string;
    nro_trans_banco: string;
    numero: string;
    observaciones: string;
    placa_cisterna: string;
    precintos: string;
    productos: ProductoMovimientoDTO[];
    tipo: string;
    tipo_documento: number;
    tipo_emisor: number;
    volumen_planta: string;
}

export interface MovimientoCabecera {
    id_transaccion: number;
    fecha: string;
    transaccion_tipo: string;
    prov: string; // Destination/Source/Provider name?
    monto_total: number;
    estado: string;
    origen: string;
    referencia: string; // nro_factura or similar
    usuario: string;
    // Add other fields as discovered from API
    id_estacion: number;
    nro_despacho: string;
}

export interface MovimientoDetalle {
    id_item: number;
    cantidad: number;
    precio: number;
    producto: string;
    tanque: string;
    monto_total: number;
}
