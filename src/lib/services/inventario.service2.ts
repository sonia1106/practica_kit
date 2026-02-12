import type { Item, Tanque, MovimientoRegistroDTO } from '$lib/types/inventario';
import { items, tanques } from '$lib/stores/inventario';

const BASE_URL = '/backend';

interface ApiResponse<T> {
    IntCodigo: number;
    oResultado: T;
    StrMensaje: string;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function obtenerItems() {
    const data = await fetchJson<ApiResponse<Item[]>>(`${BASE_URL}/ItemObtener/0/1`);
    items.set(data.oResultado);
}

export async function obtenerTanques(idEstacion: string) {
    const data = await fetchJson<ApiResponse<Tanque[]>>(`${BASE_URL}/TanqueObtener/0/${idEstacion}/`);
    tanques.set(data.oResultado);
}

export async function registrarMovimiento(payload: MovimientoRegistroDTO): Promise<void> {
    await fetch(`${BASE_URL}/MovimientoRegistro/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

export async function obtenerMovimientoDetalle(idTransaccion: number) {
    interface DetalleResponse {
        id_transaccion_detalle: number;
        id_transaccion: number;
        id_item: number;
        cantidad: number;
        monto_bruto: number;
        monto_descuento: number;
        monto_exento: number;
        factor_ice: number;
        monto_ice: number;
        factor_icep: number;
        monto_icep: number;
        monto_total: number;
        precio: number;
        id_tanque: number;
        producto: string;
        tanque: string;
        tipo: number;
    }

    const formData = new FormData();
    formData.append('id_transaccion', idTransaccion.toString());

    const response = await fetch(`${BASE_URL}/MovimientoObtenerDetalle/`, {
        method: 'POST',
        body: formData
    });

    const data: ApiResponse<DetalleResponse[]> = await response.json();

    return data.oResultado.map(d => ({
        id_item: d.id_item,
        cantidad: d.cantidad,
        precio: d.precio,
        producto: d.producto,
        tanque: d.tanque,
        monto_total: d.monto_total
    }));
}
