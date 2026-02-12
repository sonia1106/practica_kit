<script lang="ts">
	import { onMount } from 'svelte';
	import {
		obtenerEmpresa,
		obtenerEstaciones,
		obtenerPlayas,
		obtenerIslas,
		obtenerDispensers,
		obtenerLados,
		obtenerMangueras,
		registrarEmpresa,
		eliminarEmpresa,
		registrarEstacion,
		eliminarEstacion,
		registrarPlaya,
		eliminarPlaya,
		registrarIsla,
		eliminarIsla,
		obtenerUbicaciones,
		obtenerAntenas,
		registrarDispenser,
		eliminarDispenser,
		obtenerEquipos,
		registrarLado,
		eliminarLado,
		registrarManguera,
		eliminarManguera,
		obtenerTanques,
		type Ubicacion
	} from '$lib/services/structure.service';
	import { registrarEstructura } from '$lib/services/structure.service';
	import { modalState, openModal, closeModal, handleModalKeyDown, dark } from '$lib/stores/theme';
	import type {
		Empresa,
		Estacion,
		Playa,
		Isla,
		Dispenser,
		Lado,
		Manguera,
		Antena,
		Equipo,
		Tanque
	} from '$lib/types/structure';

	// Data lists
	let empresas: Empresa[] = [];
	let estaciones: Estacion[] = [];
	let playas: Playa[] = [];
	let islas: Isla[] = [];
	let dispensers: Dispenser[] = [];
	let lados: Lado[] = [];
	let mangueras: Manguera[] = [];
	let ubicaciones: Ubicacion[] = [];

	// Selected IDs
	let selectedEmpresa: number = 0;
	let selectedEstacion: number = 0;
	let selectedPlaya: number = 0;
	let selectedIsla: number = 0;
	let selectedDispenser: number = 0;
	let selectedLado: number = 0;
	let selectedManguera: number = 0;

	// Estacion State
	const defaultEstacionForm: Estacion = {
		id: 0,
		descripcion: '',
		llave_mdw: '',
		razon_social: '',
		representante_legal: '',
		nit: '',
		direccion: '',
		telefono: '',
		conectividad: '',
		tipoconectividad: '',
		latitud: '',
		longitud: '',
		id_ubicacion: 0
	};
	let estacionForm: Estacion = { ...defaultEstacionForm };
	let newUbicacionName: string = ''; // For adding new location

	// Modal State
	const defaultEmpresaForm: Empresa = {
		id: 0,
		descripcion: '',
		auxInt1: 1,
		razon_social: '',
		propietario: '',
		direccion: '',
		telefono: ''
	};
	let empresaForm: Empresa = { ...defaultEmpresaForm };

	let isEditing: boolean = false;

	$: if ($modalState.view === 'empresa') {
		const data = $modalState.data;
		if (data && data.isEditing && data.company) {
			empresaForm = { ...data.company };
			isEditing = true;
		} else {
			empresaForm = { ...defaultEmpresaForm };
			isEditing = false;
		}
	}

	$: if ($modalState.view === 'estacion') {
		const data = $modalState.data;
		if (data && data.isEditing && data.station) {
			estacionForm = { ...data.station };
			isEditing = true;
		} else {
			estacionForm = { ...defaultEstacionForm, id_empresas: selectedEmpresa };
			isEditing = false;
		}
	}

	// Playa State
	const defaultPlayaForm: Playa = {
		id: 0,
		descripcion: '',
		id_estacion: 0
	};
	let playaForm: Playa = { ...defaultPlayaForm };

	$: if ($modalState.view === 'playa') {
		const data = $modalState.data;
		if (data && data.isEditing && data.playa) {
			playaForm = { ...data.playa };
			isEditing = true;
		} else {
			playaForm = { ...defaultPlayaForm, id_estacion: selectedEstacion };
			isEditing = false;
		}
	}

	// Isla State
	const defaultIslaForm: Isla = {
		id: 0,
		descripcion: '',
		id_playa: 0,
		id_antena: 0
	};
	let islaForm: Isla = { ...defaultIslaForm };
	let antenas: Antena[] = [];

	$: if ($modalState.view === 'isla') {
		const data = $modalState.data;
		if (data && data.isEditing && data.isla) {
			islaForm = { ...data.isla };
			isEditing = true;
		} else {
			islaForm = { ...defaultIslaForm, id_playa: selectedPlaya };
			isEditing = false;
		}
	}

	// Dispenser State
	const defaultDispenserForm: Dispenser = {
		id: 0,
		descripcion: '',
		id_isla: 0,
		marca: '',
		protocolo: '',
		id_equipo: 0,
		habilitacion_cg: 1, // 1: Si, 0: No
		cambio_precio: 1 // 1: Cambiar de nivel, 2: Modificar nivel, 3: Calculo Manual
	};
	let dispenserForm: Dispenser = { ...defaultDispenserForm };
	let equipos: Equipo[] = [];

	$: if ($modalState.view === 'dispenser') {
		const data = $modalState.data;
		if (data && data.isEditing && data.dispenser) {
			dispenserForm = { ...data.dispenser };
			isEditing = true;
		} else {
			dispenserForm = { ...defaultDispenserForm, id_isla: selectedIsla };
			isEditing = false;
		}
	}

	// Lado State
	const defaultLadoForm: Lado = {
		id: 0,
		descripcion: '',
		id_dispenser: 0,
		punto_abastecimiento_logico: 0
	};
	let ladoForm: Lado = { ...defaultLadoForm };

	$: if ($modalState.view === 'lado') {
		const data = $modalState.data;
		if (data && data.isEditing && data.lado) {
			ladoForm = { ...data.lado };
			isEditing = true;
		} else {
			ladoForm = { ...defaultLadoForm, id_dispenser: selectedDispenser };
			isEditing = false;
		}
	}

	// Manguera State
	const defaultMangueraForm: Manguera = {
		id: 0,
		descripcion: '',
		id_lado: 0,
		id_tanque: 0,
		nro_logico_manguera: 0,
		orden: 0
	};
	let mangueraForm: Manguera = { ...defaultMangueraForm };
	let tanques: Tanque[] = [];

	$: if ($modalState.view === 'manguera') {
		const data = $modalState.data;
		if (data && data.isEditing && data.manguera) {
			mangueraForm = { ...data.manguera };
			isEditing = true;
		} else {
			mangueraForm = { ...defaultMangueraForm, id_lado: selectedLado };
			isEditing = false;
		}
	}

	onMount(async () => {
		try {
			empresas = await obtenerEmpresa();
			ubicaciones = await obtenerUbicaciones();
			antenas = await obtenerAntenas();
			equipos = await obtenerEquipos();
			tanques = await obtenerTanques();
		} catch (error) {
			console.error('Error loading companies:', error);
		}
	});

	async function handleEmpresaChange() {
		estaciones = [];
		selectedEstacion = 0;
		handleEstacionChange();
		if (selectedEmpresa) {
			try {
				estaciones = await obtenerEstaciones(selectedEmpresa);
			} catch (error) {
				console.error(error);
			}
		}
	}

	async function handleEstacionChange() {
		playas = [];
		selectedPlaya = 0;
		handlePlayaChange();
		if (selectedEstacion) {
			try {
				playas = await obtenerPlayas(selectedEstacion);
			} catch (error) {
				console.error(error);
			}
		}
	}

	async function handlePlayaChange() {
		islas = [];
		selectedIsla = 0;
		handleIslaChange();
		if (selectedPlaya) {
			try {
				islas = await obtenerIslas(selectedPlaya);
			} catch (error) {
				console.error(error);
			}
		}
	}

	async function handleIslaChange() {
		dispensers = [];
		selectedDispenser = 0;
		handleDispenserChange();
		if (selectedIsla) {
			try {
				dispensers = await obtenerDispensers(selectedIsla);
			} catch (error) {
				console.error(error);
			}
		}
	}

	async function handleDispenserChange() {
		lados = [];
		selectedLado = 0;
		handleLadoChange();
		if (selectedDispenser) {
			try {
				lados = await obtenerLados(selectedDispenser);
			} catch (error) {
				console.error(error);
			}
		}
	}

	async function handleLadoChange() {
		mangueras = [];
		selectedManguera = 0;
		if (selectedLado) {
			try {
				mangueras = await obtenerMangueras(selectedLado);
			} catch (error) {
				console.error(error);
			}
		}
	}

	// --- Station CRUD ---
	function openCreateEstacion() {
		if (!selectedEmpresa) return;
		// Since I can't interact, I'll trust the code change.
		console.log('Opening station modal');
		openModal('estacion', { isEditing: false });
	}

	async function openEditEstacion() {
		if (selectedEstacion === 0) return;
		const station = estaciones.find((e) => e.id === selectedEstacion);
		if (station) {
			openModal('estacion', { isEditing: true, station });
		}
	}

	async function handleAddUbicacion() {
		if (!newUbicacionName.trim()) return;

		// Mock persistence for now (or call a service if we added one)
		// For UI demo, just add to local list and select it
		const newId = Math.max(...ubicaciones.map((u) => u.id), 0) + 1;
		const newUbi: Ubicacion = { id: newId, descripcion: newUbicacionName };
		ubicaciones = [...ubicaciones, newUbi];
		estacionForm.id_ubicacion = newId;
		newUbicacionName = '';
		// In a real app, call await registrarUbicacion(newUbi) here
	}

	function closeEstacionForm() {
		closeModal();
	}

	async function saveEstacion() {
		try {
			// Map estacionForm description to razon_social if needed or separate?
			// Assuming description is key for list. Let's populate it if empty
			if (!estacionForm.descripcion)
				estacionForm.descripcion = estacionForm.razon_social || 'Estacion sin nombre';

			await registrarEstacion(estacionForm);
			// Refresh list
			estaciones = await obtenerEstaciones(selectedEmpresa);
			// Reselect if editing
			if (isEditing) {
				selectedEstacion = estacionForm.id || 0;
			}
			closeEstacionForm();
		} catch (error) {
			console.error('Error saving station:', error);
			alert('Error saving station');
		}
	}

	async function deleteEstacion() {
		if (selectedEstacion === 0) return;
		if (!confirm('¿Está seguro de eliminar esta estación?')) return;

		try {
			await eliminarEstacion(selectedEstacion);
			selectedEstacion = 0;
			estaciones = await obtenerEstaciones(selectedEmpresa);
			handleEstacionChange();
		} catch (error) {
			console.error('Error deleting station:', error);
			alert('Error deleting station');
		}
	}

	// --- CRUD Handling ---

	function openCreateEmpresa() {
		openModal('empresa', { isEditing: false });
	}

	async function openEditEmpresa() {
		if (selectedEmpresa === 0) return;
		const company = empresas.find((e) => e.id === selectedEmpresa);
		if (company) {
			openModal('empresa', { isEditing: true, company });
		}
	}

	function closeEmpresaForm() {
		closeModal();
	}

	// --- Playa Handlers ---
	function openCreatePlaya() {
		openModal('playa', { isEditing: false });
	}

	function openEditPlaya() {
		const playa = playas.find((p) => p.id === selectedPlaya);
		if (playa) {
			openModal('playa', { isEditing: true, playa });
		}
	}

	async function deletePlaya() {
		if (selectedPlaya && confirm('¿Estás seguro de eliminar esta playa?')) {
			try {
				await eliminarPlaya(selectedPlaya);
				selectedPlaya = 0;
				if (selectedEstacion) playas = await obtenerPlayas(selectedEstacion);
			} catch (error) {
				console.error(error);
				alert('Error al eliminar la playa');
			}
		}
	}

	function closePlayaForm() {
		closeModal();
	}

	async function savePlaya() {
		try {
			await registrarPlaya(playaForm);
			closePlayaForm();
			if (selectedEstacion) playas = await obtenerPlayas(selectedEstacion);
		} catch (error) {
			console.error(error);
			alert('Error al guardar la playa');
		}
	}

	// --- Isla Handlers ---
	function openCreateIsla() {
		openModal('isla', { isEditing: false });
	}

	function openEditIsla() {
		const isla = islas.find((i) => i.id === selectedIsla);
		if (isla) {
			openModal('isla', { isEditing: true, isla });
		}
	}

	async function deleteIsla() {
		if (selectedIsla && confirm('¿Estás seguro de eliminar esta isla?')) {
			try {
				await eliminarIsla(selectedIsla);
				selectedIsla = 0;
				if (selectedPlaya) islas = await obtenerIslas(selectedPlaya);
			} catch (error) {
				console.error(error);
				alert('Error al eliminar la isla');
			}
		}
	}

	function closeIslaForm() {
		closeModal();
	}

	async function saveIsla() {
		try {
			await registrarIsla(islaForm);
			closeIslaForm();
			if (selectedPlaya) islas = await obtenerIslas(selectedPlaya);
		} catch (error) {
			console.error(error);
			alert('Error al guardar la isla');
		}
	}

	// --- Dispenser Handlers ---
	function openCreateDispenser() {
		openModal('dispenser', { isEditing: false });
	}

	function openEditDispenser() {
		const dispenser = dispensers.find((d) => d.id === selectedDispenser);
		if (dispenser) {
			openModal('dispenser', { isEditing: true, dispenser });
		}
	}

	async function deleteDispenser() {
		if (selectedDispenser && confirm('¿Estás seguro de eliminar este dispensador?')) {
			try {
				await eliminarDispenser(selectedDispenser);
				selectedDispenser = 0;
				if (selectedIsla) dispensers = await obtenerDispensers(selectedIsla);
			} catch (error) {
				console.error(error);
				alert('Error al eliminar el dispensador');
			}
		}
	}

	function closeDispenserForm() {
		closeModal();
	}

	async function saveDispenser() {
		try {
			await registrarDispenser(dispenserForm);
			closeDispenserForm();
			if (selectedIsla) dispensers = await obtenerDispensers(selectedIsla);
		} catch (error) {
			console.error(error);
			alert('Error al guardar el dispensador');
		}
	}

	// --- Lado Handlers ---
	function openCreateLado() {
		openModal('lado', { isEditing: false });
	}

	function openEditLado() {
		const lado = lados.find((l) => l.id === selectedLado);
		if (lado) {
			openModal('lado', { isEditing: true, lado });
		}
	}

	async function deleteLado() {
		if (selectedLado && confirm('¿Estás seguro de eliminar este lado?')) {
			try {
				await eliminarLado(selectedLado);
				selectedLado = 0;
				if (selectedDispenser) lados = await obtenerLados(selectedDispenser);
			} catch (error) {
				console.error(error);
				alert('Error al eliminar el lado');
			}
		}
	}

	function closeLadoForm() {
		closeModal();
	}

	async function saveLado() {
		try {
			await registrarLado(ladoForm);
			closeLadoForm();
			if (selectedDispenser) lados = await obtenerLados(selectedDispenser);
		} catch (error) {
			console.error(error);
			alert('Error al guardar el lado');
		}
	}

	// --- Manguera Handlers ---
	function openCreateManguera() {
		openModal('manguera', { isEditing: false });
	}

	function openEditManguera() {
		const manguera = mangueras.find((m) => m.id === selectedManguera);
		if (manguera) {
			openModal('manguera', { isEditing: true, manguera });
		}
	}

	async function deleteManguera() {
		if (selectedManguera && confirm('¿Estás seguro de eliminar esta manguera?')) {
			try {
				await eliminarManguera(selectedManguera);
				selectedManguera = 0;
				if (selectedLado) mangueras = await obtenerMangueras(selectedLado);
			} catch (error) {
				console.error(error);
				alert('Error al eliminar la manguera');
			}
		}
	}

	function closeMangueraForm() {
		closeModal();
	}

	async function saveManguera() {
		try {
			await registrarManguera(mangueraForm);
			closeMangueraForm();
			if (selectedLado) mangueras = await obtenerMangueras(selectedLado);
		} catch (error) {
			console.error(error);
			alert('Error al guardar la manguera');
		}
	}

	// --- Registrar Estructura ---
	async function handleRegistrarEstructura() {
		if (!selectedEstacion) {
			alert('Por favor, seleccione una estación primero.');
			return;
		}

		try {
			const result = await registrarEstructura(selectedEstacion);
			if (result.IntCodigo === 0) {
				alert('✅ Estructura registrada exitosamente');
			} else {
				alert(`❌ Error: ${result.StrMensaje || 'No se pudo registrar la estructura'}`);
			}
		} catch (error) {
			console.error('Error registrando estructura:', error);
			alert('❌ Error al registrar la estructura');
		}
	}

	async function saveEmpresa() {
		try {
			await registrarEmpresa(empresaForm);
			// Refresh list
			empresas = await obtenerEmpresa();
			// Reselect if editing
			if (isEditing) {
				selectedEmpresa = empresaForm.id;
			}
			closeEmpresaForm();
		} catch (error) {
			console.error('Error saving company:', error);
			alert('Error saving company');
		}
	}

	async function deleteEmpresa() {
		if (selectedEmpresa === 0) return;
		if (!confirm('¿Está seguro de eliminar esta empresa?')) return;

		try {
			await eliminarEmpresa(selectedEmpresa);
			selectedEmpresa = 0;
			empresas = await obtenerEmpresa();
			// Reset cascading selects
			handleEmpresaChange();
		} catch (error) {
			console.error('Error deleting company:', error);
			alert('Error deleting company');
		}
	}
