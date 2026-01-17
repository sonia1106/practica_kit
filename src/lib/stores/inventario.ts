import { writable } from 'svelte/store';
import type { Item, Tanque, MovimientoCabecera, MovimientoDetalle } from '$lib/types/inventario';

export const items = writable<Item[]>([]);
export const tanques = writable<Tanque[]>([]);
export const movimientos = writable<MovimientoCabecera[]>([]);
export const movimientoSeleccionadoDetalle = writable<MovimientoDetalle[]>([]);
