import type { Servicio } from "./types";

export const servicios: Servicio[] = [
  { id: 1, nombre: "Instalación", precio: 50 },
  { id: 2, nombre: "Reparación", precio: 80 }
];

export function generarId() {
  if (servicios.length === 0) return 1;
  return servicios[servicios.length - 1].id + 1;
}
