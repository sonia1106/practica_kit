import type { Cliente, ClienteForm, ClienteApi, ClienteOperacionDTO } from '$lib/types/clientes';
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
  const formData = new FormData();
  formData.append('id_clientes', '0');
  formData.append('razon_social', form.razon_social);
  formData.append('nit', String(form.nit));
  formData.append('direccion', form.direccion);
  formData.append('telefono', form.telefono);
  formData.append('contacto', form.contacto || '');
  formData.append('id_grupo_clientes', '0');
  formData.append('tipo', '1');

  await http('/ClienteOperaciones', {
    method: 'POST',
    body: formData
  });

  await obtenerClientes();
}

export async function actualizarCliente(id: number, form: ClienteForm): Promise<void> {
  const formData = new FormData();
  formData.append('id_clientes', String(id));
  formData.append('razon_social', form.razon_social);
  formData.append('nit', String(form.nit));
  formData.append('direccion', form.direccion);
  formData.append('telefono', form.telefono);
  formData.append('contacto', form.contacto || '');
  formData.append('id_grupo_clientes', '0');
  formData.append('tipo', '3'); // 3 = Modificación según docs de estructura

  await http('/ClienteOperaciones', {
    method: 'POST',
    body: formData
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
