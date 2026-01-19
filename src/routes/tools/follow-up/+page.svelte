<script lang="ts">
	import { onMount } from 'svelte';
	import { dark, modalState, openModal, closeModal, handleModalKeyDown } from '$lib/stores/theme';
	import { movimientos, movimientoSeleccionadoDetalle, descargarPDF } from '$lib/stores/inventario';
	import {
		obtenerMovimientosCabecera,
		obtenerMovimientoDetalle
	} from '$lib/services/inventario.service2';
	import type { MovimientoCabecera, MovimientoDetalle } from '$lib/types/inventario';

	let ffini = new Date().toISOString().split('T')[0];
	let ffin = new Date().toISOString().split('T')[0];
	let idEstacion = '8';

	let searchQuery = '';

	let loadingDetalle = false;

	let currentPage = 1;
	const itemsPerPage = 10;

	$: filteredMovimientos = $movimientos.filter((m) => {
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
	async function buscarMovimientos() {
		await obtenerMovimientosCabecera(ffini, ffin, idEstacion);
		currentPage = 1;
	}

	onMount(() => {
		buscarMovimientos();
	});

	async function verDetalle(mov: MovimientoCabecera) {
		openModal('DETALLE', mov);
		loadingDetalle = true;
		await obtenerMovimientoDetalle(mov.id_transaccion);
		loadingDetalle = false;
	}

	function editarMovimiento(mov: MovimientoCabecera) {
		openModal('EDITAR', { ...mov });
	}

	function guardarEdicion() {
		alert('Guardar edición no implementado aún.');
		closeModal();
	}

	function changePage(delta: number) {
		currentPage = Math.max(1, Math.min(totalPages, currentPage + delta));
	}
</script>

<svelte:window on:keydown={handleModalKeyDown} />

<div
	class={`p-6 pb-6 bg-slate-900 min-h-full transition-colors
    ${$dark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'}
  `}
>
	<div class="sm:flex-row gap-4 pb-6 flex flex-col justify-between">
		<h2 class="text-lg font-bold">Monitoreo Movimientos de Inventario</h2>
		<span class="text-sm text-gray-500">
			Herramientas/ Inventario/
			<a
				href="/tools/follow-up"
				class={`
          ${$dark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-800'}
        `}
			>
				Seguimiento
			</a>
		</span>
	</div>

	<div
		class={`rounded-lg shadow p-6 border transition-colors
      ${$dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}
	>
		<h3 class="text-md text-lg font-medium mb-6">Monitoreo Movimientos de Inventario</h3>

		<div class="md:grid-cols-6 gap-4 mb-6 grid grid-cols-1 items-end">
			<div>
				<label for="fecha-inicio" class="text-xs font-semibold mb-1 block uppercase">Del :</label>
				<input
					id="fecha-inicio"
					type="date"
					bind:value={ffini}
					class={`rounded-md px-3 py-2 text-sm w-full border
            ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}
          `}
				/>
			</div>

			<div>
				<label for="fecha-fin" class="text-xs font-semibold mb-1 block uppercase">Al :</label>
				<input
					id="fecha-fin"
					type="date"
					bind:value={ffin}
					class={`rounded-md px-3 py-2 text-sm w-full border
            ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}
          `}
				/>
			</div>

			<div class="md:col-span-2 lg:col-span-3">
				<label for="estacion-servicio" class="text-xs font-semibold mb-1 block uppercase"
					>Estación de Servicio :</label
				>
				<select
					id="estacion-servicio"
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
									>{mov.fecha ? new Date(mov.fecha + 'T00:00:00').toLocaleDateString() : '-'}</td
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
											on:click={() => descargarPDF(mov, idEstacion)}
											title="PDF"
											class="text-gray-500 hover:text-gray-700 transition"
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
													d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
												/>
											</svg>
										</button>
										<button
											on:click={() => verDetalle(mov)}
											title="Ver Detalle"
											class="text-gray-500 hover:text-gray-700 transition"
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
													d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
												/>
											</svg>
										</button>
										<button
											on:click={() => editarMovimiento(mov)}
											title="Editar"
											class="text-gray-500 hover:text-gray-700 transition"
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
										<button
											aria-label="Enviado"
											title="Enviar"
											class="text-gray-500 hover:text-gray-700 transition"
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
													d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
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
{#if $modalState.view === 'DETALLE' && $modalState.data}
	<div class="inset-0 bg-black/50 backdrop-blur-sm fixed z-50 flex items-center justify-center">
		<div
			class={`max-w-4xl rounded-lg p-6 shadow-xl max-h-[90vh] w-full overflow-y-auto
    ${$dark ? 'bg-gray-800 text-gray-200 border-gray-700 border' : 'bg-white text-gray-700'}
  `}
		>
			<div class="mb-4 pb-2 border-gray-500/30 flex items-center justify-between border-b">
				<h3 class="text-xl font-bold">
					Detalle de Movimiento #{$modalState.data.id_transaccion}
				</h3>
				<button on:click={closeModal} class="text-2xl hover:text-red-500">&times;</button>
			</div>

			<div class="md:grid-cols-4 gap-4 mb-6 text-sm grid grid-cols-2">
				<div>
					<span class="font-bold block opacity-70">Fecha:</span>
					{$modalState.data.fecha}
				</div>
				<div>
					<span class="font-bold block opacity-70">Tipo:</span>
					{$modalState.data.transaccion_tipo}
				</div>
				<div>
					<span class="font-bold block opacity-70">Estado:</span>
					{$modalState.data.estado}
				</div>
				<div>
					<span class="font-bold block opacity-70">Usuario:</span>
					{$modalState.data.usuario}
				</div>
				<div class="md:col-span-2">
					<span class="font-bold block opacity-70">Referencia:</span>
					{$modalState.data.referencia || '-'}
				</div>
				<div class="md:col-span-2">
					<span class="font-bold block opacity-70">Proveedor/Origen:</span>
					{$modalState.data.prov || $modalState.data.origen}
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
					on:click={closeModal}
					class="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
				>
					Cerrar
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL EDITAR -->
{#if $modalState.view === 'EDITAR' && $modalState.data}
	<div class="inset-0 bg-black/50 backdrop-blur-sm fixed z-50 flex items-center justify-center">
		<div
			class={`max-w-lg rounded-lg p-6 shadow-xl w-full
    ${$dark ? 'bg-gray-800 text-gray-200 border-gray-700 border' : 'bg-white text-gray-700'}
  `}
		>
			<h3 class="text-lg font-semibold mb-4">
				Editar Movimiento #{$modalState.data.id_transaccion}
			</h3>

			<div class="space-y-4">
				<div>
					<label for="edit-referencia" class="text-sm font-medium mb-1 block">Referencia</label>
					<input
						id="edit-referencia"
						bind:value={$modalState.data.referencia}
						class="input px-3 py-2 rounded w-full border bg-transparent"
					/>
				</div>
				<div>
					<label for="edit-usuario" class="text-sm font-medium mb-1 block">Usuario</label>
					<input
						id="edit-usuario"
						bind:value={$modalState.data.usuario}
						class="input px-3 py-2 rounded w-full border bg-transparent"
					/>
				</div>
				<!-- Add more fields as needed -->
			</div>

			<div class="gap-2 mt-6 flex justify-end">
				<button
					on:click={closeModal}
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
