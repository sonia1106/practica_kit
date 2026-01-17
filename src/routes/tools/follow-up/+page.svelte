<script lang="ts">
	import { onMount } from 'svelte';
	import { dark } from '$lib/stores/theme';
	import { movimientos, movimientoSeleccionadoDetalle } from '$lib/stores/inventario';
	import {
		obtenerMovimientosCabecera,
		obtenerMovimientoDetalle
	} from '$lib/services/inventario.service';
	import type { MovimientoCabecera, MovimientoDetalle } from '$lib/types/inventario';

	// Filters
	let ffini = new Date().toISOString().split('T')[0];
	let ffin = new Date().toISOString().split('T')[0];
	let idEstacion = '8'; // Hardcoded default

	// Search State
	let searchQuery = ''; // Optional: Client-side filtering if needed

	// Modals State
	let modalDetalleOpen = false;
	let modalEditarOpen = false;
	let movimientoSeleccionado: MovimientoCabecera | null = null;
	let loadingDetalle = false;

	// Pagination (Basic client-side for now)
	let currentPage = 1;
	const itemsPerPage = 10;

	// Computed
	$: filteredMovimientos = $movimientos.filter((m) => {
		// Basic client-side filter example
		if (!searchQuery) return true;
		return (
			m.referencia?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			m.usuario?.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	$: paginatedMovimientos = filteredMovimientos.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil(filteredMovimientos.length / itemsPerPage);

	// Handlers
	async function buscarMovimientos() {
		await obtenerMovimientosCabecera(ffini, ffin, idEstacion);
		currentPage = 1;
	}

	onMount(() => {
		// Optionally load on mount?
		buscarMovimientos();
	});

	async function verDetalle(mov: MovimientoCabecera) {
		movimientoSeleccionado = mov;
		modalDetalleOpen = true;
		loadingDetalle = true;
		await obtenerMovimientoDetalle(mov.id_transaccion);
		loadingDetalle = false;
	}

	function editarMovimiento(mov: MovimientoCabecera) {
		movimientoSeleccionado = { ...mov }; // Copy to avoid direct mutation before save
		modalEditarOpen = true;
	}

	function descargarPDF(mov: MovimientoCabecera) {
		alert(`Descargando PDF para transacción ${mov.id_transaccion} (Stub)`);
	}

	function cerrarModals() {
		modalDetalleOpen = false;
		modalEditarOpen = false;
		movimientoSeleccionado = null;
	}

	function guardarEdicion() {
		// Logic to update movement would go here
		alert('Guardar edición no implementado aún.');
		cerrarModals();
	}

	function changePage(delta: number) {
		currentPage = Math.max(1, Math.min(totalPages, currentPage + delta));
	}
</script>

<div
	class={`p-6 min-h-screen transition-colors
    ${$dark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'}
  `}
>
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-lg font-bold">Monitoreo Inventario</h2>
		<span class="text-sm text-gray-500">
			Herramientas / Inventario /
			<span class={`${$dark ? 'text-gray-300' : 'text-gray-700'}`}>Seguimiento</span>
		</span>
	</div>

	<!-- CARD PRINCIPAL -->
	<div
		class={`rounded-lg shadow p-6 border transition-colors
      ${$dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}
	>
		<h3 class="text-md text-lg font-medium mb-6">Monitoreo Movimientos de Inventario</h3>

		<!-- FILTROS -->
		<div class="md:grid-cols-6 gap-4 mb-6 grid grid-cols-1 items-end">
			<div>
				<label class="text-xs font-semibold mb-1 block uppercase">Del :</label>
				<input
					type="date"
					bind:value={ffini}
					class={`rounded-md px-3 py-2 text-sm w-full border
            ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}
          `}
				/>
			</div>

			<div>
				<label class="text-xs font-semibold mb-1 block uppercase">Al :</label>
				<input
					type="date"
					bind:value={ffin}
					class={`rounded-md px-3 py-2 text-sm w-full border
            ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}
          `}
				/>
			</div>

			<div class="md:col-span-2 lg:col-span-3">
				<label class="text-xs font-semibold mb-1 block uppercase">Estación de Servicio :</label>
				<select
					bind:value={idEstacion}
					disabled
					class={`rounded-md px-3 py-2 text-sm w-full border
            ${$dark ? 'bg-gray-600 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}
          `}
				>
					<option value="8">ESTACION DE SERVICIO LUCIFER</option>
				</select>
			</div>

			<div class="gap-2 flex">
				<button
					on:click={buscarMovimientos}
					class="px-4 py-2 rounded-md bg-amber-500 text-white text-sm hover:bg-amber-600 shadow-sm transition-colors"
				>
					Ver Registros
				</button>
			</div>
		</div>

		<!-- TABLA PRINCIPAL -->
		<div
			class={`rounded-xl mb-4 overflow-hidden border
            ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
		>
			<div class="overflow-x-auto">
				<table class="text-sm min-w-full">
					<thead>
						<tr
							class={`border-b text-center transition-colors duration-300
                      ${$dark ? 'border-gray-600' : 'border-gray-300'}`}
						>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">Fecha</th>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">Nro</th>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">Ref.</th>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">Prov/Dest</th>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">Tipo</th>
							<th class="px-4 py-3 font-medium text-xs text-center uppercase">Est.</th>
							<th class="px-4 py-3 font-medium text-xs text-right uppercase">Total</th>
							<th class="px-4 py-3 font-medium text-xs text-center uppercase">Acciones</th>
						</tr>
					</thead>
					<tbody class={`divide-y ${$dark ? 'divide-gray-600' : 'divide-gray-200'}`}>
						{#each paginatedMovimientos as mov}
							<tr class={`hover:bg-opacity-50 ${$dark ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}>
								<td class="px-4 py-2"
									>{mov.fecha ? new Date(mov.fecha).toLocaleDateString() : '-'}</td
								>
								<td class="px-4 py-2">{mov.id_transaccion}</td>
								<td class="px-4 py-2">{mov.referencia || '-'}</td>
								<td class="px-4 py-2">{mov.prov || mov.origen || '-'}</td>
								<td class="px-4 py-2">{mov.transaccion_tipo || '-'}</td>
								<td class="px-4 py-2 text-xs text-center">
									<span
										class={`px-2 py-1 rounded-full ${mov.estado === 'OK' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
									>
										{mov.estado || 'OK'}
									</span>
								</td>
								<td class="px-4 py-2 font-medium text-right"
									>{mov.monto_total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td
								>
								<td class="px-4 py-2">
									<div class="space-x-2 flex justify-center">
										<button
											on:click={() => descargarPDF(mov)}
											class="text-red-500 hover:text-red-700"
											title="PDF"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
												/>
											</svg>
										</button>
										<button
											on:click={() => verDetalle(mov)}
											class="text-blue-500 hover:text-blue-700"
											title="Ver Detalle"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
												/>
											</svg>
										</button>
										<button
											on:click={() => editarMovimiento(mov)}
											class="text-amber-500 hover:text-amber-700"
											title="Editar"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
						{#if paginatedMovimientos.length === 0}
							<tr>
								<td colspan="8" class="px-4 py-8 text-gray-500 text-center"
									>No se encontraron movimientos.</td
								>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>

		<!-- PAGINATION -->
		{#if totalPages > 1}
			<div class="gap-2 mt-4 flex justify-center">
				<button
					disabled={currentPage === 1}
					on:click={() => changePage(-1)}
					class={`px-3 py-1 rounded border disabled:opacity-50
              ${$dark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'}
            `}
				>
					Anterior
				</button>
				<span class="px-3 py-1 flex items-center">{currentPage} / {totalPages}</span>
				<button
					disabled={currentPage === totalPages}
					on:click={() => changePage(1)}
					class={`px-3 py-1 rounded border disabled:opacity-50
              ${$dark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'}
            `}
				>
					Siguiente
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- MODAL DETALLE -->
{#if modalDetalleOpen && movimientoSeleccionado}
	<div class="inset-0 bg-black/50 backdrop-blur-sm fixed z-50 flex items-center justify-center">
		<div
			class={`max-w-4xl rounded-lg p-6 shadow-xl max-h-[90vh] w-full overflow-y-auto
    ${$dark ? 'bg-gray-800 text-gray-200 border-gray-700 border' : 'bg-white text-gray-700'}
  `}
		>
			<div class="mb-4 pb-2 border-gray-500/30 flex items-center justify-between border-b">
				<h3 class="text-xl font-bold">
					Detalle de Movimiento #{movimientoSeleccionado.id_transaccion}
				</h3>
				<button on:click={cerrarModals} class="text-2xl hover:text-red-500">&times;</button>
			</div>

			<div class="md:grid-cols-4 gap-4 mb-6 text-sm grid grid-cols-2">
				<div>
					<span class="font-bold block opacity-70">Fecha:</span>
					{movimientoSeleccionado.fecha}
				</div>
				<div>
					<span class="font-bold block opacity-70">Tipo:</span>
					{movimientoSeleccionado.transaccion_tipo}
				</div>
				<div>
					<span class="font-bold block opacity-70">Estado:</span>
					{movimientoSeleccionado.estado}
				</div>
				<div>
					<span class="font-bold block opacity-70">Usuario:</span>
					{movimientoSeleccionado.usuario}
				</div>
				<div class="md:col-span-2">
					<span class="font-bold block opacity-70">Referencia:</span>
					{movimientoSeleccionado.referencia || '-'}
				</div>
				<div class="md:col-span-2">
					<span class="font-bold block opacity-70">Proveedor/Origen:</span>
					{movimientoSeleccionado.prov || movimientoSeleccionado.origen}
				</div>
			</div>

			<h4 class="font-semibold mb-2">Items</h4>
			<div
				class={`rounded-lg overflow-hidden border
            ${$dark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
			>
				<table class="text-sm w-full">
					<thead class={`${$dark ? 'bg-gray-700' : 'bg-gray-100'}`}>
						<tr>
							<th class="px-3 py-2 text-left">Producto</th>
							<th class="px-3 py-2 text-left">Tanque</th>
							<th class="px-3 py-2 text-right">Cantidad</th>
							<th class="px-3 py-2 text-right">Precio</th>
							<th class="px-3 py-2 text-right">Total</th>
						</tr>
					</thead>
					<tbody class="divide-y opacity-90">
						{#if loadingDetalle}
							<tr><td colspan="5" class="p-4 text-center">Cargando detalles...</td></tr>
						{:else}
							{#each $movimientoSeleccionadoDetalle as item}
								<tr>
									<td class="px-3 py-2">{item.producto}</td>
									<td class="px-3 py-2">{item.tanque}</td>
									<td class="px-3 py-2 text-right">{item.cantidad}</td>
									<td class="px-3 py-2 text-right">{item.precio}</td>
									<td class="px-3 py-2 font-medium text-right">{item.monto_total}</td>
								</tr>
							{/each}
							{#if $movimientoSeleccionadoDetalle.length === 0}
								<tr><td colspan="5" class="p-4 text-center">No hay detalles disponibles</td></tr>
							{/if}
						{/if}
					</tbody>
				</table>
			</div>

			<div class="mt-6 flex justify-end">
				<button
					on:click={cerrarModals}
					class="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
				>
					Cerrar
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL EDITAR -->
{#if modalEditarOpen && movimientoSeleccionado}
	<div class="inset-0 bg-black/50 backdrop-blur-sm fixed z-50 flex items-center justify-center">
		<div
			class={`max-w-lg rounded-lg p-6 shadow-xl w-full
    ${$dark ? 'bg-gray-800 text-gray-200 border-gray-700 border' : 'bg-white text-gray-700'}
  `}
		>
			<h3 class="text-lg font-semibold mb-4">
				Editar Movimiento #{movimientoSeleccionado.id_transaccion}
			</h3>

			<div class="space-y-4">
				<div>
					<label class="text-sm font-medium mb-1 block">Referencia</label>
					<input
						bind:value={movimientoSeleccionado.referencia}
						class="input px-3 py-2 rounded w-full border bg-transparent"
					/>
				</div>
				<div>
					<label class="text-sm font-medium mb-1 block">Usuario</label>
					<input
						bind:value={movimientoSeleccionado.usuario}
						class="input px-3 py-2 rounded w-full border bg-transparent"
					/>
				</div>
				<!-- Add more fields as needed -->
			</div>

			<div class="gap-2 mt-6 flex justify-end">
				<button
					on:click={cerrarModals}
					class="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
				>
					Cancelar
				</button>
				<button
					on:click={guardarEdicion}
					class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
				>
					Guardar
				</button>
			</div>
		</div>
	</div>
{/if}
