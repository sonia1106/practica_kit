import type { PageLoad } from "./$types";
import type { Servicio } from "$lib/types";

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch("/api/servicios");
  const servicios: Servicio[] = await res.json();

  return { servicios };
};
