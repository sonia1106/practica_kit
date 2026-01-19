<script lang="ts">
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { sidebarOpen, dark } from '$lib/stores/theme';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let sidebarToggle = false; // estado del sidebar
</script>

<div
	class="inset-0 bg-gray-50 fixed flex h-screen w-screen overflow-hidden transition-colors duration-300"
>
	{#if $page.url.pathname !== '/'}
		<!-- SIDEBAR -->
		<Sidebar />

		<!-- CONTENIDO -->
		<div class="min-w-0 relative flex h-full flex-1 flex-col overflow-hidden">
			<Header />

			<main class="p-0 flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
				{@render children()}
				<Footer />
			</main>
		</div>
	{:else}
		<main class="pt-16 lg:pt-0 h-full flex-1 overflow-y-auto">
			{@render children()}
		</main>
	{/if}
</div>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
