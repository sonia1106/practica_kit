import { servicios, generarId } from "$lib/db";
import type { RequestHandler } from "./$types";
import type { Servicio } from "$lib/types";

// controladores para listar y crear servicios
export const GET: RequestHandler = () => {
  return new Response(JSON.stringify(servicios));
};

export const POST: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as Omit<Servicio, "id">;

  const nuevo: Servicio = {
    id: generarId(),
    nombre: data.nombre,
    precio: Number(data.precio)
  };

  servicios.push(nuevo);

  return new Response(JSON.stringify(nuevo), { status: 201 });
};
