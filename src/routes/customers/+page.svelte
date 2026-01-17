<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import type { Cliente } from '$lib/types/clientes';

  import { clientes } from '$lib/stores/clientes';
  import {
    dark,
    modalOpen,
    openModal, handleModalKeyDown, openEditModal,
    closeModal,
    modalDeleteOpen,
    openDeleteModal, clienteDelete,
    closeDeleteModal,
    modalVehiculosOpen, clienteVehiculos,
    openVehiculosModal,
    closeVehiculosModal,
    modalTarjetasOpen, clienteTarjetas,
    openTarjetasModal,
    closeTarjetasModal
  } from '$lib/stores/theme';

  import {
    obtenerClientes,
    crearCliente,
    actualizarCliente
  } from '$lib/services/clientes.service';

  let listaClientes: Cliente[] = [];

  let editando = false;
  let clienteEditId: number | null = null;

  let form = {
    razon_social: '',
    nit: '',
    direccion: '',
    telefono: '',
    contacto: '',
    grupo: '' as '' | 'Preferente' | 'Regular'
  };

  onMount(async () => {
    await obtenerClientes();
    listaClientes = get(clientes);
  });


  function resetForm() {
    form = {
      razon_social: '',
      nit: '',
      direccion: '',
      telefono: '',
      contacto: '',
      grupo: ''
    };
    editando = false;
    clienteEditId = null;
  }

  async function submit() {
    const formNormalizado = {
      razon_social: form.razon_social,
      nit: Number(form.nit),
      direccion: form.direccion,
      telefono: form.telefono,
      contacto: form.contacto,
      id_grupo_clientes: 0
    };

    if (editando && clienteEditId) {
        await actualizarCliente(clienteEditId, formNormalizado);
      } else {
        await crearCliente(formNormalizado);
      }

      await obtenerClientes();
      listaClientes = get(clientes);

      resetForm();
      closeModal();
    


    await obtenerClientes();
    listaClientes = get(clientes);

    resetForm();
    closeModal();
  }


  function abrirEdicion(cliente: Cliente) {
    editando = true;
    clienteEditId = cliente.id_clientes;

    let grupoForm: '' | 'Preferente' | 'Regular' = '';
    if (cliente.grupo === 'CONSUMIDOR REGULAR') grupoForm = 'Regular';
    if (cliente.grupo === 'PREFERENTE') grupoForm = 'Preferente';

    form = {
      razon_social: cliente.razon_social,
      nit: String(cliente.nit),
      direccion: cliente.direccion,
      telefono: cliente.telefono ?? '',
      contacto: cliente.contacto ?? '',
      grupo: grupoForm
    };

    openModal();
  }

  function confirmarEliminacion() {
    alert('Eliminar cliente aún no está disponible en backend');
    closeDeleteModal();
  }

  
</script>


