import type { Item, Tanque, MovimientoRegistroDTO, MovimientoCabecera, MovimientoDetalle } from '$lib/types/inventario';
import { items, tanques, movimientos, movimientoSeleccionadoDetalle } from '$lib/stores/inventario';

const MOCK_ITEMS: Item[] = [
    { id_item: 1, descripcion: "Gasolina Especial", descripcion_mini: "Esp", aud_estado: 1, factor_conversion1: 1, factor_conversion2: 1, gfactura: "1", habilitacion1: 1, habilitacion2: 1, habilitacion3: 1, id_grupo_product_fact: 1, id_proveedor: 1, proveedor: "YPFB", unidad_manejo: "L" },
    { id_item: 2, descripcion: "Diesel Oil", descripcion_mini: "Diesel", aud_estado: 1, factor_conversion1: 1, factor_conversion2: 1, gfactura: "1", habilitacion1: 1, habilitacion2: 1, habilitacion3: 1, id_grupo_product_fact: 1, id_proveedor: 1, proveedor: "YPFB", unidad_manejo: "L" },
    { id_item: 3, descripcion: "Gasolina Premium", descripcion_mini: "Prem", aud_estado: 1, factor_conversion1: 1, factor_conversion2: 1, gfactura: "1", habilitacion1: 1, habilitacion2: 1, habilitacion3: 1, id_grupo_product_fact: 1, id_proveedor: 1, proveedor: "YPFB", unidad_manejo: "L" }
];

const MOCK_TANQUES: Tanque[] = [
    { id_tanques: 1, descripcion: "Tanque 1 (Gasolina)", capacidad: 10000, existencia_minima: 1000, id_item: 1, aud_estado: 1, aud_fecha: "", factor_conversion1: 1, med_fecha: "", medicion_agua: 0, medicion_fecha: "", medicion_id: 0, medicion_temperatura: 20, medicion_volumen: 5000 },
    { id_tanques: 2, descripcion: "Tanque 2 (Diesel)", capacidad: 20000, existencia_minima: 2000, id_item: 2, aud_estado: 1, aud_fecha: "", factor_conversion1: 1, med_fecha: "", medicion_agua: 0, medicion_fecha: "", medicion_id: 0, medicion_temperatura: 20, medicion_volumen: 12000 },
    { id_tanques: 3, descripcion: "Tanque 3 (Premium)", capacidad: 8000, existencia_minima: 800, id_item: 3, aud_estado: 1, aud_fecha: "", factor_conversion1: 1, med_fecha: "", medicion_agua: 0, medicion_fecha: "", medicion_id: 0, medicion_temperatura: 20, medicion_volumen: 4000 }
];

const STORAGE_KEY = 'inventario_json_db';

interface StoredData {
    movimientos: MovimientoRegistroDTO[];
}

function getStoredData(): StoredData {
    if (typeof localStorage === 'undefined') return { movimientos: [] };
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { movimientos: [] };
}

function saveStoredData(data: StoredData) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('Datos guardados en "JSON" local:', data);
    }
}

export async function obtenerItems() {
    await new Promise(resolve => setTimeout(resolve, 300));
    items.set(MOCK_ITEMS);
}

export async function obtenerTanques(idEstacion: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    tanques.set(MOCK_TANQUES);
}

export async function registrarMovimiento(payload: MovimientoRegistroDTO): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = getStoredData();
    data.movimientos.push(payload);
    saveStoredData(data);
}

export async function obtenerMovimientosCabecera(ffini: string, ffin: string, idEstacion: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Buscando movimientos desde ${ffini} hasta ${ffin} para estacion ${idEstacion}`);

    const data = getStoredData();
    console.log("Datos 'raw' recuperados:", data.movimientos.length);

    const cabeceras: MovimientoCabecera[] = data.movimientos.map((m, index) => {
        return {
            id_transaccion: index + 1,
            fecha: m.fecha_venta,
            transaccion_tipo: m.tipo === '1' ? 'INGRESO' : 'SALIDA',
            prov: m.destino,
            monto_total: m.monto_total,
            estado: 'OK',
            origen: 'LUCIFER',
            referencia: m.nro_factura || m.nro_despacho || '',
            usuario: 'Usuario Test',
            id_estacion: parseInt(m.id_estacion),
            nro_despacho: m.nro_despacho
        };
    }).filter(m => {
        const fechaMov = m.fecha;
        const fechaMovSimple = fechaMov ? fechaMov.split('T')[0] : '';

        const isInRange = fechaMovSimple >= ffini && fechaMovSimple <= ffin;

        console.log(`Debug Movimiento #${m.id_transaccion}: FechaMov=${fechaMov} (Simple=${fechaMovSimple}) vs Range=[${ffini}, ${ffin}] -> Incluir? ${isInRange}`);

        return isInRange;
    }).sort((a, b) => b.id_transaccion - a.id_transaccion);

    console.log('Movimientos encontrados tras filtro:', cabeceras.length);
    movimientos.set([...cabeceras]);
}

export async function obtenerMovimientoDetalle(idTransaccion: number) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const data = getStoredData();

    const rawMov = data.movimientos[idTransaccion - 1];

    if (!rawMov) {
        movimientoSeleccionadoDetalle.set([]);
        return [];
    }

    const detalles: MovimientoDetalle[] = rawMov.productos.map(p => ({
        id_item: parseInt(p.id),
        cantidad: parseFloat(p.cantidad),
        precio: parseFloat(p.precio),
        producto: p.producto,
        tanque: p.tanque,
        monto_total: p.monto_total
    }));

    movimientoSeleccionadoDetalle.set(detalles);
    return detalles;
}
