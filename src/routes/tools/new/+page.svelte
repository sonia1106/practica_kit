<script lang="ts">
	import { onMount } from 'svelte';
	import { dark } from '$lib/stores/theme';
	import { authStore } from '$lib/stores/auth';
	import { clientes } from '$lib/stores/clientes';
	import { obtenerClientes } from '$lib/services/clientes.service';
	import { items, tanques } from '$lib/stores/inventario';
	import {
		obtenerItems,
		obtenerTanques,
		registrarMovimiento
	} from '$lib/services/inventario.service';
	import type { ProductoMovimientoDTO, MovimientoRegistroDTO } from '$lib/types/inventario';

	let tipoDocumentoSeleccionado = '';
	let estacion = 'ESTACION DE SERVICIO LUCIFER';
	let idEstacion = '8';

	let proveedorSeleccionado = '';
	// Calculate local date string YYYY-MM-DD
	const now = new Date();
	const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

	let fechaDespacho = localDate;
	let nroDespacho = Math.floor(Math.random() * 10000).toString();
	let nroOrden = '';
	let placaCisterna = '';
	let conductor = '';
	let volumenPlanta = '';
	let nroFactura = Math.floor(Math.random() * 10000).toString();
	let nroAutorizacion = Math.floor(Math.random() * 10000).toString();
	let codigoControl = '';

	let fechaRecepcion = localDate;
	let grupoSeleccionado = 1;
	let tanqueSeleccionadoId = 0;
	let productoSeleccionadoId = 0;
	let precioCosto = 0;
	let volRecibido = 0;

	let movimientoItems: ProductoMovimientoDTO[] = [];

	$: productoSeleccionado = $items.find((i) => i.id_item === productoSeleccionadoId);
	$: tanqueSeleccionado = $tanques.find((t) => t.id_tanques === tanqueSeleccionadoId);
	$: importeCalculado = (precioCosto * volRecibido).toFixed(2);
	$: totalGeneral = movimientoItems.reduce((sum, item) => sum + item.monto_total, 0);

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
			precio: precioCosto.toFixed(2),
			producto: productoSeleccionado?.descripcion || 'Desconocido',
			tanque: tanqueSeleccionado?.descripcion || 'Desconocido',
			tipo: 1
		};

		movimientoItems = [...movimientoItems, newItem];

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

		// Validar usuario
		const userId = $authStore.user?.id || 46;
		console.log('👤 ID Usuario usado:', userId);

		// Generar identificadores aleatorios para asegurar unicidad en pruebas
		const randomId = Math.floor(Math.random() * 100000).toString();

		const payload: MovimientoRegistroDTO = {
			bancarizacion: '',
			codigo_control: codigoControl || 'S/N',
			conductor: conductor || 'TEST',
			destino: estacion.split(' ').join('+'),
			fecha_factura: fechaDespacho, // YYYY-MM-DD
			fecha_venta: fechaRecepcion, // YYYY-MM-DD
			grupoProducto: 1,
			id_antena: 0,
			id_autorizacion: 0,
			id_banco: 0,
			id_consumidor: 1,
			id_estacion: idEstacion,
			id_liquidacion: 0,
			id_transaccion_tipo: '2',
			id_usuario: 46, // HARDCODED 46
			monto_total: totalGeneral,
			nro_autorizacion: nroAutorizacion || randomId,
			nro_despacho: nroDespacho || randomId,
			nro_factura: nroFactura || randomId,
			nro_orden: nroOrden || randomId,
			nro_trans_banco: '',
			numero: '',
			observaciones: 'SOLO_PRUEBA_HARDCODED_USER_46',
			placa_cisterna: placaCisterna || 'TEST-999',
			precintos: 'S/N',
			productos: movimientoItems.map((item) => ({
				...item,
				// Asegurar que sean strings si el DTO lo pide
				cantidad: item.cantidad.toString(),
				id: item.id.toString(),
				id_tanque: item.id_tanque.toString(),
				precio: item.precio.toString()
			})),
			tipo: '1',
			tipo_documento: 0,
			tipo_emisor: 1,
			volumen_planta: volumenPlanta || '0'
		};

		console.log('📦 Payload JSON:', JSON.stringify(payload, null, 2));

		try {
			await registrarMovimiento(payload);
			alert('Movimiento registrado exitosamente');
			movimientoItems = [];
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
	<div class="sm:flex-row gap-4 pb-6 flex flex-col justify-between">
		<h2 class="text-lg font-bold">Registro de Inventario</h2>
		<span class="text-sm text-gray-500">
			Herramientas/ Inventario/
			<a
				href="/tools/new"
				class={`
          ${$dark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-800'}
        `}
			>
				Nuevo
			</a>
		</span>
	</div>

	<div
		class={`rounded-lg shadow overflow-hidden border transition-colors
      ${$dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}
	>
		<div class="p-4 md:p-6 space-y-8">
			<div class="md:grid-cols-2 gap-4 md:gap-6 grid grid-cols-1">
				<div class="sm:flex-row sm:items-center gap-2 flex flex-col">
					<label for="estacion" class="sm:w-32 lg:w-40 text-sm font-medium">Estación :</label>
					<select
						id="estacion"
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
					<label for="tipo-documento" class="sm:w-32 lg:w-40 text-sm font-medium"
						>Tipo de Documento :</label
					>
					<select
						id="tipo-documento"
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
							<label for="proveedor" class="text-sm font-medium">Proveedor :</label>
							<select
								id="proveedor"
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
							<label for="fecha-despacho" class="text-sm font-medium">Fecha Despacho :</label>
							<input
								id="fecha-despacho"
								type="date"
								bind:value={fechaDespacho}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label for="nro-factura" class="text-sm font-medium">Nro. Factura :</label>
							<input
								id="nro-factura"
								type="text"
								bind:value={nroFactura}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label for="nro-autorizacion" class="text-sm font-medium">Nro. Autorización :</label>
							<input
								id="nro-autorizacion"
								type="text"
								bind:value={nroAutorizacion}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label for="codigo-control" class="text-sm font-medium">Cod. Control :</label>
							<input
								id="codigo-control"
								type="text"
								bind:value={codigoControl}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label for="nro-despacho" class="text-sm font-medium">Nro. Despacho :</label>
							<input
								id="nro-despacho"
								type="text"
								bind:value={nroDespacho}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label for="nro-orden" class="text-sm font-medium">Nro. Orden :</label>
							<input
								id="nro-orden"
								type="text"
								bind:value={nroOrden}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label for="placa-cisterna" class="text-sm font-medium">Placa Cisterna :</label>
							<input
								id="placa-cisterna"
								type="text"
								bind:value={placaCisterna}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label for="conductor" class="text-sm font-medium">Conductor :</label>
							<input
								id="conductor"
								type="text"
								bind:value={conductor}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 flex flex-col">
							<label for="volumen-planta" class="text-sm font-medium">Volumen Planta :</label>
							<input
								id="volumen-planta"
								type="text"
								bind:value={volumenPlanta}
								class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
							/>
						</div>

						<div class="gap-1 sm:col-span-2 flex flex-col">
							<label for="destino" class="text-sm font-medium">Destino :</label>
							<input
								id="destino"
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
						<label for="fecha-recepcion" class="text-sm font-medium">Fecha Recepción :</label>
						<input
							id="fecha-recepcion"
							type="date"
							bind:value={fechaRecepcion}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						/>
					</div>

					<div class="gap-1 flex flex-col">
						<label for="grupo" class="text-sm font-medium">Grupo :</label>
						<select
							id="grupo"
							bind:value={grupoSeleccionado}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						>
							<option value={1}>COMBUSTIBLE</option>
							<option value={2}>LUBRICANTES</option>
						</select>
					</div>

					<div class="gap-1 flex flex-col">
						<label for="tanque" class="text-sm font-medium">Tanque :</label>
						<select
							id="tanque"
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
						<label for="producto" class="text-sm font-medium">Producto :</label>
						<select
							id="producto"
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
						<label for="precio-costo" class="text-sm font-medium">Precio Costo :</label>
						<input
							id="precio-costo"
							type="number"
							step="0.01"
							bind:value={precioCosto}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						/>
					</div>

					<div class="gap-1 flex flex-col">
						<label for="vol-recibido" class="text-sm font-medium">Vol. Recibido :</label>
						<input
							id="vol-recibido"
							type="number"
							step="0.01"
							bind:value={volRecibido}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
						/>
					</div>

					<div class="gap-1 flex flex-col">
						<label for="importe" class="text-sm font-medium">Importe :</label>
						<input
							id="importe"
							readonly
							value={importeCalculado}
							class={`rounded-md px-3 py-2 text-sm border ${$dark ? 'bg-gray-600 border-gray-600' : 'bg-gray-200 border-gray-300'}`}
						/>
					</div>

					<div class="flex items-end">
						<button
							on:click={agregarItem}
							class="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 w-full transition-colors"
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
					class="px-6 py-2 rounded-md bg-orange-400 text-white font-medium hover:bg-orange-500 shadow-lg transition-colors"
				>
					Guardar Movimiento
				</button>
			</div>
		</div>
	</div>
</div>
