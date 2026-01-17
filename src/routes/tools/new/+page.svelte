<script lang="ts">
	import { onMount } from 'svelte';
	import { dark } from '$lib/stores/theme';
	import { clientes } from '$lib/stores/clientes';
	import { obtenerClientes } from '$lib/services/clientes.service';
	import { items, tanques } from '$lib/stores/inventario';
	import {
		obtenerItems,
		obtenerTanques,
		registrarMovimiento
	} from '$lib/services/inventario.service';
	import type { ProductoMovimientoDTO, MovimientoRegistroDTO } from '$lib/types/inventario';

	// Form State
	let tipoDocumentoSeleccionado = '';
	let estacion = 'ESTACION DE SERVICIO LUCIFER';
	let idEstacion = '8'; // Hardcoded per requirement? Or derived? '8' was in valid payload

	// Transport Detail
	let proveedorSeleccionado = '';
	let fechaDespacho = new Date().toISOString().split('T')[0];
	let nroDespacho = '';
	let nroOrden = '';
	let placaCisterna = '';
	let conductor = '';
	let volumenPlanta = '';
	let nroFactura = '';
	let nroAutorizacion = '';
	let codigoControl = '';

	// Reception Detail (Line Item)
	let fechaRecepcion = new Date().toISOString().split('T')[0];
	let grupoSeleccionado = 1; // 1: Combustible
	let tanqueSeleccionadoId = 0;
	let productoSeleccionadoId = 0;
	let precioCosto = 0;
	let volRecibido = 0;

	// List of items
	let movimientoItems: ProductoMovimientoDTO[] = [];

	// Computed
	$: productoSeleccionado = $items.find((i) => i.id_item === productoSeleccionadoId);
	$: tanqueSeleccionado = $tanques.find((t) => t.id_tanques === tanqueSeleccionadoId);
	$: importeCalculado = (precioCosto * volRecibido).toFixed(2);
	$: totalGeneral = movimientoItems.reduce((sum, item) => sum + item.monto_total, 0);

	// Handlers
	onMount(async () => {
		await Promise.all([obtenerClientes(), obtenerItems(), obtenerTanques(idEstacion)]);
	});

	function agregarItem() {
		if (!productoSeleccionadoId || volRecibido <= 0 || !tanqueSeleccionadoId) {
			alert('Seleccione un producto, tanque y cantidad válida');
			return;
		}

		const newItem: ProductoMovimientoDTO = {
			id: productoSeleccionadoId.toString(),
			id_tanque: tanqueSeleccionadoId.toString(),
			cantidad: volRecibido.toString(),
			monto_total: parseFloat(importeCalculado),
			precio: precioCosto.toFixed(2), // API expects string
			producto: productoSeleccionado?.descripcion || 'Desconocido',
			tanque: tanqueSeleccionado?.descripcion || 'Desconocido',
			tipo: 1
		};

		movimientoItems = [...movimientoItems, newItem];

		// Reset item fields
		volRecibido = 0;
		precioCosto = 0;
		productoSeleccionadoId = 0;
		tanqueSeleccionadoId = 0;
	}

	function eliminarItem(index: number) {
		movimientoItems = movimientoItems.filter((_, i) => i !== index);
	}

	async function guardarMovimiento() {
		if (movimientoItems.length === 0) {
			alert('Debe agregar al menos un item');
			return;
		}

		const payload: MovimientoRegistroDTO = {
			bancarizacion: '',
			codigo_control: codigoControl,
			conductor: conductor,
			destino: estacion.split(' ').join('+'), // Encode? Payload example had +
			fecha_factura: fechaDespacho, // Using Despacho as Factura date based on example?
			fecha_venta: fechaRecepcion,
			grupoProducto: 1, // hardcoded per example
			id_antena: 0,
			id_autorizacion: 0,
			id_banco: 0,
			id_consumidor: 1, // hardcoded per example?
			id_estacion: idEstacion,
			id_liquidacion: 0,
			id_transaccion_tipo: '2',
			id_usuario: 46, // hardcoded per example
			monto_total: totalGeneral,
			nro_autorizacion: nroAutorizacion,
			nro_despacho: nroDespacho,
			nro_factura: nroFactura,
			nro_orden: nroOrden,
			nro_trans_banco: '',
			numero: '',
			observaciones: 'REGISTRO MANUAL',
			placa_cisterna: placaCisterna,
			precintos: '', // Add field if needed
			productos: movimientoItems,
			tipo: '1',
			tipo_documento: 0,
			tipo_emisor: 1,
			volumen_planta: volumenPlanta
		};

		try {
			await registrarMovimiento(payload);
			alert('Movimiento registrado exitosamente');
			movimientoItems = [];
			// Reset header fields if needed
		} catch (e) {
			console.error(e);
			alert('Error al registrar movimiento');
		}
	}
