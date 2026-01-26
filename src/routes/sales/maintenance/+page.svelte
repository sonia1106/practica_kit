<script lang="ts">
	import { facturacionService } from '$lib/services/facturacion.service';
	import { reporteVentas } from '$lib/stores/facturacion';
	import type { TransaccionVenta } from '$lib/types/facturacion';
	import { dark } from '$lib/stores/theme';

	// Search parameters
	let ffini = new Date().toISOString().split('T')[0];
	let ffin = new Date().toISOString().split('T')[0];
	let idEstacion = '8';

	// Pagination state
	let itemsPerPage = 10;
	let currentPage = 1;

	// Computed pagination
	$: totalPages = Math.ceil($reporteVentas.length / itemsPerPage);
	$: paginatedMovimientos = $reporteVentas.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function changePage(delta: number) {
		currentPage += delta;
	}

	async function buscarMovimientos() {
		try {
			await facturacionService.obtenerReporteLibroVentas(ffini, ffin, idEstacion);
			currentPage = 1;
		} catch (error) {
			console.error('Error cargando transacciones', error);
		}
	}
</script>

<div
	class={`p-6 pb-6 bg-slate-900 min-h-full transition-colors
    ${$dark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'}
  `}
>
	<div class="sm:flex-row gap-4 pb-6 flex flex-col justify-between">
		<h2 class="text-lg font-bold">Monitoreo de transacciones</h2>
		<span class="text-sm text-gray-500">
			Herramientas/ Ventas/
			<a
				href="/sales/maintenance"
				class={`
          ${$dark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-800'}
        `}
			>
				Mantenimiento
			</a>
		</span>
	</div>

	<div
		class={`rounded-lg shadow p-6 border transition-colors
      ${$dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}
	>
		<h3 class="text-md text-lg font-medium mb-6">Transacciones</h3>

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
				<label
					for="estacion-servicio"
					class={`mb-1 text-xs font-medium block uppercase
					${$dark ? 'text-gray-400' : 'text-gray-500'}`}
				>
					Estación de Servicio :
				</label>
				<select
					id="estacion-servicio"
					bind:value={idEstacion}
					class={`rounded-md px-3 py-2 text-sm w-full border
					  focus:ring-2 focus:outline-none
					  ${
							$dark
								? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500'
								: 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'
						}
					`}
				>
					<option value="8">ESTACION DE SERVICIO PIRAI SRL</option>
				</select>
			</div>

			<div class="gap-2 flex">
				<button
					on:click={buscarMovimientos}
					class="px-4 py-2 rounded-md bg-amber-500 text-white text-sm hover:bg-amber-600 shadow-sm transition-colors"
				>
					Ver Registros
				</button>
				<button
					on:click={buscarMovimientos}
					class={`font-medium py-2 px-4 rounded-md shadow-sm border transition-colors
                            ${$dark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'}`}
				>
					Principal
				</button>
			</div>
		</div>

		<!-- Search / Filter Row Placeholder -->
		<div class="gap-2 mt-6 pb-6 flex items-center overflow-x-auto">
			<div class="text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class={`h-6 w-6 ${$dark ? 'text-gray-400' : 'text-gray-600'}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<div
				class={`gap-0 text-xs font-semibold grid w-full min-w-[1000px] grid-cols-9 border uppercase
                ${$dark ? 'border-gray-600 text-gray-400' : 'border-gray-400 text-gray-500'}
            `}
			>
				<input
					type="text"
					placeholder="ID.VTA."
					class={`px-2 py-1 border-r outline-none ${$dark ? 'bg-gray-700 border-gray-600 placeholder-gray-500 text-gray-200' : 'bg-white border-gray-300 placeholder-gray-400'}`}
				/>
				<input
					type="text"
					placeholder="No. Autorización"
					class={`px-2 py-1 col-span-2 border-r outline-none ${$dark ? 'bg-gray-700 border-gray-600 placeholder-gray-500 text-gray-200' : 'bg-white border-gray-300 placeholder-gray-400'}`}
				/>
				<input
					type="text"
					placeholder="No. Factura"
					class={`px-2 py-1 border-r outline-none ${$dark ? 'bg-gray-700 border-gray-600 placeholder-gray-500 text-gray-200' : 'bg-white border-gray-300 placeholder-gray-400'}`}
				/>
				<input
					type="text"
					placeholder="CLIENTE"
					class={`px-2 py-1 col-span-2 border-r outline-none ${$dark ? 'bg-gray-700 border-gray-600 placeholder-gray-500 text-gray-200' : 'bg-white border-gray-300 placeholder-gray-400'}`}
				/>
				<input
					type="text"
					placeholder="NIT"
					class={`px-2 py-1 border-r outline-none ${$dark ? 'bg-gray-700 border-gray-600 placeholder-gray-500 text-gray-200' : 'bg-white border-gray-300 placeholder-gray-400'}`}
				/>
				<input
					type="text"
					placeholder="MANG."
					class={`px-2 py-1 border-r outline-none ${$dark ? 'bg-gray-700 border-gray-600 placeholder-gray-500 text-gray-200' : 'bg-white border-gray-300 placeholder-gray-400'}`}
				/>
				<input
					type="text"
					placeholder="ESTADO"
					class={`px-2 py-1 outline-none ${$dark ? 'bg-gray-700 placeholder-gray-500 text-gray-200' : 'bg-white placeholder-gray-400'}`}
				/>
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
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">N°</th>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">ID</th>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">TV</th>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">Fecha</th>
							<th class="px-4 py-3 font-medium text-xs text-left uppercase">Autorización</th>
							<th class="px-4 py-3 font-medium text-xs text-center uppercase">Factura</th>
							<th class="px-4 py-3 font-medium text-xs text-right uppercase">NIT</th>
							<th class="px-4 py-3 font-medium text-xs text-center uppercase">Cliente</th>
							<th class="px-4 py-3 font-medium text-xs text-center uppercase">Manguera</th>
							<th class="px-4 py-3 font-medium text-xs text-center uppercase">Total</th>
							<th class="px-4 py-3 font-medium text-xs text-right uppercase">Est.</th>
							<th class="px-4 py-3 font-medium text-xs text-center uppercase">LV</th>
						</tr>
					</thead>
					<tbody class={`divide-y ${$dark ? 'divide-gray-600' : 'divide-gray-200'}`}>
						{#each paginatedMovimientos as mov, index}
							<tr class={`hover:bg-opacity-50 ${$dark ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}>
								<td class="p-2 text-red-500 font-medium normal-case"
									>{(currentPage - 1) * itemsPerPage + index + 1}</td
								>
								<td class="p-2 px-4">{mov.id_transaccion}</td>
								<td class="p-2 px-4">{mov.desc_tfactura || '-'}</td>
								<td class="p-2 px-4">{mov.fecha_venta}</td>
								<td class="p-2 px-4">{mov.nro_autorizacion}</td>
								<td class="p-2 px-4 text-center">{mov.nro_factura}</td>
								<td class="p-2 px-4 text-right">{mov.nit}</td>
								<td class="p-2 px-4 text-center">{mov.nombre_factura}</td>
								<td class="p-2 px-4 text-center">{mov.manguera}</td>
								<td class="p-2 px-4 text-center"
									>{mov.monto_total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td
								>
								<td class="p-2 px-4 text-right">{mov.estado}</td>
								<td class="p-2 px-4 text-center">{mov.tipo_credito_fiscal || '-'}</td>
							</tr>
						{/each}
						{#if paginatedMovimientos.length === 0}
							<tr>
								<td colspan="12" class="px-4 py-8 text-gray-500 text-center"
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
