// src/stores/theme.ts
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

