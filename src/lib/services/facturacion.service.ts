import type {
    ApiResponse,
    Manguera,
    MedicionResponse,
    PrecioResponse,
    DatosClienteResponse,
    TipoPago,
    Parametrica,
    Condicion,
    TransaccionVenta,
    FacturaManualPayload
} from '$lib/types/facturacion';

import {
    mangueras,
    tiposPago,
    tiposConsumidor,
    reporteVentas
} from '$lib/stores/facturacion';

const BASE_URL = 'http://127.0.0.1:30004';
const ESTACION_ID = '8';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            console.error(`Error fetching ${url}: ${res.status} ${res.statusText}`);
            throw new Error(`API Error: ${res.status}`);
        }
        const data = await res.json();
        return data as T;
    } catch (e) {
        console.error('Fetch error:', e);
        throw e;
    }
}

async function fetchForm<T>(url: string, formData: Record<string, any>): Promise<T> {
    const params = new URLSearchParams();
    for (const key in formData) {
        params.append(key, String(formData[key]));
    }

    try {
        const res = await fetch(url, {
            method: 'POST',
            body: params 
        });
        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }
        const data = await res.json();
        return data as T;
    } catch (e) {
        console.error('Fetch Form error:', e);
        throw e;
    }
}

export const facturacionService = {

    obtenerMangueras: async (idEstacion: string = ESTACION_ID) => {
        const url = `${BASE_URL}/MangueraObtener/0/${idEstacion}/`;
        const res = await fetchJson<ApiResponse<Manguera[]>>(url);
        if (res.IntCodigo === 1) {
            mangueras.set(res.oResultado);
        }
        return res;
    },

    obtenerMedicion: async (idManguera: number, fecha: string) => {
        const url = `${BASE_URL}/GenericosListaProcesosObtener/`;
        return fetchForm<ApiResponse<MedicionResponse[]>>(url, {
            tipo: 1,
            long1: idManguera,
            string1: fecha
        });
    },

    obtenerPrecioUnitario: async (idManguera: number, idPrecioLista: number, fecha: string) => {
        const url = `${BASE_URL}/GenericosProcesosObtener/`;
        return fetchForm<ApiResponse<PrecioResponse>>(url, {
            tipo: 1,
            long1: idManguera,
            long2: idPrecioLista,
            string1: fecha
        });
    },

  
    obtenerTipoPago: async () => {
        const url = `${BASE_URL}/ObtenerTipoPago/Externo/`;
        const res = await fetchJson<ApiResponse<TipoPago[]>>(url);
        if (res.IntCodigo === 1) {
            tiposPago.set(res.oResultado);
        }
        return res;
    },

    obtenerTipoConsumidor: async () => {
        const url = `${BASE_URL}/ParametricaObtener/19/`;
        const res = await fetchJson<ApiResponse<Parametrica[]>>(url);
        if (res.IntCodigo === 1) {
            tiposConsumidor.set(res.oResultado);
        }
        return res;
    },

    obtenerTipoAutorizacion: async () => {
        const url = `${BASE_URL}/ParametricaObtener/18/`;
        return fetchJson<ApiResponse<Parametrica[]>>(url);
    },

    obtenerNombreEESS: async () => {
        const url = `${BASE_URL}/ParametricaObtener/5/`;
        return fetchJson<ApiResponse<Parametrica[]>>(url);
    },

    obtenerTipoCondicion: async () => {
        const url = `${BASE_URL}/CondicionObtener`;
        return fetchJson<ApiResponse<Condicion[]>>(url);
    },

    obtenerPais: async () => {
        const url = `${BASE_URL}/ParametricaObtener/4/0/1/`;
        return fetchJson<ApiResponse<Parametrica[]>>(url);
    },

    obtenerDatosCliente: async (criterio: string) => { 
        const url = `${BASE_URL}/GenericosProcesosObtener/`;
        // tipo: 2, string1: criterio
        return fetchForm<ApiResponse<DatosClienteResponse>>(url, {
            tipo: 2,
            string1: criterio
        });
    },


    registrarFacturaManual: async (payload: FacturaManualPayload) => {
        const url = `${BASE_URL}/FacturaManualRegistrar/`;
        return fetchForm<{ IntCodigo: number; StrMensaje: string }>(url, payload);
    },


    obtenerReporteLibroVentas: async (
        fechaInicio: string,
        fechaFin: string,
        idEstacion: string = ESTACION_ID
    ) => {
        const url = `${BASE_URL}/ReporteLibroVentas/${fechaInicio}/${fechaFin}/-1/${idEstacion}/`;
        const res = await fetchJson<ApiResponse<TransaccionVenta[]>>(url);
        if (res.IntCodigo === 1) {
            reporteVentas.set(res.oResultado);
        } else {
            reporteVentas.set([]);
        }
        return res;
    }
};
