<script lang="ts">
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { sidebarOpen, dark} from "$lib/stores/theme";
  import "../app.css";
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
  let sidebarToggle = false; // estado del sidebar

</script>

<div class="flex min-h-screen overflow-x-hidden bg-custom-background text-custom-text transition-colors duration-300">

  {#if $page.url.pathname !== '/'}

    <!-- SIDEBAR -->
    <Sidebar />

    <!-- CONTENIDO -->
    <div class="flex flex-col flex-1 min-w-0">
      <Header />
      <main class="flex-1 pt-16 lg:pt-0 ">
        {@render children()}
      </main>

      <Footer />
    </div>

  {:else}

    <main class="flex-1 pt-16 lg:pt-0">
      {@render children()}
    </main>

  {/if}

</div>


<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
