<script lang="ts">
  export let data;
  interface Servicio {
    id: number;
    nombre: string;
    precio: number;
  }
  let servicios: Servicio[] = data?.servicios || [];
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

<div class="p-6 w-full overflow-x-auto">
  <h2 class="text-2xl font-bold mb-4">Agregar Servicios</h2>
  <div class="mb-6 flex flex-wrap gap-2 sm:flex-row">
    <input
      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="Nombre"
      bind:value={nombre}
    />

    <input
      type="number"
      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="Precio"
      bind:value={precio}
    />

    <button
      class="w-full sm:w-auto px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      on:click={agregar}
    >
      Agregar
    </button>
  </div>


  <h2 class="text-2xl font-bold mb-4">Lista de Servicios</h2>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each servicios as servicio, i}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">{i + 1}</td>
          <td class="px-6 py-4 whitespace-nowrap">{servicio.nombre}</td>
          <td class="px-6 py-4 whitespace-nowrap">{servicio.precio}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button
              class="text-blue-600 hover:text-blue-900 mr-2"
              on:click={() => seleccionar(servicio)}
            >
              Editar
            </button>
            <button
              class="text-red-600 hover:text-red-900"
              on:click={() => eliminar(servicio.id)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if edit}
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="font-semibold mb-2">Editar Servicio</h2>
      <div class="flex space-x-2">
        <input
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          bind:value={edit.nombre}
        />
        <input
          type="number"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          bind:value={edit.precio}
        />
        <button
          class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          on:click={guardar}
        >
          Guardar
        </button>
        <button
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          on:click={() => (edit = null)}
        >
          Cancelar
        </button>
      </div>
    </div>
  {/if}
  
</div>