</script>

<div
	class={`p-4 md:p-6 min-h-screen transition-colors
    ${$dark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'}
  `}
>
	<h1 class="text-xl font-semibold mb-4">Registro Inventario</h1>

	<div
		class={`rounded-lg shadow overflow-hidden border transition-colors
      ${$dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}
	>
		<div class="p-4 md:p-6 space-y-8">
			<div class="md:grid-cols-2 gap-4 md:gap-6 grid grid-cols-1">
				<div class="sm:flex-row sm:items-center gap-2 flex flex-col">
					<label class="sm:w-32 lg:w-40 text-sm font-medium">Estación :</label>
					<select
						bind:value={estacion}
						disabled
						class={`rounded-md px-3 py-2 text-sm w-full flex-1 border
            ${$dark ? 'bg-gray-600 border-gray-600' : 'bg-gray-200 border-gray-300'}
          `}
					>
						<option>ESTACION DE SERVICIO LUCIFER</option>
					</select>
				</div>

				<div class="sm:flex-row sm:items-center gap-2 flex flex-col">
					<label class="sm:w-32 lg:w-40 text-sm font-medium">Tipo de Documento :</label>
					<select
						bind:value={tipoDocumentoSeleccionado}
						class={`rounded-md px-3 py-2 text-sm w-full flex-1 border
              ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}
            `}
					>
						<option value="">-- Seleccione un documento --</option>
						<option value="factura">Factura</option>
						<option value="remision">Guía de Remisión</option>
					</select>
				</div>
			</div>

			{#if tipoDocumentoSeleccionado !== ''}
				<div class="space-y-4 pt-4 transition-all duration-300">
					<h3
						class={`font-semibold pb-2 border-b ${$dark ? 'border-gray-700' : 'border-gray-200'}`}
					>
						Detalle transporte
					</h3>

					<div class="sm:grid-cols-2 lg:grid-cols-3 gap-4 grid grid-cols-1">
						<div class="gap-1 lg:col-span-1 flex flex-col">
							<label class="text-sm font-medium">Proveedor :</label>
							<select
								bind:value={proveedorSeleccionado}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							>
								<option value="">-- Seleccione Proveedor --</option>
								{#each $clientes as cliente}
									<option value={cliente.razon_social}>{cliente.razon_social}</option>
								{/each}
							</select>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Fecha Despacho :</label>
							<input
								type="date"
								bind:value={fechaDespacho}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Nro. Factura :</label>
							<input
								type="text"
								bind:value={nroFactura}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Nro. Autorización :</label>
							<input
								type="text"
								bind:value={nroAutorizacion}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Cod. Control :</label>
							<input
								type="text"
								bind:value={codigoControl}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Nro. Despacho :</label>
							<input
								type="text"
								bind:value={nroDespacho}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Nro. Orden :</label>
							<input
								type="text"
								bind:value={nroOrden}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Placa Cisterna :</label>
							<input
								type="text"
								bind:value={placaCisterna}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Conductor :</label>
							<input
								type="text"
								bind:value={conductor}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label class="text-sm font-medium">Volumen Planta :</label>
							<input
								type="text"
								bind:value={volumenPlanta}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 sm:col-span-2 flex flex-col">
							<label class="text-sm font-medium">Destino :</label>
							<input
								readonly
								value={estacion}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-600 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
							/>
						</div>
					</div>
				</div>
			{/if}

			<div class="space-y-4">
				<h3 class={`font-semibold pb-2 border-b ${$dark ? 'border-gray-700' : 'border-gray-200'}`}>
					Detalle Recepción
				</h3>

				<div class="sm:grid-cols-2 lg:grid-cols-4 gap-4 grid grid-cols-1">
					<div class="gap-1 flex flex-col">
						<label class="text-sm font-medium">Fecha Recepción :</label>
						<input
							type="date"
							bind:value={fechaRecepcion}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						/>
					</div>

					<div class="gap-1 flex flex-col">
						<label class="text-sm font-medium">Grupo :</label>
						<select
							bind:value={grupoSeleccionado}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						>
							<option value={1}>COMBUSTIBLE</option>
							<option value={2}>LUBRICANTES</option>
						</select>
					</div>

					<div class="gap-1 flex flex-col">
						<label class="text-sm font-medium">Tanque :</label>
						<select
							bind:value={tanqueSeleccionadoId}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						>
							<option value={0}>Seleccione Tanque</option>
							{#each $tanques as tanque}
								<option value={tanque.id_tanques}>{tanque.descripcion}</option>
							{/each}
						</select>
					</div>

					<div class="gap-1 flex flex-col">
						<label class="text-sm font-medium">Producto :</label>
						<select
							bind:value={productoSeleccionadoId}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						>
							<option value={0}>-- Seleccione Producto --</option>
							{#each $items as item}
								<option value={item.id_item}>{item.descripcion}</option>
							{/each}
						</select>
					</div>

					<div class="gap-1 flex flex-col">
						<label class="text-sm font-medium">Precio Costo :</label>
						<input
							type="number"
							step="0.01"
							bind:value={precioCosto}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						/>
					</div>

					<div class="gap-1 flex flex-col">
						<label class="text-sm font-medium">Vol. Recibido :</label>
						<input
							type="number"
							step="0.01"
							bind:value={volRecibido}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						/>
					</div>

					<div class="gap-1 flex flex-col">
						<label class="text-sm font-medium">Importe :</label>
						<input
							readonly
							value={importeCalculado}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-600 border-gray-600' : 'bg-gray-200 border-gray-300'}`}
						/>
					</div>

					<div class="flex items-end">
						<button
							on:click={agregarItem}
							class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 w-full transition-colors"
						>
							+ Agregar
						</button>
					</div>
				</div>
			</div>

			<div class="mt-6">
				<div
					class={`rounded-xl overflow-hidden border
            ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
				>
					<table class="text-sm w-full min-w-[700px] border-collapse">
						<thead>
							<tr
								class={`border-b text-center transition-colors duration-300
                      ${$dark ? 'border-gray-600' : 'border-gray-300'}`}
							>
								<th class="px-3 py-3 text-left">Id</th>
								<th class="px-3 py-3 text-left">Tanque</th>
								<th class="px-3 py-3 text-left">Id Prod</th>
								<th class="px-3 py-3 text-left">Producto</th>
								<th class="px-3 py-3 text-center">Costo</th>
								<th class="px-3 py-3 text-center">Cantidad</th>
								<th class="px-3 py-3 text-right">Total</th>
								<th class="px-3 py-3 text-center">Eliminar</th>
							</tr>
						</thead>
						<tbody class="divide-y ${$dark ? 'divide-gray-700' : 'divide-gray-200'}">
							{#each movimientoItems as item, i}
								<tr class={`${$dark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
									<td class="px-3 py-3 text-center">{i + 1}</td>
									<td class="px-3 py-3">{item.tanque}</td>
									<td class="px-3 py-3 text-center">{item.id}</td>
									<td class="px-3 py-3 font-medium">{item.producto}</td>
									<td class="px-3 py-3 text-center">{item.precio}</td>
									<td class="px-3 py-3 text-center">{item.cantidad}</td>
									<td class="px-3 py-3 font-semibold text-right"
										>{item.monto_total.toLocaleString('en-US', {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										})}</td
									>
									<td class="px-3 py-3 text-lg cursor-pointer text-center">
										<button on:click={() => eliminarItem(i)}>🗑️</button>
									</td>
								</tr>
							{/each}
							{#if movimientoItems.length === 0}
								<tr>
									<td colspan="8" class="px-3 py-8 text-gray-500 text-center"
										>No hay items registrados</td
									>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>

			<div class="mt-4 flex justify-end">
				<div class="gap-2 flex items-center">
					<span class="font-semibold">Total :</span>
					<input
						readonly
						class={`w-48 rounded-md px-3 py-2 border text-right
            ${
							$dark
								? 'bg-gray-700 border-gray-600 text-gray-200'
								: 'bg-gray-100 border-gray-300 text-gray-700'
						}
          `}
						value={totalGeneral.toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					/>
				</div>
			</div>

			<div class="mt-4 flex justify-end">
				<button
					on:click={guardarMovimiento}
					class="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg transition-colors"
				>
					Guardar Movimiento
				</button>
			</div>
		</div>
	</div>
</div>
