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

//control modales

export const modalOpen = writable(false);
export const modalEditOpen = writable(false);
export const clienteEdit = writable<Cliente | null>(null);


export function openModal() {
  modalOpen.set(true);
}

export function closeModal() {
  modalOpen.set(false);
}

export function toggleModal() {
  modalOpen.update(v => !v);
}
export function handleModalKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal();
    closeEditModal();
    closeDeleteModal();
  }
}
export function openEditModal(cliente: Cliente) {
  clienteEdit.set(cliente);
  modalEditOpen.set(true);
}
export function closeEditModal() {
  modalEditOpen.set(false);
  clienteEdit.set(null);
}

export function openDeleteModal(cliente: Cliente) {
  clienteDelete.set(cliente);
  modalDeleteOpen.set(true);
}

export function closeDeleteModal() {
  modalDeleteOpen.set(false);
  clienteDelete.set(null);
}
export const modalDeleteOpen = writable(false);
export const clienteDelete = writable<Cliente | null>(null);

