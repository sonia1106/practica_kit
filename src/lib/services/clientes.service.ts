import type { Cliente, ClienteForm, ClienteApi, ClienteOperacionDTO} from '$lib/types/clientes';
import { clientes } from '$lib/stores/clientes';
import { http } from '$lib/utils/http';

interface ApiResponse<T> {
  IntCodigo: number;
  oResultado: T;
  StrMensaje: string;
}

export async function obtenerClientes() {
  const data = await http<ApiResponse<ClienteApi[]>>(
    '/ClienteObtener/0/0/'
  );

  clientes.set(
    data.oResultado.map(mapClienteApi)
  );
}

export async function obtenerClientePorId(id: number): Promise<Cliente> {
  const data = await http<ApiResponse<ClienteApi[]>>(
    `/ClienteObtener/${id}`
  );

  return mapClienteApi(data.oResultado[0]);
}

export async function crearCliente(form: ClienteForm): Promise<void> {
  const payload: ClienteOperacionDTO = {
    id_clientes: 0,
    razon_social: form.razon_social,
    nit: form.nit,
    direccion: form.direccion,
    telefono: form.telefono,
    contacto: form.contacto,
    id_grupo_clientes: 0,
    tipo: 1
  };

  await fetch('http://192.168.10.12:30004/ClienteOperaciones', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  await obtenerClientes();
}

export async function actualizarCliente(id: number, form: ClienteForm): Promise<void> {
  const payload: ClienteOperacionDTO = {
    id_clientes: id,
    razon_social: form.razon_social,
    nit: form.nit,
    direccion: form.direccion,
    telefono: form.telefono,
    contacto: form.contacto,
    id_grupo_clientes: 0,
    tipo: 2
  };

  await fetch('http://192.168.10.12:30004/ClienteOperaciones', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  await obtenerClientes();
}

function mapClienteApi(c: ClienteApi): Cliente {
  return {
    id_clientes: c.id_clientes,
    nit: c.nit,
    razon_social: c.razon_social,
    direccion: c.direccion,
    telefono: c.telefono,
    grupo: c.grupo,
    contacto: c.contacto
  };
}
