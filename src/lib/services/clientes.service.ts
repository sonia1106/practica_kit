import { clientes } from '$lib/stores/clientes';
import type { Cliente } from '$lib/types/clientes';

export function guardarCliente(data: Omit<Cliente, 'id'>) {
  clientes.update(lista => [
    ...lista,
    {
        id: Date.now(),
        nit: data.nit,
        razonSocial: data.razonSocial,
        direccion: data.direccion,
        telefono: data.telefono,
        grupo: data.grupo,
        tarjetas: data.tarjetas,
        vehiculos: data.vehiculos
    }
  ]);
}

export function actualizarCliente(cliente: Cliente): void {
  clientes.update((lista: Cliente[]) =>
    lista.map((c: Cliente) =>
      c.id === cliente.id ? cliente : c
    )
  );
}
