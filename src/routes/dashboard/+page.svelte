<script lang="ts">
	import { onMount } from 'svelte';
	// Using MOCK service for local development (no backend API needed)
	import { obtenerPrecios } from '$lib/services/precios.service.mock';
	import type { Precio } from '$lib/types/precios';
	import { dark } from '$lib/stores/theme';

	let loading = true;
	let error = '';
	let precios: Precio[] = [];

	onMount(async () => {
		try {
			precios = await obtenerPrecios();
			loading = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error al cargar precios';
			loading = false;
			console.error('Error loading prices:', e);
		}
	});
</script>

<section
	class={`
      p-4 md:p-6 min-h-screen w-full
      ${$dark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'}
    `}
>
	<div class="sm:flex-row gap-4 flex flex-col justify-between">
		<h2 class="text-lg font-bold">Precios de Productos</h2>
		<span class="text-sm text-gray-500">
			Dashboard/
			<a
				href="/dashboard"
				class={`
          ${$dark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-800'}
        `}
			>
				Precios
			</a>
		</span>
	</div>

	<div
		class={`rounded-lg mt-6 p-4 md:p-6 border
        ${
					$dark
						? 'bg-gray-800 border-gray-700 text-white'
						: 'bg-white border-gray-200 text-gray-700'
				}`}
	>
		<div class="mb-4 -mt-2 flex items-center justify-between">
			<h3 class="text-md font-medium">Lista de Precios</h3>
			<button
				class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
			>
				Actualizar Precios
			</button>
		</div>

		{#if loading}
			<div class="py-12 flex items-center justify-center">
				<div class={$dark ? 'text-gray-400' : 'text-gray-600'}>Cargando precios...</div>
			</div>
		{:else if error}
			<div
				class={`p-4 rounded-lg border ${$dark ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}
			>
				{error}
			</div>
		{:else if precios.length === 0}
			<div
				class={`p-4 rounded-lg border ${$dark ? 'bg-yellow-900/20 border-yellow-800 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}
			>
				No hay precios disponibles
			</div>
		{:else}
			<div
				class={`rounded-xl overflow-x-auto border
        ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
			>
				<table class="text-sm w-full min-w-[1000px]">
					<thead>
						<tr
							class={`border-b text-center transition-colors duration-300
                  ${$dark ? 'border-gray-600' : 'border-gray-300'}`}
						>
							<th
								class={`px-6 py-3 text-xs font-medium text-left uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
							>
								Producto
							</th>
							<th
								class={`px-6 py-3 text-xs font-medium text-left uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
							>
								Tipo
							</th>
							<th
								class={`px-6 py-3 text-xs font-medium text-left uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
							>
								Precio
							</th>
							<th
								class={`px-6 py-3 text-xs font-medium text-left uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
							>
								Fecha Actualización
							</th>
						</tr>
					</thead>

					<tbody>
						{#each precios as precio}
							<tr class={`border-b last:border-0 ${$dark ? 'border-gray-600' : 'border-gray-100'}`}>
								<td class="px-6 py-4">{precio.producto}</td>
								<td class="px-6 py-4">
									<span
										class={`px-2.5 py-0.5 text-xs font-medium inline-flex items-center rounded-full ${
											precio.tipo === 'NACIONAL'
												? $dark
													? 'bg-blue-900/30 text-blue-400'
													: 'bg-blue-100 text-blue-800'
												: $dark
													? 'bg-purple-900/30 text-purple-400'
													: 'bg-purple-100 text-purple-800'
										}`}
									>
										{precio.tipo}
									</span>
								</td>
								<td class="px-6 py-4 font-semibold">
									{precio.precio > 0 ? precio.precio.toFixed(2) : '-'}
								</td>
								<td class="px-6 py-4">
									{new Date(precio.fechaActualizacion).toLocaleString('es-BO', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit'
									})}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</section>
