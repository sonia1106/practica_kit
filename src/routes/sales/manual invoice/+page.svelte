<script lang="ts">
	import { onMount } from 'svelte';
	import { dark } from '$lib/stores/theme';
	import { facturacionService } from '$lib/services/facturacion.service';
	import { mangueras, tiposPago, tiposConsumidor } from '$lib/stores/facturacion';
	import type { MedicionResponse, FacturaManualPayload } from '$lib/types/facturacion';

	// Los stores son importados, no hay necesidad de declaraciones locales de arreglos de datos paramétricos

	// Estado del Formulario
	let fechaFactura = new Date().toISOString().split('T')[0];
	let idTipoPago = 1; // Por defecto EFECTIVO (1) usualmente
	let nroReferencia = '';
	let idManguera = 0;
	let idMedicion = 0;
	let mediciones: MedicionResponse[] = [];
	let nroAutorizacion = '';
	let nroFactura = 0;
	let precio = 0;
	let precioType: 'Nacional' | 'Internacional' = 'Nacional';
	let idConsumidor = 1; // Por defecto MOTORIZADO
	let placa = '';
	let nit = 0;
	let razonSocial = '';
	let montoTotal = 0;
	let idUsuarioAutoriza = 0; // "Vta. Autorizada Por"
	let nroHojaAutorizacion = 0;
	let tipoAnulacion = 'Emitida en Contingencia'; // Marcado por defecto
	let idEstacion = '8'; // Por defecto

	// Computado/Derivado
	$: idPrecioLista = precioType === 'Nacional' ? 1 : 2;

	// Lógica: Internacional fuerza Motorizado
	$: if (precioType === 'Internacional') {
		idConsumidor = 1; // 1 es MOTORIZADO
	}

	// MOTORIZADO (id 1)
	$: showPlaca = idConsumidor === 1;

	onMount(async () => {
		try {
			// Las llamadas al servicio actualizan los stores
			await Promise.all([
				facturacionService.obtenerMangueras(idEstacion),
				facturacionService.obtenerTipoPago(),
				facturacionService.obtenerTipoConsumidor()
			]);
		} catch (error) {
			console.error('Error loading parametric data', error);
		}
	});

	// Lógica: Obtener Precio
	async function updatePrecio() {
		if (idManguera && fechaFactura) {
			try {
				const res = await facturacionService.obtenerPrecioUnitario(
					idManguera,
					idPrecioLista,
					fechaFactura
				);
				if (res.IntCodigo === 1) {
					precio = precioType === 'Nacional' ? res.oResultado.param7 : res.oResultado.param8;
				}
			} catch (e) {
				console.error('Error fetching price', e);
			}
		}
	}
	// Reaccionar a cambios
	$: if (idManguera || fechaFactura || precioType) {
		updatePrecio();
	}

	// Lógica: Obtener Medicion
	async function cargarMediciones() {
		if (!idManguera || !fechaFactura) {
			alert('Seleccione Manguera y Fecha');
			return;
		}
		try {
			const res = await facturacionService.obtenerMedicion(idManguera, fechaFactura);
			if (res.IntCodigo === 1) {
				mediciones = res.oResultado;
			} else {
				mediciones = [];
				alert('No se encontraron mediciones: ' + res.StrMensaje);
			}
		} catch (e) {
			console.error('Error fetching measurements', e);
		}
	}

	// Lógica: Buscar Cliente (por Placa o NIT)
	async function buscarCliente() {
		const criterio = placa || String(nit);
		if (!criterio || criterio === '0') return;

		try {
			const res = await facturacionService.obtenerDatosCliente(criterio);
			if (res.IntCodigo === 1) {
				razonSocial = res.oResultado.param5;
				nit = res.oResultado.param9;
			}
		} catch (e) {
			console.error('Error fetching client', e);
		}
	}

	// Lógica: Registrar
	async function registrar(anulada = false) {
		if (!nroFactura) {
			alert('Ingrese Nro Factura');
			return;
		}

		const payload: FacturaManualPayload = {
			fecha_venta: fechaFactura,
			id_tipo_pago: idTipoPago,
			id_precio_lista: idPrecioLista,
			id_tipo_consumidor: idConsumidor,
			id_manguera: idManguera,
			nit: nit,
			nombre_factura: razonSocial,
			id_item: 2,
			precio: precio,
			nro_factura: nroFactura,
			id_pais: 68,
			id_padre: '',
			id_usuario: 1,
			nro_autorizacionInt: '',
			nro_facturaInt: 0,
			monto_total: montoTotal,
			id_mediciones: idMedicion,
			autoriza: 0,
			tipoAnulacion: 5,
			tipovale: 2,
			id_estacion: parseInt(idEstacion),
			tipo_int: 2,
			placa: placa,
			nro_autorizacion: nroAutorizacion,
			dependiente: 0,
			id_clDependiente: 0,
			id_transaccion: 0
		};

		try {
			const res = await facturacionService.registrarFacturaManual(payload);
			if (res.IntCodigo === 1) {
				alert('Registro Exitoso');
			} else {
				alert('Error: ' + res.StrMensaje);
			}
		} catch (e) {
			console.error(e);
			alert('Error de conexión');
		}
	}
