<script lang="ts">
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { sidebarOpen, dark} from "$lib/stores/theme";

  import './layout.css';
  import "../app.css";
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
  let sidebarToggle = false; // estado del sidebar

</script>

<div class="flex min-h-screen bg-custom-background text-custom-text transition-colors duration-300 ">

  {#if $page.url.pathname !== '/'}
    <!-- SIDEBAR -->
      <Sidebar />

    <!-- CONTENIDO PRINCIPAL (incluye header + página) -->
    <div class={`flex flex-col flex-1 transition-all duration-300 
      ${$sidebarOpen ? 'ml-64 lg:ml-74' : 'ml-0 lg:ml-0'} 
    `}>
      <Header />
      <main class="flex-1">
        {@render children()}
      </main>
      <Footer />
    </div>

  {:else}

    <!-- PÁGINA DE LOGIN (sin sidebar ni header) -->
    <main class="flex-1">
      {@render children()}
    </main>

  {/if}

</div>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
