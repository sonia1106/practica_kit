import type { Precio, PrecioApi } from '$lib/types/precios';

// Mock precios data based on PSUN API documentation
// Includes both Nacional and Internacional prices for each product
const MOCK_PRECIOS_API: PrecioApi[] = [
    {
        producto: 'GNV',
        precio_lista: 'NACIONAL',
        precio_venta: 2.73,
        fecha_actualizacion: '2017-09-30 06:26:05',
        precio_costo: 1.55,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 26,
        id_item: 1
    },
    {
        producto: 'GNV',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 2.95,
        fecha_actualizacion: '2022-06-03 19:17:52',
        precio_costo: 2.62,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 27,
        id_item: 1
    },
    {
        producto: 'DIESEL',
        precio_lista: 'NACIONAL',
        precio_venta: 9.8,
        fecha_actualizacion: '2017-09-30 06:26:04',
        precio_costo: 7.2,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 28,
        id_item: 2
    },
    {
        producto: 'DIESEL',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 9.8,
        fecha_actualizacion: '2018-11-06 18:05:50',
        precio_costo: 8.1,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 29,
        id_item: 2
    },
    {
        producto: 'G. ESPECIAL',
        precio_lista: 'NACIONAL',
        precio_venta: 6.96,
        fecha_actualizacion: '2017-09-30 06:26:04',
        precio_costo: 5.1,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 30,
        id_item: 3
    },
    {
        producto: 'G. ESPECIAL',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 8.68,
        fecha_actualizacion: '2018-11-06 18:05:50',
        precio_costo: 7.2,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 31,
        id_item: 3
    },
    {
        producto: 'G. PREMIUM',
        precio_lista: 'NACIONAL',
        precio_venta: 11,
        fecha_actualizacion: '2017-12-18 18:54:27',
        precio_costo: 8.5,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 32,
        id_item: 4
    },
    {
        producto: 'G. PREMIUM',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 0,
        fecha_actualizacion: '2017-12-18 18:54:23',
        precio_costo: 0,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 33,
        id_item: 4
    },
    {
        producto: 'G. SUPER91',
        precio_lista: 'NACIONAL',
        precio_venta: 4.4,
        fecha_actualizacion: '2018-03-19 16:48:15',
        precio_costo: 3.2,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 34,
        id_item: 5
    },
    {
        producto: 'G. SUPER91',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 0,
        fecha_actualizacion: '2018-03-19 16:48:19',
        precio_costo: 0,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 35,
        id_item: 5
    },
    {
        producto: 'GS.ETANOL 92',
        precio_lista: 'NACIONAL',
        precio_venta: 8.28,
        fecha_actualizacion: '2019-05-21 16:42:53',
        precio_costo: 6.8,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 36,
        id_item: 6
    },
    {
        producto: 'GS.ETANOL 92',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 0,
        fecha_actualizacion: '2019-05-21 16:42:53',
        precio_costo: 0,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 37,
        id_item: 6
    },
    {
        producto: 'G.ESPECIAL+',
        precio_lista: 'NACIONAL',
        precio_venta: 6.96,
        fecha_actualizacion: '2019-05-21 16:42:53',
        precio_costo: 5.3,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 38,
        id_item: 7
    },
    {
        producto: 'G.ESPECIAL+',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 8.68,
        fecha_actualizacion: '2019-08-01 18:35:17',
        precio_costo: 7.4,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 39,
        id_item: 7
    },
    {
        producto: 'DIESEL+',
        precio_lista: 'NACIONAL',
        precio_venta: 9.8,
        fecha_actualizacion: '2024-12-21 11:57:19',
        precio_costo: 7.5,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 40,
        id_item: 10
    },
    {
        producto: 'DIESEL+',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 9.8,
        fecha_actualizacion: '2024-12-21 11:57:19',
        precio_costo: 8.3,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 41,
        id_item: 10
    },
    {
        producto: 'DIESEL ULS',
        precio_lista: 'NACIONAL',
        precio_venta: 8.78,
        fecha_actualizacion: '2024-12-21 11:57:32',
        precio_costo: 6.9,
        ice: 1,
        icep: 0,
        fecha_activacion: '2014-10-21 00:00:00',
        id_precio_lista: 1,
        id_precio: 42,
        id_item: 11
    },
    {
        producto: 'DIESEL ULS',
        precio_lista: 'INTERNACIONAL',
        precio_venta: 0,
        fecha_actualizacion: '2024-12-21 11:57:32',
        precio_costo: 0,
        ice: 1,
        icep: 0,
        fecha_activacion: '2026-01-10 00:00:01',
        id_precio_lista: 2,
        id_precio: 43,
        id_item: 11
    }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export async function obtenerPrecios(): Promise<Precio[]> {
    // Simulate API call delay
    await delay(800);

    return MOCK_PRECIOS_API.map(mapPrecioApi);
}

export async function obtenerPreciosPorProducto(idItem: number): Promise<Precio[]> {
    // Simulate API call delay
    await delay(300);

    const precios = MOCK_PRECIOS_API
        .filter(p => p.id_item === idItem)
        .map(mapPrecioApi);

    return precios;
}