<svelte:window on:keydown={handleModalKeyDown} />
  <section class={`
      w-full h-full p-4 md:p-6
      ${$dark
        ? 'bg-gray-900 text-gray-200'
        : 'bg-white text-gray-700'}
    `}
  >
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <h2 class="text-lg font-bold">
        Clientes
      </h2>
      <span class="text-sm text-gray-500">
        Parametros/
        <a href="/customers" class={`
          ${$dark
          ? 'text-gray-300 hover:text-gray-100'
          : 'text-gray-700 hover:text-gray-800'
          }
        `}>
          Clientes 
        </a> 
      </span>
    </div>

    <div class={`rounded-lg mt-6 p-4 md:p-6 border
        ${$dark ? 
        "bg-gray-800 border-gray-700 text-white" 
        : 
        "bg-white border-gray-200 text-gray-700"}`}>
      
      <div class="flex justify-between items-center mb-4 -mt-2">
        <h3 class="text-md font-medium ">
          Lista de clientes
        </h3>
        <button
            on:click={() => modalOpen.set(true)}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Agregar
          </button>
      </div>

      <div class={`overflow-x-auto rounded-xl border
        ${$dark 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-gray-200'}`}
      >
        <table class="min-w-[1000px] w-full text-sm">
          <thead>
              <tr class={`border-b transition-colors duration-300 text-center
                  ${$dark ? "border-gray-600" : "border-gray-300"}`}>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>N°</th>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>NIT</th>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>Razón Social</th>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>Dirección</th>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>Teléfono</th>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>Grupo</th>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>Tarjetas</th>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>Vehículos</th>
                  <th class={`px-6 py-3 text-left text-xs font-medium uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>Acciones</th>
              </tr>
          </thead>

          <tbody>
            {#each $clientes as cliente, i}
              <tr class={`border-b last:border-0 ${$dark ? 'border-gray-600' : 'border-gray-100'}`}>
                <td class="px-6 py-4">{i + 1}</td>
                <td class="px-6 py-4">{cliente.nit}</td>
                <td class="px-6 py-4">{cliente.razon_social}</td>
                <td class="px-6 py-4">{cliente.direccion}</td>
                <td class="px-6 py-4">{cliente.telefono}</td>
                <td class="px-6 py-4">{cliente.grupo}</td>
                <td class="px-6 py-4">
                  <button
                      on:click={() => openTarjetasModal(cliente)}
                      aria-label="Ver tarjetas del cliente"
                      class={`
                        z-50 flex h-11 w-11 items-center justify-center rounded-lg
                        border
                        ${$dark
                          ? 'text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-500 border-gray-200 hover:bg-gray-100 hover:gray-700'
                        }
                      `}>
                      <div class="flex items-center gap-2 px-2">
                        <!-- Icono tarjeta -->
                        <div class="w-10 h-10 flex items-center justify-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-4 h-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M2.25 8.25h19.5M3 6.75h18A1.5 1.5 0 0 1 22.5 8.25v7.5A1.5 1.5 0 0 1 21 17.25H3A1.5 1.5 0 0 1 1.5 15.75v-7.5A1.5 1.5 0 0 1 3 6.75Zm3 6h3"
                            />
                          </svg>
                        </div>
                      </div>
                  </button>
                </td>
                <td class="px-6 py-4">
                  <button
                      on:click={() => openVehiculosModal(cliente)}
                      aria-label="Ver vehículos del cliente"
                      class={`
                        z-50 flex h-11 w-11 items-center justify-center rounded-lg
                        border
                        ${$dark
                          ? 'text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-500 border-gray-200 hover:bg-gray-100 hover:gray-700'
                        }
                      `}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="block w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM3 16.5V14.25c0-.621.504-1.125 1.125-1.125h.45l1.5-4.125A1.875 1.875 0 0 1 7.837 7.5h8.326c.78 0 1.48.48 1.762 1.213l1.5 4.125h.45c.621 0 1.125.504 1.125 1.125V16.5m-18 0h18"
                      />
                    </svg>
                  </button>
                </td>
                <td class="px-6 py-4 flex gap-2">
                  <button
                    aria-label="Editar cliente"
                    on:click={() => openEditModal(cliente)}
                    class="text-blue-500 hover:text-blue-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    aria-label="Eliminar cliente"
                    on:click={() => openDeleteModal(cliente)}
                    class="text-red-500 hover:text-red-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    {#if $modalOpen && editando}
    <form on:submit|preventDefault={submit}>
      <!-- Overlay -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        role="dialog"
        aria-modal="true"
      >
        <!-- Modal -->
        <div
          class={`w-full max-w-lg rounded-xl p-6 shadow-xl border
            ${$dark
              ? 'bg-gray-800 border-gray-700 text-gray-200'
              : 'bg-white border-gray-200 text-gray-700'}
          `}
          role="document"
        >
          <!-- Header -->
          <h3 class="text-lg font-semibold mb-6">
            Editar cliente
          </h3>

          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <!-- NIT -->
            <div>
              <label for="nit" class={`block mb-1 text-xs font-medium uppercase
                ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>
                NIT
              </label>
              <input
                id="nit"
                type="number"
                bind:value={form.nit}
                class={`w-full rounded-md px-3 py-2 border text-sm
                  focus:outline-none focus:ring-2
                  ${$dark
                    ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'}
                `}
              />
            </div>

            <!-- Razón Social -->
            <div>
              <label for="razonSocial" class={`block mb-1 text-xs font-medium uppercase
                ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Razón Social
              </label>
              <input
                id="razonSocial"
                type="text"
                bind:value={form.razon_social}
                class={`w-full rounded-md px-3 py-2 border text-sm
                  focus:outline-none focus:ring-2
                  ${$dark
                    ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'}
                `}
              />
            </div>

            <!-- Dirección -->
            <div class="md:col-span-2">
              <label for="direccion" class={`block mb-1 text-xs font-medium uppercase
                ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Dirección
              </label>
              <input
                id="direccion"
                type="text"
                bind:value={form.direccion}
                class={`w-full rounded-md px-3 py-2 border text-sm
                  focus:outline-none focus:ring-2
                  ${$dark
                    ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'}
                `}
              />
            </div>

            <!-- Teléfono -->
            <div>
              <label for="telefono" class={`block mb-1 text-xs font-medium uppercase
                ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Teléfono
              </label>
              <input
                id="telefono"
                type="number"
                bind:value={form.telefono}
                class={`w-full rounded-md px-3 py-2 border text-sm
                  focus:outline-none focus:ring-2
                  ${$dark
                    ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'}
                `}
              />
            </div>

            <!-- Grupo -->
            <div>
              <label for="grupo" class={`block mb-1 text-xs font-medium uppercase
                ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Grupo
              </label>
              <select
                id="grupo"
                bind:value={form.grupo}
                class={`w-full rounded-md px-3 py-2 border text-sm
                  focus:outline-none focus:ring-2
                  ${$dark
                    ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'}
                `}
              >
                <option value="">Seleccione</option>
                <option>Preferente</option>
                <option>Regular</option>
              </select>
            </div>

            <!-- Tarjetas -->
            <div>
              <label for="tarjetas"class={`block mb-1 text-xs font-medium uppercase
                ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Tarjetas
              </label>
              <input
                id="tarjetas"
                type="number"
                bind:value={form.contacto}
                class={`w-full rounded-md px-3 py-2 border text-sm
                  ${$dark
                    ? 'bg-gray-900 border-gray-700 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'}
                `}
              />
            </div>

            <!-- Vehículos -->
            <div>
              <label for="vehiculos" class={`block mb-1 text-xs font-medium uppercase
                ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Vehículos
              </label>
              <input
                id="vehiculos"
                type="text"
                bind:value={form.contacto}
                class={`w-full rounded-md px-3 py-2 border text-sm
                  ${$dark
                    ? 'bg-gray-900 border-gray-700 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'}
                `}
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              on:click={closeModal}
              class={`px-4 py-2 rounded-md text-sm
                ${$dark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="px-4 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </form>
    {/if}
    {#if $modalDeleteOpen && $clienteDelete}
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        role="dialog"
        aria-modal="true"
      >
        <div
          class={`w-full max-w-md rounded-xl p-6 shadow-xl border
            ${$dark
              ? 'bg-gray-800 border-gray-700 text-gray-200'
              : 'bg-white border-gray-200 text-gray-700'}
          `}
        >
          <h3 class="text-lg font-semibold mb-4">
            Confirmar eliminación
          </h3>

          <p class="text-sm mb-6">
            ¿Deseas eliminar el cliente
            <strong>{$clienteDelete.razon_social}</strong>?  
          </p>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              on:click={closeDeleteModal}
              class={`px-4 py-2 rounded-md text-sm
                ${$dark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              Cancelar
            </button>

            <button
              on:click={confirmarEliminacion}
              class="px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700
                    focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    {/if}
    {#if $modalOpen}
      <form on:submit|preventDefault={submit}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div class={`w-full max-w-lg rounded-xl p-6 shadow-xl border
            ${$dark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`}>
            
            <h3 class="text-lg font-semibold mb-6">{editando ? 'Editar cliente' : 'Nuevo cliente'}</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="nit" class="block mb-1 text-xs font-medium uppercase">NIT</label>
                <input id="nit" type="number" bind:value={form.nit} placeholder="Ingrese NIT" class="w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2" />
              </div>

              <div>
                <label for="razonSocial" class="block mb-1 text-xs font-medium uppercase">Razón Social</label>
                <input id="razonSocial" type="text" bind:value={form.razon_social} placeholder="Razón Social" class="w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2" />
              </div>

              <div class="md:col-span-2">
                <label for="direccion" class="block mb-1 text-xs font-medium uppercase">Dirección</label>
                <input id="direccion" type="text" bind:value={form.direccion} placeholder="Dirección" class="w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2" />
              </div>

              <div>
                <label for="telefono" class="block mb-1 text-xs font-medium uppercase">Teléfono</label>
                <input id="telefono" type="number" bind:value={form.telefono} placeholder="Teléfono" class="w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2" />
              </div>

              <div>
                <label for="contacto" class="block mb-1 text-xs font-medium uppercase">Contacto</label>
                <input id="contacto" type="text" bind:value={form.contacto} placeholder="Contacto" class="w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2" />
              </div>

              <div>
                <label for="grupo" class="block mb-1 text-xs font-medium uppercase">Grupo</label>
                <select id="grupo" bind:value={form.grupo} class="w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2">
                  <option value="">Seleccione</option>
                  <option>Preferente</option>
                  <option>Regular</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button type="button" on:click={closeModal} class="px-4 py-2 rounded-md text-sm">Cancelar</button>
              <button type="submit" class="px-4 py-2 rounded-md text-sm bg-blue-600 text-white">Guardar</button>
            </div>

          </div>
        </div>
      </form>
    {/if}
    {#if $modalVehiculosOpen && $clienteVehiculos}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div
          class={`w-full max-w-sm rounded-xl p-6 shadow-xl border
            ${$dark
              ? 'bg-gray-800 border-gray-700 text-gray-200'
              : 'bg-white border-gray-200 text-gray-700'}
          `}
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">
              Vehículos del cliente
            </h3>
            <button
              on:click={closeVehiculosModal}
              aria-label="Cerrar"
              class={`rounded-md p-1
                ${$dark
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'}
              `}
            >
              ✕
            </button>
          </div>

          <p class="text-sm mb-6">
            Cliente: <strong>{$clienteVehiculos.razon_social}</strong>
          </p>
          <div class="overflow-x-auto">
            <table
              class={`min-w-full text-sm border rounded-lg
                ${$dark
                  ? 'border-gray-700 text-gray-200'
                  : 'border-gray-200 text-gray-700'}
              `}
            >
              <thead
                class={`${$dark ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                <tr>
                  <th class="px-4 py-2 text-left">N°</th>
                  <th class="px-4 py-2 text-left">Placa</th>
                  <th class="px-4 py-2 text-left">País</th>
                  <th class="px-4 py-2 text-left">Asignar</th>
                </tr>
              </thead>

              <tbody>
                  <tr
                    class={`border-t
                      ${$dark ? 'border-gray-700' : 'border-gray-200'}
                    `}
                  >
                    <td class="px-4 py-2"></td>
                    <td class="px-4 py-2 font-medium">No disponible</td>
                    <td class="px-4 py-2">No disponible</td>
                    <td class="px-4 py-2"></td>
                  </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end mt-6">
            <button
              on:click={closeVehiculosModal}
              class={`px-4 py-2 rounded-md text-sm
              ${$dark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'}
            `}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    {/if}
    {#if $modalTarjetasOpen && $clienteTarjetas}
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        role="dialog"
        aria-modal="true"
      >
        <div
          class={`w-full max-w-lg rounded-xl p-6 shadow-xl border
            ${$dark
              ? 'bg-gray-800 border-gray-700 text-gray-200'
              : 'bg-white border-gray-200 text-gray-700'}
          `}
          role="document"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">
              Tarjetas del cliente
            </h3>

            <button
              on:click={closeTarjetasModal}
              aria-label="Cerrar"
              class={`rounded-md p-1
                ${$dark
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'}
              `}
            >
              ✕
            </button>
          </div>

          <!-- Info cliente -->
          <div class={`mb-4 rounded-lg p-4 text-sm
            ${$dark ? 'bg-gray-900' : 'bg-gray-50'}
          `}>
            <p class="font-medium">{ $clienteTarjetas.razon_social }</p>
            <p class="text-xs opacity-70">NIT: { $clienteTarjetas.nit }</p>
          </div>

          <!-- Contenido tarjetas -->
          <div class="space-y-4">
            <div
              class={`flex items-center gap-4 rounded-lg p-4 border
                ${$dark
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-gray-200'}
              `}
            >
              <!-- Icono -->
              <div
                class={`w-12 h-12 flex items-center justify-center rounded-full
                  ${$dark ? 'bg-blue-900/30' : 'bg-blue-100'}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class={`w-6 h-6
                    ${$dark ? 'text-blue-400' : 'text-blue-600'}
                  `}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 8.25h19.5M3 6.75h18A1.5 1.5 0 0 1 22.5 8.25v7.5A1.5 1.5 0 0 1 21 17.25H3A1.5 1.5 0 0 1 1.5 15.75v-7.5A1.5 1.5 0 0 1 3 6.75Zm3 6h3"
                  />
                </svg>
              </div>

              <!-- Texto -->
              <div>
                <p class="text-sm font-medium">tarjetas</p>
                <p class="text-xl font-semibold">
                  No disponible
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end mt-6">
            <button
              on:click={closeTarjetasModal}
              class={`px-4 py-2 rounded-md text-sm
                ${$dark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    {/if}
  </section>

