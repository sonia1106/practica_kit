<script lang="ts">
  export let data;
  import { dark, modalOpen, openModal, closeModal } from "$lib/stores/theme";
  import type { Servicio } from "$lib/types";

  let servicios: Servicio[] = data?.servicios || [
    {
      id: 1,
      nombre: "Lindsey Curtis",
      precio: 3900,
      rol: "Web Designer",
      equipo: ["user1.jpg", "user2.jpg", "user3.jpg"],
      estado: "Active",
      presupuesto: "3.9K"
    },
    {
      id: 2,
      nombre: "Kaiya George",
      precio: 24900,
      rol: "Project Manager",
      equipo: ["user4.jpg", "user5.jpg"],
      estado: "Pending",
      presupuesto: "24.9K"
    },
    {
      id: 3,
      nombre: "Zain Geidt",
      precio: 12700,
      rol: "Content Writer",
      equipo: ["user6.jpg"],
      estado: "Active",
      presupuesto: "12.7K"
    },
    {
      id: 4,
      nombre: "Abram Schleifer",
      precio: 2800,
      rol: "Digital Marketer",
      equipo: ["user7.jpg", "user8.jpg", "user9.jpg"],
      estado: "Cancel",
      presupuesto: "2.8K"
    },
    {
      id: 5,
      nombre: "Carla George",
      precio: 4500,
      rol: "Front-end Developer",
      equipo: ["user10.jpg", "user11.jpg", "user12.jpg", "user13.jpg"],
      estado: "Active",
      presupuesto: "4.5K"
    }
  ];

  let nombre: string = "";
  let precio: number | string = "";
  let edit: Servicio | null = null;

  async function recargar() {
    const res = await fetch("/api/servicios");
    servicios = await res.json() as Servicio[];
  }

  async function agregar() {
    if (!nombre || !precio) {
      alert("Nombre y precio son obligatorios");
      return;
    }
    await fetch("/api/servicios", {
      method: "POST",
      body: JSON.stringify({ nombre, precio: Number(precio) }),
      headers: { "Content-Type": "application/json" }
    });
    nombre = "";
    precio = "";
    await recargar();
  }

  function seleccionar(servicio: Servicio) {
    edit = { ...servicio };
  }

  async function guardar() {
    if (!edit) return;
    await fetch(`/api/servicios/${edit.id}`, {
      method: "PUT",
      body: JSON.stringify(edit),
      headers: { "Content-Type": "application/json" }
    });
    edit = null;
    await recargar();
  }

  async function eliminar(id: number) {
    await fetch(`/api/servicios/${id}`, {
      method: "DELETE"
    });
    await recargar();
  }
