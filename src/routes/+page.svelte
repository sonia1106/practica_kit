<script lang="ts">
  import { goto } from '$app/navigation';

  let email = "info@gmail.com";
  let password = "";
  let rememberMe = false;

  function login() {
    if (email === "admin@gmail.com" && password === "123") {
      localStorage.setItem("isAuthenticated", "true");
      goto("/dashboard");
    } else {
      alert("Credenciales incorrectas");
    }
  }
</script>

<div class="flex h-screen">
  <!-- Formulario de Login -->
  <div class="w-1/2 flex items-center justify-center bg-gray-50 p-10">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h1>
      <p class="text-gray-600 mb-8">Ingrese su correo electrónico y contraseña para iniciar sesión</p>

      <form class="space-y-5" on:submit|preventDefault={login}>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico*</label>
          <input
            id="email"
            bind:value={email}
            type="email"
            placeholder="correo@ejemplo.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña*</label>
          <input
            id="password"
            bind:value={password}
            type="password"
            placeholder="Ingrese su contraseña"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              Recordarme
            </label>
          </div>
          <a href="#" class="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
        </div>

        <button
          type="submit"
          class="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  </div>

  <!-- Fondo Verde -->
  <div class="w-1/2 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-12">
    <div class="text-center text-white">
      <h1 class="text-4xl font-bold mb-4">TailAdmin</h1>
      <p class="text-xl">Plantilla gratuita y de código abierto para panel de administración</p>
    </div>
  </div>
</div>
