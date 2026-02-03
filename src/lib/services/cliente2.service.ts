import type { Cliente, ClienteForm } from '$lib/types/clientes';
import { clientes } from '$lib/stores/clientes';
import { get } from 'svelte/store';

// --- MOCK DATA ---
let mockClientes: Cliente[] = [
    {
        id_clientes: 101,
        nit: 1234567,
        razon_social: 'Empresa Ficticia S.A.',
        direccion: 'Av. Siempre Viva 123',
        telefono: '77712345',
        grupo: 'PREFERENTE',
        contacto: 'Juan Pérez'
    },
    {
        id_clientes: 102,
        nit: 9876543,
        razon_social: 'Comercial Los Andes',
        direccion: 'Calle Los Pinos 45',
        telefono: '60054321',
        grupo: 'CONSUMIDOR REGULAR',
        contacto: 'Maria Rodriguez'
    },
    {
        id_clientes: 103,
        nit: 4567890,
        razon_social: 'Transportes Rápidos',
        direccion: 'Zona Industrial Mz. C',
        telefono: '71234567',
        grupo: 'PREFERENTE',
        contacto: 'Carlos Gomez'
    }
];

// --- HELPERS ---
function simulateDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- PUBLIC METHODS ---

export async function obtenerClientes() {
    await simulateDelay();
    clientes.set([...mockClientes]);
    console.log('[MOCK] obtenerClientes:', mockClientes);
}

export async function obtenerClientePorId(id: number): Promise<Cliente> {
    await simulateDelay();
    const cliente = mockClientes.find(c => c.id_clientes === id);
    if (!cliente) {
        throw new Error('Cliente no encontrado');
    }
    return { ...cliente };
}

export async function crearCliente(form: ClienteForm): Promise<void> {
    await simulateDelay();

    const newId = mockClientes.length > 0
        ? Math.max(...mockClientes.map(c => c.id_clientes)) + 1
        : 1;

    const newCliente: Cliente = {
        id_clientes: newId,
        nit: Number(form.nit),
        razon_social: form.razon_social,
        direccion: form.direccion,
        telefono: form.telefono,
        grupo: form.id_grupo_clientes === 0 ? 'CONSUMIDOR REGULAR' : 'PREFERENTE', // Mock mapping
        contacto: form.contacto
    };

    mockClientes.push(newCliente);
    console.log('[MOCK] crearCliente:', newCliente);

    // Refresh store
    clientes.set([...mockClientes]);
}

export async function actualizarCliente(id: number, form: ClienteForm): Promise<void> {
    await simulateDelay();

    const index = mockClientes.findIndex(c => c.id_clientes === id);
    if (index === -1) {
        throw new Error('Cliente no encontrado para actualizar');
    }

    mockClientes[index] = {
        ...mockClientes[index],
        nit: Number(form.nit),
        razon_social: form.razon_social,
        direccion: form.direccion,
        telefono: form.telefono,
        contacto: form.contacto
        // NOTA: grupo no viene en el formCliente standard de 'crearCliente' salvo lógica custom
    };

    console.log('[MOCK] actualizarCliente:', mockClientes[index]);

    // Refresh store
    clientes.set([...mockClientes]);
}
