import type { Item, Tanque, MovimientoRegistroDTO, MovimientoCabecera, MovimientoDetalle } from '$lib/types/inventario';
import { items, tanques, movimientos, movimientoSeleccionadoDetalle, detallesLocales } from '$lib/stores/inventario';

// --- MOCK DATA ---
const MOCK_ITEMS: Item[] = [
    {
        id_item: 11,
        descripcion: 'DIESEL ULS',
        descripcion_mini: 'DOULS',
        unidad_manejo: 'LIT',
        proveedor: 'YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS',
        gfactura: 'COMBUSTIBLE',
        aud_estado: 2,
        factor_conversion1: 1,
        factor_conversion2: 0,
        habilitacion1: 622919,
        habilitacion2: 1,
        habilitacion3: 0,
        id_grupo_product_fact: 1,
        id_proveedor: 1
    },
    {
        id_item: 1,
        descripcion: 'GNV',
        descripcion_mini: 'GNV',
        unidad_manejo: 'LIT',
        proveedor: 'YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS',
        gfactura: 'COMBUSTIBLE',
        aud_estado: 1,
        factor_conversion1: 1,
        factor_conversion2: 0,
        habilitacion1: 622919,
        habilitacion2: 1,
        habilitacion3: 0,
        id_grupo_product_fact: 1,
        id_proveedor: 1
    },
    {
        id_item: 7,
        descripcion: 'G.ESPECIAL+',
        descripcion_mini: 'G+',
        unidad_manejo: 'LIT',
        proveedor: 'YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS',
        gfactura: 'COMBUSTIBLE',
        aud_estado: 2,
        factor_conversion1: 1,
        factor_conversion2: 0,
        habilitacion1: 622919,
        habilitacion2: 1,
        habilitacion3: 0,
        id_grupo_product_fact: 1,
        id_proveedor: 1
    }
];

const MOCK_TANQUES: Tanque[] = [
    { id_tanques: 1, descripcion: 'TANQUE GAS NATURAL VEHICULAR', id_item: 1, aud_estado: 1, aud_fecha: '', capacidad: 10000, existencia_minima: 1000, factor_conversion1: 1, med_fecha: '', medicion_agua: 0, medicion_fecha: '', medicion_id: 1, medicion_temperatura: 20, medicion_volumen: 5000 },
    { id_tanques: 3, descripcion: 'TQ-GE01 (G.ESPECIAL+)', id_item: 7, aud_estado: 1, aud_fecha: '', capacidad: 15000, existencia_minima: 2000, factor_conversion1: 1, med_fecha: '', medicion_agua: 0, medicion_fecha: '', medicion_id: 3, medicion_temperatura: 20, medicion_volumen: 8000 },
    { id_tanques: 4, descripcion: 'TQ-DO01 (DIESEL)', id_item: 11, aud_estado: 1, aud_fecha: '', capacidad: 20000, existencia_minima: 3000, factor_conversion1: 1, med_fecha: '', medicion_agua: 0, medicion_fecha: '', medicion_id: 4, medicion_temperatura: 20, medicion_volumen: 12000 }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function obtenerItems() {
    await delay(500);
    items.set(MOCK_ITEMS);
}

export async function obtenerTanques(idEstacion: string) {
    await delay(500);
    // Filtrar tanques si fuera necesario, para el mock devolvemos todos
    tanques.set(MOCK_TANQUES);
}

export async function registrarMovimiento(payload: MovimientoRegistroDTO): Promise<void> {
    console.log('📝 [MOCK] Registrando movimiento local:', payload);
    await delay(800);
    // En modo local, el registro ya se maneja en el componente guardando en el store 'movimientos'
}

export async function obtenerMovimientosCabecera(ffini: string, ffin: string, idEstacion: string) {
    await delay(500);
    // Mantenemos los movimientos locales que ya existan en el store
    movimientos.update((current) => {
        return current.filter((m) => m.estado === 'LOCAL' || m.estado === 'OK');
    });
}

export async function obtenerMovimientoDetalle(idTransaccion: number) {
    // Primero verificar si hay detalles guardados localmente
    let detallesLocal: MovimientoDetalle[] | undefined;
    detallesLocales.subscribe((map: Map<number, MovimientoDetalle[]>) => { detallesLocal = map.get(idTransaccion); })();

    if (detallesLocal && detallesLocal.length > 0) {
        movimientoSeleccionadoDetalle.set(detallesLocal);
        return detallesLocal;
    }

    await delay(300);
    return [];
}