</script>
    <section class="p-6 min-h-screen transition-colors duration-300"
            class:bg-gray-900={$dark}
            class:text-white={$dark}
            class:bg-white={!$dark}
            class:text-gray-700={!$dark}
    >
    <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold mb-4 transition-colors duration-300"
                class:text-white={$dark}
                class:text-gray-900={!$dark}
            >
            Basic Table 1
            </h2>
            <button
                class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                on:click={openModal}
            >
                Agregar
            </button>
        </div>

        <div class={`rounded-lg shadow-lg p-6 transition-colors duration-300
                    ${$dark ? "bg-gray-800" : "bg-gray-100"}`}>
        <table class="min-w-full">
            <thead>
                <tr class={`border-b transition-colors duration-300
                    ${$dark ? "border-gray-700" : "border-gray-300"}`}>
                    <th class="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">N°</th>
                    <th class="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Tanque</th>
                    <th class="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Costo</th>
                    <th class="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
                    <th class="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Total</th>
                    <th class="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              {#each servicios as servicio, i}
                <tr class="hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-white">{servicio.nombre}</div>
                        <div class="text-xs text-gray-400">{servicio.rol}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex -space-x-2">
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">{servicio.presupuesto}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
              
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      class="text-blue-400 hover:text-blue-300 mr-2"
                      on:click={() => seleccionar(servicio)}
                    >
                      Editar
                    </button>
                    <button
                      class="text-red-400 hover:text-red-300"
                      on:click={() => eliminar(servicio.id)}
                    >
                      Eliminar
                    </button>
                  </td>
              
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
    </div>

    {#if $modalOpen}
    <div class=" fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <div class="bg-gray-100 p-4 border-b border-gray-300 rounded-t-lg flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-800">Registro de Movimiento</h2>
            <div class="text-sm text-gray-600">
                <span>Herramientas</span>  <span>Inventario</span> <span class="font-medium">Registro Movimiento</span>
            </div>
        </div>
        <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
            <div>
                <label for="estacion" class="block text-sm font-medium text-gray-700 mb-1">Estación:</label>
                <select id="estacion" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>ESTACION DE SERVICIO LUCIFER</option>
                </select>
            </div>

            <div>
                <label for="tipoDocumento" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento:</label>
                <select id="tipoDocumento" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Seleccione...</option>
                </select>
            </div>
            </div>

            <div></div>
        </div>

        <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Detalle Recepción</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="fechaRecepcion" class="block text-sm font-medium text-gray-700 mb-1">Fecha Recepción:</label>
                <div class="flex items-center">
                <input id="fechaRecepcion" type="date" value="2025-12-01" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <button class="ml-2 p-2 bg-gray-200 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
                </div>
            </div>

            <div>
                <label for="grupoProductos" class="block text-sm font-medium text-gray-700 mb-1">Grupo de Productos:</label>
                <select id="grupoProductos" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>COMBUSTIBLE</option>
                </select>
            </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
                <label for="tanque" class="block text-sm font-medium text-gray-700 mb-1">Tanque:</label>
                <select id="tanque" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Seleccione...</option>
                </select>
            </div>

            <div>
                <label for="producto" class="block text-sm font-medium text-gray-700 mb-1">Producto:</label>
                <select id="producto" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Seleccione...</option>
                </select>
            </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
                <label for="precioCosto" class="block text-sm font-medium text-gray-700 mb-1">Precio de Costo:</label>
                <input id="precioCosto" type="number" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div>
                <label for="volumenRecibido" class="block text-sm font-medium text-gray-700 mb-1">Volumen Recibido:</label>
                <input id="volumenRecibido" type="number" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div>
                <label for="importe" class="block text-sm font-medium text-gray-700 mb-1">Importe:</label>
                <input id="importe" type="number" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            </div>

            <div class="mt-6 flex justify-end">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Agregar Producto
            </button>
            </div>
            <div class="mt-6 flex justify-between items-center">
            <div class="text-lg font-medium text-gray-800">
                TOTAL: <span class="text-blue-600">0</span>
            </div>
            <div class="flex space-x-4">
                <button class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Registrar Movimiento
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    {/if}

  <div class="mt-6 p-4 bg-gray-800 rounded-lg">
    <h2 class="font-semibold mb-2 text-white">Agregar Servicios</h2>
    <div class="flex space-x-2">
      <input
        class="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
        placeholder="Nombre"
        bind:value={nombre}
      />
      <input
        type="number"
        class="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
        placeholder="Precio"
        bind:value={precio}
      />
      <button
        class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        on:click={agregar}
      >
        Agregar
      </button>
    </div>
  </div>

  {#if edit}
    <div class="mt-6 p-4 bg-gray-800 rounded-lg">
      <h2 class="font-semibold mb-2 text-white">Editar Servicio</h2>
      <div class="flex space-x-2">
        <input
          class="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
          bind:value={edit.nombre}
        />
        <input
          type="number"
          class="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
          bind:value={edit.precio}
        />
        <button
          class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          on:click={guardar}
        >
          Guardar
        </button>
        <button
          class="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          on:click={() => (edit = null)}
        >
          Cancelar
        </button>
      </div>
    </div>
  {/if}
</section>
