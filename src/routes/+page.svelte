<script lang="ts">
	import { goto } from '$app/navigation';
	// Using MOCK service for local development (no backend API needed)
	import { login } from '$lib/services/auth.service.mock';
	import { dark } from '$lib/stores/theme';

	let usuario = 'admin';
	let clave = 'petrosol@base';
	let rememberMe = false;
	let loading = false;
	let errorMessage = '';

	async function handleLogin() {
		loading = true;
		errorMessage = '';

		try {
			await login(usuario, clave);
			goto('/dashboard');
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
			console.error('Login error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class={`flex h-screen transition-colors duration-200 ${$dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
	<!-- Formulario de Login -->
	<div
		class={`p-10 lg:w-1/2 flex w-full items-center justify-center ${$dark ? 'bg-gray-900' : 'bg-white lg:bg-gray-50'}`}
	>
		<div class="max-w-md w-full">
			<!-- Logo/Icon -->
			<div class="mb-8 lg:text-left text-center">
				<div
					class={`w-16 h-16 rounded-2xl lg:mx-0 mb-4 mx-auto flex items-center justify-center ${$dark ? 'bg-blue-600' : 'bg-blue-600'}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-8 h-8 text-white"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
						/>
					</svg>
				</div>
				<h1 class={`text-3xl font-bold mb-2 ${$dark ? 'text-white' : 'text-gray-900'}`}>
					Bienvenido de nuevo
				</h1>
				<p class={`${$dark ? 'text-gray-400' : 'text-gray-600'}`}>
					Ingresa tus credenciales para continuar
				</p>
			</div>

			{#if errorMessage}
				<div
					class={`mb-6 p-4 rounded-lg gap-3 flex items-start border ${$dark ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5 mt-0.5 flex-shrink-0"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
						/>
					</svg>
					<span class="flex-1">{errorMessage}</span>
				</div>
			{/if}

			<form class="space-y-5" on:submit|preventDefault={handleLogin}>
				<div>
					<label
						for="usuario"
						class={`text-sm font-medium mb-2 block ${$dark ? 'text-gray-300' : 'text-gray-700'}`}
					>
						Usuario
					</label>
					<input
						id="usuario"
						bind:value={usuario}
						type="text"
						placeholder="Ingrese su usuario"
						required
						disabled={loading}
						class={`px-4 py-3 rounded-lg w-full border transition-all duration-200 focus:ring-2 focus:outline-none ${
							$dark
								? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-900'
								: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
						}`}
					/>
				</div>

				<div>
					<label
						for="clave"
						class={`text-sm font-medium mb-2 block ${$dark ? 'text-gray-300' : 'text-gray-700'}`}
					>
						Contraseña
					</label>
					<input
						id="clave"
						bind:value={clave}
						type="password"
						placeholder="••••••••"
						required
						disabled={loading}
						class={`px-4 py-3 rounded-lg w-full border transition-all duration-200 focus:ring-2 focus:outline-none ${
							$dark
								? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-900'
								: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'
						}`}
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							bind:checked={rememberMe}
							type="checkbox"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label
							for="remember-me"
							class={`ml-2 text-sm block ${$dark ? 'text-gray-400' : 'text-gray-700'}`}
						>
							Recordarme
						</label>
					</div>
					<a
						href="#"
						class={`text-sm font-medium ${$dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
					>
						¿Olvidaste tu contraseña?
					</a>
				</div>

				<button
					type="submit"
					disabled={loading}
					class={`py-3.5 px-4 rounded-lg shadow-lg text-sm font-semibold hover:-translate-y-0.5 w-full transform border transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed ${
						loading
							? 'bg-blue-400 border-blue-400 text-white cursor-not-allowed'
							: 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white focus:ring-blue-500 hover:shadow-blue-500/30'
					}`}
				>
					{#if loading}
						<div class="gap-2 flex items-center justify-center">
							<svg
								class="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<span>Iniciando sesión...</span>
						</div>
					{:else}
						Iniciar Sesión
					{/if}
				</button>
			</form>
		</div>
	</div>

	<!-- Panel Lateral Decorativo -->
	<div
		class={`lg:flex relative hidden w-1/2 items-center justify-center overflow-hidden ${
			$dark
				? 'from-gray-800 via-gray-900 to-black bg-gradient-to-br'
				: 'from-blue-600 via-blue-700 to-indigo-800 bg-gradient-to-br'
		}`}
	>
		<!-- Decorative circles -->
		<div class="inset-0 absolute overflow-hidden">
			<div
				class={`-top-40 -right-40 w-80 h-80 absolute rounded-full opacity-20 ${$dark ? 'bg-blue-500' : 'bg-white'}`}
			></div>
			<div
				class={`-bottom-32 -left-32 w-96 h-96 absolute rounded-full opacity-10 ${$dark ? 'bg-purple-500' : 'bg-white'}`}
			></div>
			<div
				class={`w-64 h-64 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full opacity-5 ${$dark ? 'bg-indigo-500' : 'bg-white'}`}
			></div>
		</div>

		<div class="text-white p-12 max-w-lg z-10 text-center">
			<div class="mb-8"><img src="/images/logo/logo1.png" alt="Logo" class="w-48 h-auto mx-auto mb-6 drop-shadow-2xl" /></div>
			<h1 class="text-3xl font-bold mb-6 leading-tight">Sistema de Gestión</h1>
			<p class={`text-xl leading-relaxed ${$dark ? 'text-gray-300' : 'text-blue-100'}`}>
				Plataforma integral para la administración y control de tus operaciones comerciales
			</p>
		</div>
	</div>
</div>
