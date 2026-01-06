<script lang="ts">
  let openMenu: { [key: string]: boolean } = {
    parametro: false,
    clientes: false,
    herramientas: false,
    inventario: false,
    ventas: false,
    autorizaciones: false,
    reportes: false,
    ayuda: false,
    reportes_ventas: false,
    otros: false,
    parametroPinned: false,
    escrituras: false,
    operadores: false,
    otros_c: false,

  };
  import { sidebarOpen, sidebarHover, dark } from "$lib/stores/theme";
  import SidebarLink from '$lib/components/SidebarLink.svelte';
  import { menuItemClasses } from '$lib/actions/menuClasses';

  function closeAllExcept(key: string) {
    for (const k in openMenu) {
      if (k !== key) openMenu[k] = false;
    }
  }
  function onEnter() {
    if (window.innerWidth >= 1024) {
      sidebarHover.set(true);
    }
  }

  function onLeave() {
    if (window.innerWidth >= 1024) {
      sidebarHover.set(false);
    }
  }
   
  if (!$sidebarOpen && !$sidebarHover) {
    if (!openMenu.parametroPinned) {
      openMenu.parametro = false;
    }
  }
</script>

<div
  role="navigation"
  on:mouseenter={onEnter}
  on:mouseleave={onLeave}
  class={`
    fixed lg:static inset-y-0 min-h-screen left-0 h-full z-40
     ease-in-out
    ${$dark
      ? 'bg-gray-900 border-gray-700 text-white border-r'
      : 'bg-white border-gray-200 text-gray-700 border-r'}

    ${
      $sidebarOpen || $sidebarHover
        ? 'w-64'
        : 'w-22'
    }

    ${$sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `}