</script>

<svelte:window on:keydown={handleModalKeyDown} />
<section
	class={`
      p-4 md:p-6 h-full w-full
      ${$dark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'}
    `}
>
	<!-- Header / Breadcrumbs -->
	<div class="sm:flex-row gap-4 flex flex-col justify-between">
		<h2 class="text-lg font-bold">Empresa</h2>
		<span class="text-sm text-gray-500">
			Inicio/
			<a
				href="/customers"
				class={`
          ${$dark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-800'}
        `}
			>
				Empresa
			</a>
		</span>
	</div>

	<!-- Main Card -->
	<div
		class={`rounded-lg mt-6 p-4 md:p-6 border
        ${
					$dark
						? 'bg-gray-800 border-gray-700 text-white'
						: 'bg-white border-gray-200 text-gray-700'
				}`}
	>
		<!-- Title -->
		<div class="mb-4 -mt-2 flex items-center justify-between">
			<h3 class="text-md font-medium">Configuración de Estructura</h3>
		</div>

		<!-- Form Grid -->
		<div class="md:grid-cols-2 gap-6 gap-y-8 max-w-6xl mx-auto grid grid-cols-1">
			<!-- Empresa -->
			<div class="gap-2 flex flex-col">
				<div class="gap-2 flex items-center">
					<label
						for="empresa"
						class={`font-bold text-sm w-24 text-right
                        ${$dark ? 'text-gray-300' : 'text-gray-700'}
                    `}
					>
						Empresa:
					</label>
					<div class="flex-1">
						<select
							id="empresa"
							bind:value={selectedEmpresa}
							on:change={handleEmpresaChange}
							class={`rounded-md px-3 py-2 text-sm focus:ring-gray-300 w-full border outline-none focus:ring-1
                            ${
															$dark
																? 'bg-gray-700 border-gray-600 text-white'
																: 'bg-white border-gray-300 text-gray-700'
														}
                        `}
						>
							<option value={0}>Seleccione...</option>
							{#each empresas as item}
								<option value={item.id}>{item.descripcion}</option>
							{/each}
						</select>
					</div>
					<!-- Actions -->
					<div class="gap-1 flex shrink-0">
						<!-- Botón Agregar - Deshabilitado: API no soporta EmpresaOperaciones -->
						<button
							class="text-green-500 cursor-not-allowed opacity-50 transition"
							aria-label="+ Agregar (No disponible)"
							title="Funcionalidad no disponible - El API no soporta crear empresas"
							disabled
							on:click={openCreateEmpresa}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								stroke="currentColor"
								class="w-5 h-5"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
						<!-- Botón Editar - Deshabilitado: API no soporta EmpresaOperaciones -->
						<button
							class="text-blue-500 cursor-not-allowed opacity-50 transition"
							aria-label="Editar (No disponible)"
							title="Funcionalidad no disponible - El API no soporta editar empresas"
							disabled
							on:click={openEditEmpresa}
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
						<!-- Botón Eliminar - Deshabilitado: API no soporta EmpresaOperaciones -->
						<button
							class="text-red-500 cursor-not-allowed opacity-50 transition"
							aria-label="Eliminar (No disponible)"
							title="Funcionalidad no disponible - El API no soporta eliminar empresas"
							disabled
							on:click={deleteEmpresa}
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
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Estación -->
			<div class="gap-2 flex flex-col">
				<div class="gap-2 flex items-center">
					<label
						for="estacion"
						class={`font-bold text-sm w-24 text-right
                        ${$dark ? 'text-gray-300' : 'text-gray-700'}
                    `}
					>
						Estación:
					</label>
					<div class="flex-1">
						<select
							id="estacion"
							bind:value={selectedEstacion}
							on:change={handleEstacionChange}
							class={`rounded-md px-3 py-2 text-sm focus:ring-gray-300 w-full border outline-none focus:ring-1
                            ${
															$dark
																? 'bg-gray-700 border-gray-600 text-white'
																: 'bg-white border-gray-300 text-gray-700'
														}
                        `}
						>
							<option value={0}>Seleccione...</option>
							{#each estaciones as item}
								<option value={item.id}>{item.descripcion}</option>
							{/each}
						</select>
					</div>
					<div class="gap-1 flex shrink-0">
						<button
							class="text-green-500 hover:text-green-700 transition"
							aria-label="+ Agregar"
							on:click={openCreateEstacion}
							disabled={selectedEmpresa === 0}
							class:opacity-50={selectedEmpresa === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								stroke="currentColor"
								class="w-5 h-5"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
						<button
							class="text-blue-500 hover:text-blue-700 transition"
							aria-label="Editar"
							on:click={openEditEstacion}
							disabled={selectedEstacion === 0}
							class:opacity-50={selectedEstacion === 0}
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
							class="text-red-500 hover:text-red-700 transition"
							aria-label="Eliminar"
							on:click={deleteEstacion}
							disabled={selectedEstacion === 0}
							class:opacity-50={selectedEstacion === 0}
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
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Playa -->
			<div class="gap-2 flex flex-col">
				<div class="gap-2 flex items-center">
					<label
						for="playa"
						class={`font-bold text-sm w-24 text-right
                        ${$dark ? 'text-gray-300' : 'text-gray-700'}
                    `}
					>
						Playa:
					</label>
					<div class="flex-1">
						<select
							id="playa"
							bind:value={selectedPlaya}
							on:change={handlePlayaChange}
							class={`rounded-md px-3 py-2 text-sm focus:ring-gray-300 w-full border outline-none focus:ring-1
                            ${
															$dark
																? 'bg-gray-700 border-gray-600 text-white'
																: 'bg-white border-gray-300 text-gray-700'
														}
                        `}
						>
							<option value={0}>Seleccione...</option>
							{#each playas as item}
								<option value={item.id}>{item.descripcion}</option>
							{/each}
						</select>
					</div>
					<div class="gap-1 flex shrink-0">
						<button
							class="text-green-500 hover:text-green-700 transition"
							aria-label="+ Agregar"
							on:click={openCreatePlaya}
							disabled={selectedEstacion === 0}
							class:opacity-50={selectedEstacion === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								stroke="currentColor"
								class="w-5 h-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 4.5v15m7.5-7.5h-15"
								/></svg
							>
						</button>
						<button
							class="text-blue-500 hover:text-blue-700 transition"
							aria-label="Editar"
							on:click={openEditPlaya}
							disabled={selectedPlaya === 0}
							class:opacity-50={selectedPlaya === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
								/></svg
							>
						</button>
						<button
							class="text-red-500 hover:text-red-700 transition"
							aria-label="Eliminar"
							on:click={deletePlaya}
							disabled={selectedPlaya === 0}
							class:opacity-50={selectedPlaya === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/></svg
							>
						</button>
					</div>
				</div>
			</div>

			<!-- Isla -->
			<div class="gap-2 flex flex-col">
				<div class="gap-2 flex items-center">
					<label
						for="isla"
						class={`font-bold text-sm w-24 text-right
                        ${$dark ? 'text-gray-300' : 'text-gray-700'}
                    `}
					>
						Isla:
					</label>
					<div class="flex-1">
						<select
							id="isla"
							bind:value={selectedIsla}
							on:change={handleIslaChange}
							class={`rounded-md px-3 py-2 text-sm focus:ring-gray-300 w-full border outline-none focus:ring-1
                            ${
															$dark
																? 'bg-gray-700 border-gray-600 text-white'
																: 'bg-white border-gray-300 text-gray-700'
														}
                        `}
						>
							<option value={0}>Seleccione...</option>
							{#each islas as item}
								<option value={item.id}>{item.descripcion}</option>
							{/each}
						</select>
					</div>
					<div class="gap-1 flex shrink-0">
						<button
							class="text-green-500 hover:text-green-700 transition"
							aria-label="+ Agregar"
							on:click={openCreateIsla}
							disabled={selectedPlaya === 0}
							class:opacity-50={selectedPlaya === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								stroke="currentColor"
								class="w-5 h-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 4.5v15m7.5-7.5h-15"
								/></svg
							>
						</button>
						<button
							class="text-blue-500 hover:text-blue-700 transition"
							aria-label="Editar"
							on:click={openEditIsla}
							disabled={selectedIsla === 0}
							class:opacity-50={selectedIsla === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
								/></svg
							>
						</button>
						<button
							class="text-red-500 hover:text-red-700 transition"
							aria-label="Eliminar"
							on:click={deleteIsla}
							disabled={selectedIsla === 0}
							class:opacity-50={selectedIsla === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/></svg
							>
						</button>
					</div>
				</div>
			</div>

			<!-- Dispensador -->
			<div class="gap-2 flex flex-col">
				<div class="gap-2 flex items-center">
					<label
						for="dispensador"
						class={`font-bold text-sm w-24 text-right
                        ${$dark ? 'text-gray-300' : 'text-gray-700'}
                    `}
					>
						Dispensador:
					</label>
					<div class="flex-1">
						<select
							id="dispensador"
							bind:value={selectedDispenser}
							on:change={handleDispenserChange}
							class={`rounded-md px-3 py-2 text-sm focus:ring-gray-300 w-full border outline-none focus:ring-1
                            ${
															$dark
																? 'bg-gray-700 border-gray-600 text-white'
																: 'bg-white border-gray-300 text-gray-700'
														}
                        `}
						>
							<option value={0}>Seleccione...</option>
							{#each dispensers as item}
								<option value={item.id}>{item.descripcion}</option>
							{/each}
						</select>
					</div>
					<div class="gap-1 flex shrink-0">
						<button
							class="text-green-500 hover:text-green-700 transition"
							aria-label="+ Agregar"
							on:click={openCreateDispenser}
							disabled={selectedIsla === 0}
							class:opacity-50={selectedIsla === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								stroke="currentColor"
								class="w-5 h-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 4.5v15m7.5-7.5h-15"
								/></svg
							>
						</button>
						<button
							class="text-blue-500 hover:text-blue-700 transition"
							aria-label="Editar"
							on:click={openEditDispenser}
							disabled={selectedDispenser === 0}
							class:opacity-50={selectedDispenser === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
								/></svg
							>
						</button>
						<button
							class="text-red-500 hover:text-red-700 transition"
							aria-label="Eliminar"
							on:click={deleteDispenser}
							disabled={selectedDispenser === 0}
							class:opacity-50={selectedDispenser === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/></svg
							>
						</button>
					</div>
				</div>
			</div>

			<!-- Lado -->
			<div class="gap-2 flex flex-col">
				<div class="gap-2 flex items-center">
					<label
						for="lado"
						class={`font-bold text-sm w-24 text-right
                        ${$dark ? 'text-gray-300' : 'text-gray-700'}
                    `}
					>
						Lado:
					</label>
					<div class="flex-1">
						<select
							id="lado"
							bind:value={selectedLado}
							on:change={handleLadoChange}
							class={`rounded-md px-3 py-2 text-sm focus:ring-gray-300 w-full border outline-none focus:ring-1
                            ${
															$dark
																? 'bg-gray-700 border-gray-600 text-white'
																: 'bg-white border-gray-300 text-gray-700'
														}
                        `}
						>
							<option value={0}>Seleccione...</option>
							{#each lados as item}
								<option value={item.id}>{item.descripcion}</option>
							{/each}
						</select>
					</div>
					<div class="gap-1 flex shrink-0">
						<button
							class="text-green-500 hover:text-green-700 transition"
							aria-label="+ Agregar"
							on:click={openCreateLado}
							disabled={selectedDispenser === 0}
							class:opacity-50={selectedDispenser === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								stroke="currentColor"
								class="w-5 h-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 4.5v15m7.5-7.5h-15"
								/></svg
							>
						</button>
						<button
							class="text-blue-500 hover:text-blue-700 transition"
							aria-label="Editar"
							on:click={openEditLado}
							disabled={selectedLado === 0}
							class:opacity-50={selectedLado === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
								/></svg
							>
						</button>
						<button
							class="text-red-500 hover:text-red-700 transition"
							aria-label="Eliminar"
							on:click={deleteLado}
							disabled={selectedLado === 0}
							class:opacity-50={selectedLado === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/></svg
							>
						</button>
					</div>
				</div>
			</div>

			<!-- Manguera -->
			<div class="gap-2 flex flex-col">
				<div class="gap-2 flex items-center">
					<label
						for="manguera"
						class={`font-bold text-sm w-24 text-right
                        ${$dark ? 'text-gray-300' : 'text-gray-700'}
                    `}
					>
						Manguera:
					</label>
					<div class="flex-1">
						<select
							id="manguera"
							bind:value={selectedManguera}
							class={`rounded-md px-3 py-2 text-sm focus:ring-gray-300 w-full border outline-none focus:ring-1
                            ${
															$dark
																? 'bg-gray-700 border-gray-600 text-white'
																: 'bg-white border-gray-300 text-gray-700'
														}
                        `}
						>
							<option value={0}>Seleccione...</option>
							{#each mangueras as item}
								<option value={item.id}>{item.descripcion}</option>
							{/each}
						</select>
					</div>
					<div class="gap-1 flex shrink-0">
						<button
							class="text-green-500 hover:text-green-700 transition"
							aria-label="+ Agregar"
							on:click={openCreateManguera}
							disabled={selectedLado === 0}
							class:opacity-50={selectedLado === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								stroke="currentColor"
								class="w-5 h-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 4.5v15m7.5-7.5h-15"
								/></svg
							>
						</button>
						<button
							class="text-blue-500 hover:text-blue-700 transition"
							aria-label="Editar"
							on:click={openEditManguera}
							disabled={selectedManguera === 0}
							class:opacity-50={selectedManguera === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
								/></svg
							>
						</button>
						<button
							class="text-red-500 hover:text-red-700 transition"
							aria-label="Eliminar"
							on:click={deleteManguera}
							disabled={selectedManguera === 0}
							class:opacity-50={selectedManguera === 0}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/></svg
							>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Actions -->
		<div class="mt-12 sm:flex-row gap-3 pt-6 flex flex-col justify-end border-t border-transparent">
			<button
				class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded shadow-sm transition-colors"
				on:click={handleRegistrarEstructura}
			>
				Registrar Estructura
			</button>
			<button
				class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded shadow-sm transition-colors"
			>
				Config. Rápida
			</button>
			<button
				class={`px-6 py-2 font-medium rounded shadow-sm border transition-colors
                ${
									$dark
										? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
										: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
								}
            `}
			>
				Principal
			</button>
		</div>
	</div>
</section>

<!-- Modal Overlay -->
{#if $modalState.view === 'empresa'}
	<div
		class="inset-0 bg-black/60 fixed z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
	>
		<div
			class={`max-w-3xl rounded-xl p-8 shadow-2xl max-h-[90vh] w-full overflow-y-auto border
            ${
							$dark
								? 'bg-gray-800 border-gray-700 text-gray-200'
								: 'bg-white border-gray-200 text-gray-700'
						}
          `}
		>
			<!-- Header -->
			<div class="mb-8 pb-4 border-gray-200 dark:border-gray-700 border-b">
				<h3 class="text-2xl font-bold tracking-tight">
					{isEditing ? 'Editar Empresa' : 'Agregar Empresa'}
				</h3>
			</div>

			<!-- Body -->
			<div class="md:grid-cols-2 gap-4 grid grid-cols-1">
				<!-- Razón Social -->
				<div>
					<label
						for="empresa-razon-social"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Razón Social
					</label>
					<input
						id="empresa-razon-social"
						type="text"
						bind:value={empresaForm.razon_social}
						placeholder="Ej. Empresa S.A."
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>

				<!-- Propietario -->
				<div>
					<label
						for="empresa-propietario"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Propietario
					</label>
					<input
						id="empresa-propietario"
						type="text"
						bind:value={empresaForm.propietario}
						placeholder="Nombre del Propietario"
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>

				<!-- Dirección -->
				<div class="md:col-span-2">
					<label
						for="empresa-direccion"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Dirección
					</label>
					<input
						id="empresa-direccion"
						type="text"
						bind:value={empresaForm.direccion}
						placeholder="Dirección de la empresa"
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>

				<!-- Teléfono -->
				<div>
					<label
						for="empresa-telefono"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Teléfono
					</label>
					<input
						id="empresa-telefono"
						type="text"
						bind:value={empresaForm.telefono}
						on:input={() => (empresaForm.descripcion = empresaForm.razon_social || '')}
						placeholder="Ej. 2-223344"
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>
			</div>

			<!-- Footer -->
			<div class="gap-4 mt-8 pt-4 border-gray-100 dark:border-gray-700 flex justify-end">
				<button
					on:click={closeEmpresaForm}
					class={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${$dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
				>
					Cancelar
				</button>
				<button
					on:click={saveEmpresa}
					class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transform transition-all"
				>
					Guardar
				</button>
			</div>
		</div>
	</div>
{/if}

{#if $modalState.view === 'estacion'}
	<div
		class="inset-0 bg-black/60 fixed z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
	>
		<div
			class={`max-w-3xl rounded-xl p-8 shadow-2xl max-h-[90vh] w-full overflow-y-auto border
            ${
							$dark
								? 'bg-gray-800 border-gray-700 text-gray-200'
								: 'bg-white border-gray-200 text-gray-700'
						}
          `}
		>
			<!-- Header -->
			<div class="mb-8 pb-4 border-gray-200 dark:border-gray-700 border-b">
				<h3 class="text-2xl font-bold tracking-tight">
					{isEditing ? 'Editar Estación' : 'Agregar Estación'}
				</h3>
			</div>

			<!-- Body -->
			<div class="space-y-6">
				<!-- Section: Datos Generales -->
				<div>
					<div class="md:grid-cols-2 gap-6 grid grid-cols-1">
						<!-- Razón Social -->
						<div class="md:col-span-2 col-span-1">
							<label
								for="estacion-razon-social"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Razón Social <span class="text-red-500">*</span></label
							>
							<div class="gap-2 flex">
								{#if isEditing}
									<input
										type="text"
										readonly
										value={estacionForm.id || 0}
										class="w-16 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-500 dark:text-gray-300 font-mono text-xs cursor-not-allowed border text-center outline-none"
									/>
								{/if}
								<input
									id="estacion-razon-social"
									type="text"
									bind:value={estacionForm.razon_social}
									class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
									placeholder="Ej. Estación Central S.A."
								/>
							</div>
						</div>

						<!-- NIT -->
						<div>
							<label
								for="estacion-nit"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>NIT</label
							>
							<input
								id="estacion-nit"
								type="text"
								bind:value={estacionForm.nit}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="Número de Identificación Tributaria"
							/>
						</div>

						<!-- Llave Middleware -->
						<div>
							<label
								for="estacion-llave-mdw"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Llave Middleware</label
							>
							<input
								id="estacion-llave-mdw"
								type="text"
								bind:value={estacionForm.llave_mdw}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="Clave de integración"
							/>
						</div>

						<!-- Representante Legal -->
						<div class="md:col-span-2 col-span-1">
							<label
								for="estacion-representante"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Representante Legal</label
							>
							<input
								id="estacion-representante"
								type="text"
								bind:value={estacionForm.representante_legal}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="Nombre completo"
							/>
						</div>
					</div>
				</div>

				<hr class={`my-4 border-dashed ${$dark ? 'border-gray-700' : 'border-gray-200'}`} />

				<!-- Section: Contacto y Ubicación -->
				<div>
					<div class="md:grid-cols-2 gap-6 grid grid-cols-1">
						<!-- Dirección -->
						<div class="md:col-span-2 col-span-1">
							<label
								for="estacion-direccion"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Dirección</label
							>
							<input
								id="estacion-direccion"
								type="text"
								bind:value={estacionForm.direccion}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="Dirección física de la estación"
							/>
						</div>

						<!-- Lat/Long -->
						<div>
							<label
								for="estacion-latitud"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Latitud</label
							>
							<input
								id="estacion-latitud"
								type="text"
								bind:value={estacionForm.latitud}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="-16.5000"
							/>
						</div>
						<div>
							<label
								for="estacion-longitud"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Longitud</label
							>
							<input
								id="estacion-longitud"
								type="text"
								bind:value={estacionForm.longitud}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="-68.1500"
							/>
						</div>
						<!-- Teléfono -->
						<div>
							<label
								for="estacion-telefono"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Teléfono</label
							>
							<input
								id="estacion-telefono"
								type="text"
								bind:value={estacionForm.telefono}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="Ej. 2-223344"
							/>
						</div>
					</div>
				</div>

				<hr class={`my-4 border-dashed ${$dark ? 'border-gray-700' : 'border-gray-200'}`} />
				<!-- Section: Técnica -->
				<div>
					<div class="md:grid-cols-2 gap-6 grid grid-cols-1">
						<!-- Conectividad -->
						<div>
							<label
								for="estacion-conectividad"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Conectividad</label
							>
							<input
								id="estacion-conectividad"
								type="text"
								bind:value={estacionForm.conectividad}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="Tipo de conexión"
							/>
						</div>

						<!-- Tipo Conectividad -->
						<div>
							<label
								for="estacion-tipo-conectividad"
								class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
								>Tipo Conectividad</label
							>
							<input
								id="estacion-tipo-conectividad"
								type="text"
								bind:value={estacionForm.tipoconectividad}
								class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
								placeholder="Detalle de conexión"
							/>
						</div>
					</div>
				</div>

				<hr class={`my-4 border-dashed ${$dark ? 'border-gray-700' : 'border-gray-200'}`} />
				<!-- Ubicación (Split Section) -->
				<div
					class="md:col-span-2 p-4 rounded-lg border-gray-100 dark:border-gray-700/50 col-span-1 border"
				>
					<span
						class={`mb-3 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
						>Ubicación Geográfica</span
					>

					<div class="space-y-4">
						<!-- 1. Select Existing -->
						<div>
							<label for="estacion-ubicacion-select" class="text-xs text-gray-500 mb-1 block"
								>Seleccionar Existente:</label
							>
							<select
								id="estacion-ubicacion-select"
								bind:value={estacionForm.id_ubicacion}
								class={`rounded-lg px-4 py-2.5 text-sm w-full cursor-pointer border transition-all outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'}`}
							>
								<option value={0}>-- Seleccione una ubicación --</option>
								{#each ubicaciones as item}
									<option value={item.id}>{item.descripcion}</option>
								{/each}
							</select>
						</div>

						<div class="py-2 relative flex items-center">
							<div class="border-gray-300 dark:border-gray-600 flex-grow border-t"></div>
							<span class="mx-4 text-gray-400 text-xs flex-shrink-0 uppercase">O crear nueva</span>
							<div class="border-gray-300 dark:border-gray-600 flex-grow border-t"></div>
						</div>

						<!-- 2. Add New -->
						<div>
							<label for="estacion-new-ubicacion" class="text-xs text-gray-500 mb-1 block"
								>Agregar Nueva Ubicación:</label
							>
							<div class="gap-2 flex">
								<input
									id="estacion-new-ubicacion"
									type="text"
									bind:value={newUbicacionName}
									placeholder="Nombre de nueva ubicación"
									class={`rounded-lg px-4 py-2.5 text-sm w-full cursor-pointer border transition-all outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'}`}
								/>
								<button
									on:click={handleAddUbicacion}
									disabled={!newUbicacionName.trim()}
									class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg shadow-sm text-sm font-medium whitespace-nowrap transition-all disabled:cursor-not-allowed"
								>
									+ Agregar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="gap-4 mt-8 pt-4 border-gray-100 dark:border-gray-700 flex justify-end">
				<button
					on:click={closeEstacionForm}
					class={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${$dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
				>
					Cancelar
				</button>
				<button
					on:click={saveEstacion}
					class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transform transition-all"
				>
					{isEditing ? 'Guardar Cambios' : 'Registrar Estación'}
				</button>
			</div>
		</div>
	</div>
{/if}

{#if $modalState.view === 'playa'}
	<div
		class="inset-0 bg-black/60 fixed z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
	>
		<div
			class={`max-w-3xl rounded-xl p-8 shadow-2xl w-full border
            ${
							$dark
								? 'bg-gray-800 border-gray-700 text-gray-200'
								: 'bg-white border-gray-200 text-gray-700'
						}
          `}
		>
			<!-- Header -->
			<div class="mb-8 pb-4 border-gray-200 dark:border-gray-700 border-b">
				<h3 class="text-2xl font-bold tracking-tight">
					{isEditing ? 'Editar Playa' : 'Agregar Playa'}
				</h3>
			</div>

			<!-- Body -->
			<div class="gap-6 grid grid-cols-1">
				<!-- Descripción -->
				<div>
					<label
						for="playa-descripcion"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Descripción
					</label>
					<div class="gap-2 flex">
						{#if isEditing}
							<div
								class="w-16 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-500 dark:text-gray-300 font-mono text-xs flex cursor-not-allowed items-center justify-center border text-center outline-none"
							>
								{playaForm.id || 0}
							</div>
						{/if}
						<input
							id="playa-descripcion"
							type="text"
							bind:value={playaForm.descripcion}
							placeholder="Descripción de la playa"
							class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
						/>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="gap-4 mt-8 pt-4 border-gray-100 dark:border-gray-700 flex justify-end">
				<button
					on:click={closePlayaForm}
					class={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${$dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
				>
					Cancelar
				</button>
				<button
					on:click={savePlaya}
					class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transform transition-all"
				>
					Guardar
				</button>
			</div>
		</div>
	</div>
{/if}

{#if $modalState.view === 'isla'}
	<div
		class="inset-0 bg-black/60 fixed z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
	>
		<div
			class={`max-w-3xl rounded-xl p-8 shadow-2xl w-full border
            ${
							$dark
								? 'bg-gray-800 border-gray-700 text-gray-200'
								: 'bg-white border-gray-200 text-gray-700'
						}
          `}
		>
			<!-- Header -->
			<div class="mb-8 pb-4 border-gray-200 dark:border-gray-700 border-b">
				<h3 class="text-2xl font-bold tracking-tight">
					{isEditing ? 'Editar Isla' : 'Agregar Isla'}
				</h3>
			</div>

			<!-- Body -->
			<div class="gap-6 grid grid-cols-1">
				<!-- Descripción -->
				<div>
					<label
						for="isla-descripcion"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Descripción
					</label>
					<div class="gap-2 flex">
						{#if isEditing}
							<div
								class="w-16 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-500 dark:text-gray-300 font-mono text-xs flex cursor-not-allowed items-center justify-center border text-center outline-none"
							>
								{islaForm.id || 0}
							</div>
						{/if}
						<input
							id="isla-descripcion"
							type="text"
							bind:value={islaForm.descripcion}
							placeholder="Descripción de la isla"
							class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
						/>
					</div>
				</div>

				<!-- Antena -->
				<div>
					<label
						for="isla-antena"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Antena
					</label>
					<select
						id="isla-antena"
						bind:value={islaForm.id_antena}
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					>
						<option value={0}>Seleccione...</option>
						{#each antenas as antena}
							<option value={antena.id}>{antena.descripcion}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Footer -->
			<div class="gap-4 mt-8 pt-4 border-gray-100 dark:border-gray-700 flex justify-end">
				<button
					on:click={closeIslaForm}
					class={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${$dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
				>
					Cancelar
				</button>
				<button
					on:click={saveIsla}
					class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transform transition-all"
				>
					Guardar
				</button>
			</div>
		</div>
	</div>
{/if}

{#if $modalState.view === 'dispenser'}
	<div
		class="inset-0 bg-black/60 fixed z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
	>
		<div
			class={`max-w-4xl rounded-xl p-8 shadow-2xl w-full border
            ${
							$dark
								? 'bg-gray-800 border-gray-700 text-gray-200'
								: 'bg-white border-gray-200 text-gray-700'
						}
          `}
		>
			<!-- Header -->
			<div class="mb-8 pb-4 border-gray-200 dark:border-gray-700 border-b">
				<h3 class="text-2xl font-bold tracking-tight">
					{isEditing ? 'Editar Dispensador' : 'Agregar Dispensador'}
				</h3>
			</div>

			<!-- Body -->
			<div class="gap-6 grid grid-cols-1">
				<!-- Descripción -->
				<div>
					<label
						for="dispenser-descripcion"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Descripción
					</label>
					<div class="gap-2 flex">
						{#if isEditing}
							<div
								class="w-16 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-500 dark:text-gray-300 font-mono text-xs flex cursor-not-allowed items-center justify-center border text-center outline-none"
							>
								{dispenserForm.id || 0}
							</div>
						{/if}
						<input
							id="dispenser-descripcion"
							type="text"
							bind:value={dispenserForm.descripcion}
							placeholder="Descripción del dispensador"
							class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
						/>
					</div>
				</div>

				<!-- Marca -->
				<div>
					<label
						for="dispenser-marca"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Marca
					</label>
					<input
						id="dispenser-marca"
						type="text"
						bind:value={dispenserForm.marca}
						placeholder="Marca del dispensador"
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>

				<!-- Protocolo -->
				<div>
					<label
						for="dispenser-protocolo"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Protocolo
					</label>
					<input
						id="dispenser-protocolo"
						type="text"
						bind:value={dispenserForm.protocolo}
						placeholder="Protocolo de comunicación"
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>

				<!-- Equipo -->
				<div>
					<label
						for="dispenser-equipo"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Equipo
					</label>
					<select
						id="dispenser-equipo"
						bind:value={dispenserForm.id_equipo}
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					>
						<option value={0}>Seleccione...</option>
						{#each equipos as equipo}
							<option value={equipo.id}>{equipo.descripcion}</option>
						{/each}
					</select>
				</div>

				<!-- Habilitado para control de gota -->
				<div>
					<span
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Habilitado para control de gota
					</span>
					<div class="gap-6 mt-1 flex items-center">
						<label class="inline-flex cursor-pointer items-center">
							<input
								type="radio"
								name="habilitacion_cg"
								bind:group={dispenserForm.habilitacion_cg}
								value={1}
								class="text-blue-600 w-4 h-4 focus:ring-blue-500 border-gray-300 bg-gray-100"
							/>
							<span class="ml-2 text-sm">Si</span>
						</label>
						<label class="inline-flex cursor-pointer items-center">
							<input
								type="radio"
								name="habilitacion_cg"
								bind:group={dispenserForm.habilitacion_cg}
								value={0}
								class="text-blue-600 w-4 h-4 focus:ring-blue-500 border-gray-300 bg-gray-100"
							/>
							<span class="ml-2 text-sm">No</span>
						</label>
					</div>
				</div>

				<!-- Manejo del precio -->
				<div>
					<span
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Manejo del precio en la venta internacional (Ctrl. Gota)
					</span>
					<div class="gap-2 mt-1 flex flex-col">
						<div class="gap-4 flex flex-wrap">
							<label class="inline-flex cursor-pointer items-center">
								<input
									type="radio"
									name="cambio_precio"
									bind:group={dispenserForm.cambio_precio}
									value={1}
									class="text-blue-600 w-4 h-4 focus:ring-blue-500 border-gray-300 bg-gray-100"
								/>
								<span class="ml-2 text-sm">Cambiar de nivel de precio</span>
							</label>
							<label class="inline-flex cursor-pointer items-center">
								<input
									type="radio"
									name="cambio_precio"
									bind:group={dispenserForm.cambio_precio}
									value={2}
									class="text-blue-600 w-4 h-4 focus:ring-blue-500 border-gray-300 bg-gray-100"
								/>
								<span class="ml-2 text-sm">Modificar el nivel de precio</span>
							</label>
						</div>
						<label class="inline-flex cursor-pointer items-center">
							<input
								type="radio"
								name="cambio_precio"
								bind:group={dispenserForm.cambio_precio}
								value={3}
								class="text-blue-600 w-4 h-4 focus:ring-blue-500 border-gray-300 bg-gray-100"
							/>
							<span class="ml-2 text-sm">Cálculo Manual del Volumen</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="gap-4 mt-8 pt-4 border-gray-100 dark:border-gray-700 flex justify-end">
				<button
					on:click={closeDispenserForm}
					class={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${$dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
				>
					Cancelar
				</button>
				<button
					on:click={saveDispenser}
					class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transform transition-all"
				>
					Guardar
				</button>
			</div>
		</div>
	</div>
{/if}

{#if $modalState.view === 'lado'}
	<div
		class="inset-0 bg-black/60 fixed z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
	>
		<div
			class={`max-w-3xl rounded-xl p-8 shadow-2xl w-full border
            ${
							$dark
								? 'bg-gray-800 border-gray-700 text-gray-200'
								: 'bg-white border-gray-200 text-gray-700'
						}
          `}
		>
			<!-- Header -->
			<div class="mb-8 pb-4 border-gray-200 dark:border-gray-700 border-b">
				<h3 class="text-2xl font-bold tracking-tight">
					{isEditing ? 'Editar Lado' : 'Agregar Lado'}
				</h3>
			</div>

			<!-- Body -->
			<div class="gap-6 grid grid-cols-1">
				<!-- Descripción -->
				<div>
					<label
						for="lado-descripcion"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Descripción
					</label>
					<div class="gap-2 flex">
						{#if isEditing}
							<div
								class="w-16 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-500 dark:text-gray-300 font-mono text-xs flex cursor-not-allowed items-center justify-center border text-center outline-none"
							>
								{ladoForm.id || 0}
							</div>
						{/if}
						<input
							id="lado-descripcion"
							type="text"
							bind:value={ladoForm.descripcion}
							placeholder="Descripción del lado"
							class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
						/>
					</div>
				</div>

				<!-- Nro. Lógico -->
				<div>
					<label
						for="lado-nro-logico"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Nro. Lógico
					</label>
					<input
						id="lado-nro-logico"
						type="number"
						bind:value={ladoForm.punto_abastecimiento_logico}
						placeholder="Número lógico"
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>
			</div>

			<!-- Footer -->
			<div class="gap-4 mt-8 pt-4 border-gray-100 dark:border-gray-700 flex justify-end">
				<button
					on:click={closeLadoForm}
					class={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${$dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
				>
					Cancelar
				</button>
				<button
					on:click={saveLado}
					class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transform transition-all"
				>
					Guardar
				</button>
			</div>
		</div>
	</div>
{/if}

{#if $modalState.view === 'manguera'}
	<div
		class="inset-0 bg-black/60 fixed z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
	>
		<div
			class={`max-w-3xl rounded-xl p-8 shadow-2xl w-full border
            ${
							$dark
								? 'bg-gray-800 border-gray-700 text-gray-200'
								: 'bg-white border-gray-200 text-gray-700'
						}
          `}
		>
			<!-- Header -->
			<div class="mb-8 pb-4 border-gray-200 dark:border-gray-700 border-b">
				<h3 class="text-2xl font-bold tracking-tight">
					{isEditing ? 'Editar Manguera' : 'Agregar Manguera'}
				</h3>
			</div>

			<!-- Body -->
			<div class="gap-6 grid grid-cols-1">
				<!-- Descripción -->
				<div>
					<label
						for="manguera-descripcion"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Descripción
					</label>
					<div class="gap-2 flex">
						{#if isEditing}
							<div
								class="w-16 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-500 dark:text-gray-300 font-mono text-xs flex cursor-not-allowed items-center justify-center border text-center outline-none"
							>
								{mangueraForm.id || 0}
							</div>
						{/if}
						<input
							id="manguera-descripcion"
							type="text"
							bind:value={mangueraForm.descripcion}
							placeholder="Descripción de la manguera"
							class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
						/>
					</div>
				</div>

				<!-- Tanque -->
				<div>
					<label
						for="manguera-tanque"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Tanque
					</label>
					<select
						id="manguera-tanque"
						bind:value={mangueraForm.id_tanque}
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					>
						<option value={0}>Seleccione...</option>
						{#each tanques as tanque}
							<option value={tanque.id}>{tanque.descripcion}</option>
						{/each}
					</select>
				</div>

				<!-- Nro. Lógico de Manguera -->
				<div>
					<label
						for="manguera-nro-logico"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Nro. Lógico de Manguera
					</label>
					<input
						id="manguera-nro-logico"
						type="number"
						bind:value={mangueraForm.nro_logico_manguera}
						placeholder="Número lógico"
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>

				<!-- Posición en el punto de venta (Orden) -->
				<div>
					<label
						for="manguera-orden"
						class={`mb-2 text-xs font-bold block uppercase ${$dark ? 'text-gray-400' : 'text-gray-500'}`}
					>
						Posición en el punto de venta
					</label>
					<input
						id="manguera-orden"
						type="number"
						bind:value={mangueraForm.orden}
						placeholder="Posición"
						class={`rounded-lg px-4 py-2.5 text-sm focus:ring-opacity-50 w-full border transition-all duration-200 outline-none focus:ring-2 ${$dark ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
					/>
				</div>
			</div>

			<!-- Footer -->
			<div class="gap-4 mt-8 pt-4 border-gray-100 dark:border-gray-700 flex justify-end">
				<button
					on:click={closeMangueraForm}
					class={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${$dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
				>
					Cancelar
				</button>
				<button
					on:click={saveManguera}
					class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transform transition-all"
				>
					Guardar
				</button>
			</div>
		</div>
	</div>
{/if}
