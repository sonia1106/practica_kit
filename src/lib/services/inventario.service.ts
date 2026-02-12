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
    try {
        const data = await http<ApiResponse<Item[]>>(
            '/ItemObtener/0/1'
        );
        items.set(data.oResultado || []);
    } catch (error) {
        console.error('Error obteniendo items:', error);
        items.set([]);
    }
}

export async function obtenerTanques(idEstacion: string) {
    try {
        const data = await http<ApiResponse<Tanque[]>>(
            `/TanqueObtener/0/${idEstacion}/`
        );
        tanques.set(data.oResultado || []);
    } catch (error) {
        console.error('Error obteniendo tanques:', error);
        tanques.set([]);
    }
}

export async function registrarMovimiento(payload: MovimientoRegistroDTO): Promise<void> {
    console.log('📝 Intentando registrar movimiento en /MovimientoRegistro/');
    console.log('📦 Payload:', payload);

    try {
        await http('/MovimientoRegistro/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        console.log('✅ Registro exitoso');
    } catch (error) {
        console.error('❌ Error en registrarMovimiento:', error);
        throw error;
    }
}

export async function obtenerMovimientosCabecera(ffini: string, ffin: string, idEstacion: string) {
    const formData = new FormData();
    formData.append('ffini', ffini);
    formData.append('ffin', ffin);
    formData.append('tipo_consulta', '1');
    formData.append('id_estacion', idEstacion);

    try {
        const data = await http<ApiMovimientosResponse>('/MovimientoObtenerCabecera/', {
            method: 'POST',
            body: formData
        });

        movimientos.set(data.oResultado || []);
    } catch (error) {
        console.error('Error obteniendo movimientos:', error);
        movimientos.set([]);
    }
}

export async function obtenerMovimientoDetalle(idTransaccion: number) {
    const formData = new FormData();
    formData.append('id_transaccion', idTransaccion.toString());

    try {
        // Usamos any para la respuesta del detalle si no tenemos interfaz estricta
        const data = await http<any>('/MovimientoObtenerDetalle/', {
            method: 'POST',
            body: formData
        });

        const detalles = data.oResultado || [];
        movimientoSeleccionadoDetalle.set(detalles);
        return detalles;
    } catch (error) {
        console.error('Error obteniendo detalle:', error);
        return [];
    }
}
