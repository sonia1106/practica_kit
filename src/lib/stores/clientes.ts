import { writable } from 'svelte/store';
import type { Cliente } from '$lib/types/clientes';

function createClientesStore() {
  const stored =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('clientes')
      : null;

  const initial: Cliente[] = stored ? JSON.parse(stored) : [];

  const { subscribe, set, update } = writable<Cliente[]>(initial);

  // persistencia automática
  subscribe((value) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('clientes', JSON.stringify(value));
    }
  });
   return {
    subscribe,
    set,
    update,
    clear: () => set([])
  };
}
export const clientes = createClientesStore();
