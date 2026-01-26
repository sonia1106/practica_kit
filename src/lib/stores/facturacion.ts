import { writable } from 'svelte/store';
import type {
    Manguera,
    TipoPago,
    Parametrica,
    TransaccionVenta
} from '$lib/types/facturacion';

export const mangueras = writable<Manguera[]>([]);
export const tiposPago = writable<TipoPago[]>([]);
export const tiposConsumidor = writable<Parametrica[]>([]);
export const reporteVentas = writable<TransaccionVenta[]>([]); // Store for the Maintenance report
