import { writable } from 'svelte/store';
import type { Cliente } from '$lib/types/clientes';

export const clientes = writable<Cliente[]>([]);
