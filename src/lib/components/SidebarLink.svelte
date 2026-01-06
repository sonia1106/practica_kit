<script lang="ts">
  import { page } from '$app/stores';
  import { dark } from '$lib/stores/theme';
  import { sidebarOpen, sidebarHover} from "$lib/stores/theme";


  export let href: string;
  export let label: string;
  export let icon: typeof import('svelte').SvelteComponent | null = null;

  // Detecta si la ruta está activa
  $: isActive = $page.url.pathname === href;

  // Clases calculadas
  $: classes = isActive
    ? $dark
      ? 'bg-blue-900/30 text-blue-400'
      : 'bg-blue-50 text-blue-600'
    : $dark
      ? 'text-gray-300 hover:bg-white/5 hover:text-gray-200'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700';
</script>

<a
  href={href}
  class={`flex items-center p-2 rounded-lg text-base transition-colors ${classes}`}
>
  {#if icon}
    <svelte:component this={icon} class="mr-3 size-5" />
  {/if}
  <span
  class={`
              transition-all duration-200
              ${$sidebarOpen || $sidebarHover? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}
            `}
  >{label}</span>
</a>
