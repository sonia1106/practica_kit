import type { Item, Tanque, MovimientoRegistroDTO, MovimientoCabecera, MovimientoDetalle } from '$lib/types/inventario';
import { items, tanques, movimientos, movimientoSeleccionadoDetalle } from '$lib/stores/inventario';
import { http } from '$lib/utils/http';

interface ApiResponse<T> {
    IntCodigo: number;
    oResultado: T;
    StrMensaje: string;
}

// Support for detailed response in different format if needed
interface ApiMovimientosResponse {
    IntCodigo: number;
    oResultado: MovimientoCabecera[];
    oResultadoDet: any[]; // If header endpoint also returns details? user said "Header & Detail"
    StrMensaje: string;
}

export async function obtenerItems() {
    const data = await http<ApiResponse<Item[]>>(
        '/ItemObtener/0/1' // hardcoded 0/1 per example
    );

    items.set(data.oResultado);
}

export async function obtenerTanques(idEstacion: string) {
    const data = await http<ApiResponse<Tanque[]>>(
        `/TanqueObtener/0/${idEstacion}/`
    );

    tanques.set(data.oResultado);
}

export async function registrarMovimiento(payload: MovimientoRegistroDTO): Promise<void> {
    await fetch('http://192.168.10.12:30004/MovimientoRegistro/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

export async function obtenerMovimientosCabecera(ffini: string, ffin: string, idEstacion: string) {
    // The endpoint is a POST that returns list of headers
    const formData = new FormData();
    formData.append('ffini', ffini);
    formData.append('ffin', ffin);
    formData.append('tipo_consulta', '1');
    formData.append('id_estacion', idEstacion);

    const response = await fetch('http://192.168.10.12:30004/MovimientoObtenerCabecera/', {
        method: 'POST',
        body: formData
    });

    const data: ApiMovimientosResponse = await response.json();
    movimientos.set(data.oResultado || []);
}

export async function obtenerMovimientoDetalle(idTransaccion: number) {
    const formData = new FormData();
    formData.append('id_transaccion', idTransaccion.toString());

    const response = await fetch('http://192.168.10.12:30004/MovimientoObtenerDetalle/', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    // The user said response structure: oResultado array with detailed info.
    // Wait, earlier notes said "oResultadoDet" for Header&Detail endpoint, but independent detail endpoint returns what?
    // User said "Obtiene Movimientos Inventario Detalle ... Response Structure: oResultado array"
    // So let's assume oResultado is the array of details.

    movimientoSeleccionadoDetalle.set(data.oResultado || []);
    return data.oResultado || [];
}
