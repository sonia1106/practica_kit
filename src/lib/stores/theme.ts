import { writable } from 'svelte/store';

// Verifica si el usuario tiene una preferencia guardada
const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';
const systemPrefersDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

export const theme = writable(initialTheme);

// Aplica el tema al cuerpo del documento
if (typeof window !== 'undefined') {
  theme.subscribe(value => {
    const root = document.documentElement;
    if (value === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', value);
  });
}
export const sidebarOpen = writable(false);

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

export function openModal() {
  modalOpen.set(true);
}

export function closeModal() {
  modalOpen.set(false);
}

export function toggleModal() {
  modalOpen.update(v => !v);
}