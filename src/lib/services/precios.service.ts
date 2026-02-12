import type { Precio, PrecioApi } from '$lib/types/precios';

const BASE_URL = '/backend';

interface ApiResponse<T> {
    IntCodigo: number;
    StrMensaje: string;
    oResultado: T;
}

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

function mapPrecioApi(p: PrecioApi): Precio {
    return {
        producto: p.producto,
        tipo: p.precio_lista,
        precio: p.precio_venta,
        fechaActualizacion: p.fecha_actualizacion,
        id_precio: p.id_precio,
        id_item: p.id_item
    };
}

/**
 * Obtiene todos los precios disponibles
 * Endpoint: GET /PrecioObtener/1/
 */
export async function obtenerPrecios(): Promise<Precio[]> {
    const url = `${BASE_URL}/PrecioObtener/1/`;
    const res = await fetchJson<ApiResponse<PrecioApi[]>>(url);

    if (res.IntCodigo === 1) {
        return res.oResultado.map(mapPrecioApi);
    }

    throw new Error(res.StrMensaje || 'Error al obtener precios');
}

/**
 * Obtiene precios filtrados por producto
 * @param idItem ID del producto
 */
export async function obtenerPreciosPorProducto(idItem: number): Promise<Precio[]> {
    // Obtener todos los precios y filtrar por id_item
    const todosLosPrecios = await obtenerPrecios();
    return todosLosPrecios.filter(p => p.id_item === idItem);
}