>
  <div class="h-full flex flex-col p-2 space-y-1">
    <div class="mb-6">
      <a href="/dashboard" 
        class="flex items-center mb-6 w-full text-left focus:outline-none pl-3 pt-6" > 
        <div class="w-8 h-8 shrink-0 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
        > P 
        </div> 
        <span class={` 
          ml-2 text-xl font-bold whitespace-nowrap transition-all  
          ${$sidebarOpen || $sidebarHover ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'} 
          `} 
        >Petro</span> </a>

      <!-- MENU -->
      <div class="mb-6">
        <p
          class={`
            text-xs font-semibold mb-2 uppercase tracking-wider
            transition-all flex items-center
            ${$dark ? 'text-gray-400' : 'text-gray-500'}
          `}
        >
          <!-- TEXTO MENU -->
          <span
            class={`
              hidden lg:inline transition-all
              ${$sidebarOpen || $sidebarHover
                ? 'opacity-100 ml-0'
                : 'opacity-0 -ml-4 pointer-events-none'}
            `}
          >
            MENU
          </span>

          <!-- ICONO (3 PUNTOS) -->
          <span
            class={`
              hidden lg:flex -ml-1 transition-all
              ${$sidebarOpen || $sidebarHover
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100'}
            `}
          >
            <svg
              class="fill-current stroke-[1]"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951ZM17.999 10.4951C17.1706 10.4951 16.499 11.1667 16.499 11.9951V12.0051C16.499 12.8335 17.1706 13.5051 17.999 13.5051C18.8275 13.5051 19.499 12.8335 19.499 12.0051V11.9951C19.499 11.1667 18.8275 10.4951 17.999 10.4951Z"
              />
            </svg>
          </span>
        </p>

        <!-- PARÁMETROS -->
       <button
          on:click={() => {
            if (!$sidebarOpen && !$sidebarHover) return;

            closeAllExcept('parametro');

            openMenu.parametro = !openMenu.parametro;
            openMenu.parametroPinned = openMenu.parametro;
          }}
          class={`
            flex items-center justify-between w-full rounded-lg mb-1 text-base font-medium
            ${menuItemClasses(
              openMenu.parametro,
              $dark
            )}
          `}
        >
          <div class="flex items-center px-2">
            <div class="w-10 h-10 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 stroke-[1]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <span
            class={`
              transition-all 
              ${$sidebarOpen || $sidebarHover ? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}
            `}
            >Parámetros</span>
          </div>
          <span class={`transition ${openMenu.parametro ? 'rotate-90' : ''}
              ${$sidebarOpen || $sidebarHover ? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}
          `}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </button>
        {#if openMenu.parametro && ($sidebarOpen || $sidebarHover) }
          <div class="ml-6 mt-1 space-y-1">
            <SidebarLink
            href="/customers"
            label="Clientes"
            />
            <button
              on:click={() => openMenu.escrituras = !openMenu.escrituras}
              class={`
                flex items-center justify-between p-2 w-full rounded-lg text-base font-medium
                ${menuItemClasses(openMenu.escrituras, $dark)}
              `}
            >
              <span>Escrituras</span>
              <span class={`transition ${openMenu.escrituras ? 'rotate-90' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </button>
            {#if openMenu.escrituras }
            {/if}
            <button
              on:click={() => openMenu.operadores = !openMenu.operadores}
              class={`
                flex items-center justify-between p-2 w-full rounded-lg text-base font-medium
                ${menuItemClasses(openMenu.operadores, $dark)}
              `}
            >
              <span>Operadores</span>
              <span class={`transition ${openMenu.operadores? 'rotate-90' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </button>
            {#if openMenu.operadores }
            {/if}
            <button
              on:click={() => openMenu.otros_c = !openMenu.otros_c}
              class={`
                flex items-center justify-between p-2 w-full rounded-lg text-base font-medium
                ${menuItemClasses(openMenu.otros_c, $dark)}
              `}
            >
              <span>Otros</span>
              <span class={`transition ${openMenu.otros_c ? 'rotate-90' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </button>
            {#if openMenu.otros_c }
            {/if}
            <SidebarLink
            href="/combustibles"
            label="Combustibles"
            />
          </div>
        {/if}

        <!-- HERRAMIENTAS -->
        <button
          on:click={() => { closeAllExcept('herramientas'); openMenu.herramientas = !openMenu.herramientas; }}
          class={`
            flex items-center justify-between p-2 w-full rounded-lg mb-1 text-base font-medium
            ${menuItemClasses(openMenu.herramientas, $dark)}
          `}
        >
          <div class="flex items-center">
            <div class="w-10 flex justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 stroke-[1]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.34a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 1 1-.84-.61l1.285-5.34a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </div>
            <span
              class={`
              transition-all 
              ${$sidebarOpen || $sidebarHover ? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}
            `}
            >Herramientas</span>
          </div>
          <span class={`transition ${openMenu.herramientas ? 'rotate-90' : ''}
          ${$sidebarOpen || $sidebarHover ? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}

          `}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </button>
        {#if openMenu.herramientas && ($sidebarOpen || $sidebarHover)}
          <div class="ml-6 mt-1 space-y-1">
            <!-- Submenú de Herramientas -->
            <button
              on:click={() => openMenu.inventario = !openMenu.inventario}
              class={`
                flex items-center justify-between p-2 w-full rounded-lg text-base font-medium
                ${menuItemClasses(openMenu.inventario, $dark)}
              `}
            >
              <span>Inventario</span>
              <span class={`transition ${openMenu.inventario ? 'rotate-90' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </button>
            {#if openMenu.inventario }
              <div class="ml-4 space-y-1">
                <SidebarLink
                href="/herramienta/nuevo"
                label="Nuevo"
                />
                <SidebarLink
                href="/herramienta/seguimiento"
                label="Seguimiento"
                />
              </div>
            {/if}

            <button
              on:click={() => openMenu.ventas = !openMenu.ventas}
              class={`
                flex items-center justify-between p-2 w-full rounded-lg text-base font-medium
                ${menuItemClasses(openMenu.ventas, $dark)}
              `}
            >
              <span>Ventas</span>
              <span class={`transition ${openMenu.ventas ? 'rotate-90' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </button>
            {#if openMenu.ventas}
              <div class="ml-4 space-y-1">
                <SidebarLink
                href="/herramienta/dosificaccion"
                label="Dosificación"
                />
                <SidebarLink
                href="/herramienta/factManual"
                label="Factura Manual"
                />
                <SidebarLink
                href="/herramienta/mantenimiento"
                label="Mantenimiento"
                />
                <SidebarLink
                href="/herramienta/importar_clientes"
                label="Importar Clientes"
                />
              </div>
            {/if}

            <button
              on:click={() => openMenu.autorizaciones = !openMenu.autorizaciones}
              class={`
                flex items-center justify-between p-2 w-full rounded-lg text-base font-medium
                ${menuItemClasses(openMenu.autorizaciones, $dark)}
              `}
            >
              <span>Autorizaciones</span>
              <span class={`transition ${openMenu.autorizaciones ? 'rotate-90' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </button> 
          </div>
        {/if}

        <!-- REPORTES -->
        <button
          on:click={() => { closeAllExcept('reportes'); openMenu.reportes = !openMenu.reportes; }}
          class={`
            flex items-center justify-between p-3 w-full rounded-lg mb-1 text-base font-medium
            ${menuItemClasses(openMenu.reportes, $dark)}
          `}
        >
          <div class="flex items-center">
            <div class="w-10 flex justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 stroke-[1]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.5V3.75A.75.75 0 0 1 3.75 3h13.5a.75.75 0 0 1 .75.75v9.75m0 0a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75ZM3 16.5v2.25a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V16.5m-13.5 0h13.5" />
              </svg>
            </div>
            <span
              class={`
              transition-all 
              ${$sidebarOpen || $sidebarHover ? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}
            `}
            >Reportes</span>
          </div>
          <span class={`transition ${openMenu.reportes ? 'rotate-90' : ''}
                ${$sidebarOpen || $sidebarHover ? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}
                `}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </button>
        {#if openMenu.reportes && ($sidebarOpen || $sidebarHover)}
          <div class="ml-6 mt-1 space-y-1">
            <SidebarLink
            href="/reporte/metter"
            label="Metter"
            />
            <SidebarLink
            href="/reporte/calibracion"
            label="Calibración"
            />
            <button
              on:click={() => openMenu.reportes_ventas = !openMenu.reportes_ventas}
              class={`
                flex items-center justify-between p-2 w-full rounded-lg text-base font-medium
                ${menuItemClasses(openMenu.reportes_ventas, $dark)}
              `}
            >
              <span>Ventas</span>
              <span class={`transition ${openMenu.reportes_ventas ? 'rotate-90' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </button>
            {#if openMenu.reportes_ventas}
              <div class="ml-4 space-y-1">
                <SidebarLink
                href="/reporte/acumulado"
                label="Acumulación"
                />
                <SidebarLink
                href="/report/centralizador"
                label="Centralizador"
                />
                <SidebarLink
                href="/reporte/cierreDiario"
                label="Cierre Diario"
                />
                <SidebarLink
                href="/reporte/internacional"
                label="Internacional"
                />
                <SidebarLink
                href="/reporte/libroVentas"
                label="Libro de Ventas"
                />
                <SidebarLink
                href="/reporte/visorGeneral"
                label="Visor General"
                />
                <SidebarLink
                href="/reporte/ventasAutoridazadas"
                label="Ventas Autorizadas (Entidad Externa)"
                />
              </div>
            {/if}
            <button
              on:click={() => openMenu.otros = !openMenu.otros}
              class={`
                flex items-center justify-between p-2 w-full rounded-lg text-base font-medium
                ${menuItemClasses(openMenu.otros, $dark)}
              `}
            >
              <span>Otros</span>
              <span class={`transition ${openMenu.otros ? 'rotate-90' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </button>
          </div>
        {/if}

        <!-- AYUDA -->
        <button
          on:click={() => { closeAllExcept('ayuda'); openMenu.ayuda = !openMenu.ayuda; }}
          class={`
            flex items-center justify-between p-3 w-full rounded-lg mb-1 text-base font-medium
            ${menuItemClasses(openMenu.ayuda, $dark)}
          `}
        >
          <div class="flex items-center">
            <div class="w-10 flex justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 mr-2 stroke-[1]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <span
              class={`
              transition-all 
              ${$sidebarOpen || $sidebarHover? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}
            `}
            >Ayuda</span>
          </div>
          <span class={`transition ${openMenu.ayuda ? 'rotate-90' : ''}
              ${$sidebarOpen || $sidebarHover ? 'opacity-100 ml-0' : 'opacity-0 -ml-4 pointer-events-none'}
                `}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</div>