</script>

<div
	class={`p-6 pb-6 gap-6 flex min-h-full flex-col transition-colors
    ${$dark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'}
  `}
>
	<div class="sm:flex-row gap-4 pb-1 flex flex-col justify-between">
		<h2 class="text-lg font-bold">Registro de Facturas Manuales</h2>
		<span class="text-sm text-gray-500">
			Herramientas/ Ventas/
			<a
				href="/sales/manual invoice"
				class={`
          ${$dark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-800'}
        `}
			>
				Facturas Manuales
			</a>
		</span>
	</div>
	<div
		class={`p-8 shadow-sm rounded-lg border transition-colors
       ${$dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}
   `}
	>
		<h3	 class="text-md text-lg font-medium mb-6">
			Registro de Facturas Manuales
		</h3>

		<div class="gap-y-4 gap-x-6 text-sm grid grid-cols-12 items-center">
			<!-- Fecha -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-300' : 'text-gray-700'}`}>
				Fecha Factura :
			</div>
			<div class="col-span-4">
				<div class="relative">
					<input
						type="date"
						bind:value={fechaFactura}
						class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                        ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'}
                    `}
					/>
				</div>
			</div>
			<div class={`font-bold col-span-5 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				PRODUCTO: {idManguera
					? $mangueras.find((m) => m.id_manguera === idManguera)?.descripcion
					: '-'}
			</div>

			<!-- Tipo Pago -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Tipo Pago :
			</div>
			<div class="col-span-4">
				<select
					bind:value={idTipoPago}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-600'}
               `}
				>
					{#each $tiposPago as tp}
						<option value={tp.id}>{tp.descripcion}</option>
					{/each}
				</select>
			</div>

			<!-- Referencia -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Numero Ref.:
			</div>
			<div class="col-span-4">
				<input
					type="text"
					bind:value={nroReferencia}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}
               `}
				/>
			</div>

			<!-- Manguera -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Manguera :
			</div>
			<div class="col-span-8">
				<select
					bind:value={idManguera}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-600'}
               `}
				>
					<option value={0}>Seleccione...</option>
					{#each $mangueras as m}
						<option value={m.id_manguera}>{m.descripcion}</option>
					{/each}
				</select>
			</div>
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				PRECIO: {precio.toFixed(2)}
			</div>

			<!-- Medicion -->
			<div
				class={`font-bold leading-tight col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}
			>
				Identificador de Medición :
			</div>
			<div class="col-span-8">
				<select
					bind:value={idMedicion}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-600'}
                `}
				>
					<option value={0}>-- Seleccione --</option>
					{#each mediciones as med}
						<option value={med.param3}>{med.param3} - Vol: {med.param7}</option>
					{/each}
				</select>
			</div>
			<div class="col-span-2">
				<button
					on:click={cargarMediciones}
					class="bg-orange-400 hover:bg-orange-500 text-white font-medium py-1.5 px-2 rounded text-xs shadow-sm w-full transition-colors"
				>
					Agregar_Medición
				</button>
			</div>

			<!-- Autorizacion -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				No. Autorización :
			</div>
			<div class="col-span-6">
				<input
					type="text"
					bind:value={nroAutorizacion}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}
               `}
				/>
			</div>

			<!-- Nro Factura -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				No. Factura :
			</div>
			<div class="col-span-2">
				<input
					type="number"
					bind:value={nroFactura}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-blue-400' : 'bg-white border-gray-300 text-blue-600'}
                `}
				/>
			</div>

			<!-- Tipo de Precio -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Precio :
			</div>
			<div class="gap-4 col-span-10 flex items-center">
				<label class="gap-1 flex cursor-pointer items-center">
					<input
						type="radio"
						name="price"
						value="Nacional"
						bind:group={precioType}
						class="text-blue-600 focus:ring-blue-500"
					/>
					<span class={`${$dark ? 'text-gray-300' : 'text-gray-600'}`}>Nacional</span>
				</label>
				<label class="gap-1 flex cursor-pointer items-center">
					<input
						type="radio"
						name="price"
						value="Internacional"
						bind:group={precioType}
						class="text-blue-600 focus:ring-blue-500"
					/>
					<span class={`${$dark ? 'text-gray-300' : 'text-gray-600'}`}>Internacional</span>
				</label>
			</div>

			<!-- Consumidor -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Consumidor :
			</div>
			<div class="col-span-8">
				<select
					bind:value={idConsumidor}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-600'}
                `}
				>
					{#each $tiposConsumidor as cons}
						<option value={cons.id}>{cons.descripcion}</option>
					{/each}
				</select>
			</div>
			<div class="col-span-2"></div>

			<!-- Placa -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Placa :
			</div>
			<div class="col-span-4">
				<input
					type="text"
					bind:value={placa}
					on:blur={buscarCliente}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}
                 `}
				/>
			</div>
			<div class="col-span-6"></div>

			<!-- NIT -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				NIT/CI :
			</div>
			<div class="col-span-4">
				<input
					type="text"
					bind:value={nit}
					on:blur={buscarCliente}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}
                 `}
				/>
			</div>
			<div class="col-span-6"></div>

			<!-- Razon Social -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Razón Social :
			</div>
			<div class="col-span-10">
				<input
					type="text"
					bind:value={razonSocial}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}
                  `}
				/>
			</div>

			<!-- Total -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Total Bs. :
			</div>
			<div class="col-span-4">
				<input
					type="number"
					bind:value={montoTotal}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}
                `}
				/>
			</div>
			<div class="col-span-6"></div>

			<!-- Vta Autorizada -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Vta. Autorizada Por:
			</div>
			<div class="col-span-8">
				<select
					bind:value={idUsuarioAutoriza}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-600'}
                `}
				>
					<option value={0}></option>
					<!-- Agregar usuarios o tipos aquí si están disponibles -->
				</select>
			</div>
			<div class="col-span-2"></div>

			<!-- Hoja Autoriz -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				No. Hoja de Autoriz.:
			</div>
			<div class="col-span-4">
				<input
					type="number"
					bind:value={nroHojaAutorizacion}
					class={`rounded px-3 py-1.5 focus:border-blue-400 w-full border focus:outline-none
                    ${$dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}
                `}
				/>
			</div>
			<div class="col-span-6"></div>

			<!-- Anulacion -->
			<div class={`font-bold col-span-2 text-right ${$dark ? 'text-gray-200' : 'text-gray-700'}`}>
				Tipo de Anulación:
			</div>
			<div class="gap-4 col-span-10 flex flex-wrap items-center">
				<label class="gap-1 flex cursor-pointer items-center">
					<input
						type="radio"
						name="anulacion"
						value="Anulado"
						bind:group={tipoAnulacion}
						class="text-blue-600 focus:ring-blue-500"
					/>
					<span class={`${$dark ? 'text-gray-200' : 'text-gray-700'}`}>Anulado</span>
				</label>
				<label class="gap-1 flex cursor-pointer items-center">
					<input
						type="radio"
						name="anulacion"
						value="No Utilizada"
						bind:group={tipoAnulacion}
						class="text-blue-600 focus:ring-blue-500"
					/>
					<span class={`${$dark ? 'text-gray-200' : 'text-gray-700'}`}>No Utilizada</span>
				</label>
				<label class="gap-1 flex cursor-pointer items-center">
					<input
						type="radio"
						name="anulacion"
						value="Extraviada"
						bind:group={tipoAnulacion}
						class="text-blue-600 focus:ring-blue-500"
					/>
					<span class={`${$dark ? 'text-gray-200' : 'text-gray-700'}`}>Extraviada</span>
				</label>
				<label class="gap-1 flex cursor-pointer items-center">
					<input
						type="radio"
						name="anulacion"
						value="Emitida en Contingencia"
						bind:group={tipoAnulacion}
						class="text-blue-600 focus:ring-blue-500"
					/>
					<span class={`${$dark ? 'text-gray-200' : 'text-gray-700'}`}>Emitida en Contingencia</span
					>
				</label>
			</div>
		</div>

		<div class="gap-2 mt-10 flex items-center justify-end">
			<button
				on:click={() => registrar(false)}
				class="bg-orange-400 hover:bg-orange-500 text-white font-medium py-1.5 px-4 rounded shadow-sm transition-colors"
			>
				Registrar_Factura
			</button>
			<button
				on:click={() => registrar(true)}
				class="hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded shadow-sm gap-2 flex items-center bg-[#005a9e] transition-colors"
			>
				<div class="bg-white p-0.5 rounded-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3 text-[#005a9e]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</div>
				Registrar_Factura_Anulada
			</button>
			<a
				href="/sales/maintenance"
				class={`font-medium py-1.5 px-4 rounded shadow-sm gap-2 flex items-center border transition-colors
                ${$dark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'}
           `}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				Principal
			</a>
		</div>
	</div>
</div>
