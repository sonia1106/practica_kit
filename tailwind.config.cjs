/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'], // <-- aquí creamos la clase font-outfit
      },
      colors: {
        'custom-background': 'rgb(var(--background) / <alpha-value>)',
        'custom-text': 'rgb(var(--text) / <alpha-value>)',
        'custom-border': 'rgb(var(--border) / <alpha-value>)',
        'custom-input': 'rgb(var(--input-background) / <alpha-value>)',
        'custom-sidebar': 'rgb(var(--sidebar-background) / <alpha-value>)',
        'custom-header': 'rgb(var(--header-background) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}
