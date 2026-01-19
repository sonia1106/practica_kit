import type { Item, Tanque, MovimientoRegistroDTO, MovimientoCabecera, MovimientoDetalle } from '$lib/types/inventario';
import { items, tanques, movimientos, movimientoSeleccionadoDetalle } from '$lib/stores/inventario';
import { http } from '$lib/utils/http';

interface ApiResponse<T> {
    IntCodigo: number;
    oResultado: T;
    StrMensaje: string;
}

interface ApiMovimientosResponse {
    IntCodigo: number;
    oResultado: MovimientoCabecera[];
    oResultadoDet: any[];
    StrMensaje: string;
}

export async function obtenerItems() {
    const data = await http<ApiResponse<Item[]>>(
        '/ItemObtener/0/1'
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

    movimientoSeleccionadoDetalle.set(data.oResultado || []);
    return data.oResultado || [];
}
