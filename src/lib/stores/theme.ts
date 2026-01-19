import { writable } from 'svelte/store';
import type { Cliente } from '$lib/types/clientes';


// Verifica si el usuario tiene una preferencia guardada
const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';
const systemPrefersDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

export const theme = writable(initialTheme);

// Aplica el tema al cuerpo del documento
if (typeof window !== 'undefined') {
  theme.subscribe(value => {
    const root = document.documentElement;
    const isDark = value === 'dark';

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  });
}
export const sidebarOpen = writable(false);
export const sidebarHover = writable(false);

// Cargar valor inicial desde localStorage
const saved = typeof localStorage !== "undefined"
  ? localStorage.getItem("theme")
  : null;

export const dark = writable(saved === "dark");

// Reaccionar a cambios del store
dark.subscribe((value) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", value);
  }

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", value ? "dark" : "light");
  }
});

// Función para alternar
export function toggleDark() {
  dark.update(v => !v);
}

// control modales

export const modalState = writable<{
  view: string | null;
  data: any;
}>({
  view: null,
  data: null
});

export const modalOpen = writable(false); // Mantener por compatibilidad si es necesario, pero idealmente migrar.

// Función unificada para abrir modales
export function openModal(view: string, data: any = null) {
  modalState.set({ view, data });
  modalOpen.set(true); // Opcional, para compatibilidad
}

// Función unificada para cerrar
export function closeModal() {
  modalState.set({ view: null, data: null });
  modalOpen.set(false); // Opcional
}

export function handleModalKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal();
  }
}



