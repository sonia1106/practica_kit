import { writable } from 'svelte/store';

import type { Cliente } from '$lib/types/clientes';
export const clientes = writable<Cliente[]>([]);

const BASE_URL = 'http://192.168.10.12:30004';
export async function obtenerClientes(): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/ClienteObtener/0/0/`);

    if (!response.ok) {
      throw new Error('Error al obtener clientes');
    }

    const data = await response.json();

    clientes.set(data.oResultado as Cliente[]);
  } catch (error) {
    console.error('obtenerClientes:', error);
    clientes.set([]);
  }
}
export async function obtenerClientePorId(
  id: number
): Promise<Cliente | null> {
  try {
    const response = await fetch(`${BASE_URL}/ClienteObtener/${id}`);

    if (!response.ok) {
      throw new Error('Error al obtener cliente');
    }

    const data = await response.json();

    return data.oResultado?.[0] ?? null;
  } catch (error) {
    console.error('obtenerClientePorId:', error);
    return null;
  }
}

export async function crearCliente(
  cliente: {
    razon_social: string;
    nit: number | string;
    direccion?: string;
    telefono?: string;
    contacto?: string;
    grupo?: 'Preferente' | 'Regular' | '';
  }
): Promise<boolean> {
  try {
    const form = new FormData();

    const grupoMap: Record<'Preferente' | 'Regular', number> = {
      Preferente: 1,
      Regular: 2
    };

    let idGrupo = 0;
    if (cliente.grupo && cliente.grupo in grupoMap) {
      idGrupo = grupoMap[cliente.grupo];
    }

    form.append('razon_social', cliente.razon_social);
    form.append('nit', String(cliente.nit));
    form.append('direccion', cliente.direccion ?? '');
    form.append('telefono', cliente.telefono ?? '');
    form.append('contacto', cliente.contacto ?? '');
    form.append('id_grupo_clientes', String(idGrupo)); // 0, 1, 2 según tu mapa
    form.append('tipo', '1'); // 1 = crear
    form.append('id_clientes', '0'); // siempre 0 al crear


    const response = await fetch(`${BASE_URL}/ClienteOperaciones`, {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      throw new Error('Error al crear cliente');
    }

    await obtenerClientes();
    return true;
  } catch (error) {
    console.error('crearCliente:', error);
    return false;
  }
}

export async function actualizarCliente(
  cliente: Cliente
): Promise<boolean> {
  try {
    const form = new FormData();

    form.append('razon_social', cliente.razon_social);
    form.append('nit', String(cliente.nit));
    form.append('direccion', cliente.direccion ?? '');
    form.append('telefono', cliente.telefono ?? '');
    form.append('contacto', cliente.contacto ?? '');
    form.append('id_grupo_clientes', '0');
    form.append('tipo', '2');
    form.append('id_clientes', String(cliente.id_clientes));

    const response = await fetch(`${BASE_URL}/ClienteOperaciones`, {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      throw new Error('Error al actualizar cliente');
    }

    await obtenerClientes();
    return true;
  } catch (error) {
    console.error('actualizarCliente:', error);
    return false;
  }
}
