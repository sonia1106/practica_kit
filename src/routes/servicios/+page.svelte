<script lang="ts">
  export let data;

  interface Servicio {
    id: number;
    nombre: string;
    precio: number;
  }

  let servicios: Servicio[] = data.servicios;

  let nombre: string = "";
  let precio: number | string = "";
  let edit: Servicio | null = null;

  async function recargar() {
    const res = await fetch("/api/servicios");
    servicios = await res.json() as Servicio[];
  }

  async function agregar() {
    await fetch("/api/servicios", {
      method: "POST",
      body: JSON.stringify({ nombre, precio }),
      headers: { "Content-Type": "application/json" }
    });

    nombre = "";
    precio = "";
    recargar();
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
    recargar();
  }

  async function eliminar(id: number) {
    await fetch(`/api/servicios/${id}`, {
      method: "DELETE"
    });

    recargar();
  }
</script>

<div class="p-6 max-w-3xl mx-auto">

  <h2 class="text-2xl font-bold mb-4">Agregar Servicios</h2>
  <div class="mb-6">
    <input
      class="border p-2 mr-2"
      placeholder="Nombre"
      bind:value={nombre}
    />
    <input
      class="border p-2 mr-2"
      type="number"
      placeholder="Precio"
      bind:value={precio}
    />
    <button class="bg-blue-600 text-white px-4 py-2" on:click={agregar}>
      Agregar
    </button>
  </div>

    <h2 class="text-2xl font-bold mb-4">Lista de Servicios</h2>
  <table class="w-full border">
    <thead>
    <tr class="bg-gray-200">
      <th class="p-2">N°</th>
      <th class="p-2">Nombre</th>
      <th class="p-2">Precio</th>
      <th class="p-2">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {#each servicios as servicio, i}
        <tr class="border">
          <td class="p-2">{i + 1}</td>
          <td class="p-2">{servicio.nombre}</td>
          <td class="p-2">{servicio.precio}</td>
          <td class="p-2">
            <button class="text-blue-600 mr-2" on:click={() => seleccionar(servicio)}>
              Editar
            </button>
            <button class="text-red-600" on:click={() => eliminar(servicio.id)}>
              Eliminar
            </button>
          </td>
        </tr>
      {/each}
  </tbody>
  </table>

  {#if edit}
    <div class="mt-6 p-4 border bg-gray-100">
      <h2 class="font-semibold mb-2">Editar Servicio</h2>

      <input class="border p-2 mr-2" bind:value={edit.nombre} />
      <input class="border p-2 mr-2" bind:value={edit.precio} type="number" />

      <button class="bg-green-600 text-white px-4 py-2" on:click={guardar}>
        Guardar
      </button>

      <button class="ml-2" on:click={() => (edit = null)}>
        Cancelar
      </button>
    </div>
  {/if}
</div>
