<script lang="ts">
	import { dark, toggleDark } from '$lib/stores/theme';
</script>

<footer
	class={`
  p-4 border-t text-center
  ${$dark ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}
`}
>
	<p class="text-sm">
		&copy; {new Date().getFullYear()} Petro
	</p>
</footer>
