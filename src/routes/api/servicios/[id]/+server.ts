import { servicios } from "$lib/db";
import type { RequestHandler } from "./$types";
import type { Servicio } from "$lib/types";

// Controladores para editar y eliminar
export const PUT: RequestHandler = async ({ params, request }) => {
  const id = Number(params.id);
  const data = (await request.json()) as Servicio;

  const index = servicios.findIndex(s => s.id === id);
  if (index === -1) return new Response("No encontrado", { status: 404 });

  servicios[index] = {
    ...servicios[index],
    nombre: data.nombre,
    precio: Number(data.precio)
  };

  return new Response("OK");
};

export const DELETE: RequestHandler = ({ params }) => {
  const id = Number(params.id);

  const index = servicios.findIndex(s => s.id === id);
  if (index === -1) return new Response("No encontrado", { status: 404 });

  servicios.splice(index, 1);

  return new Response("OK");
};
