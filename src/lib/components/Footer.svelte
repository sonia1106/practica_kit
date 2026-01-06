<script lang="ts">
  import {dark, toggleDark  } from "$lib/stores/theme";
</script>

<footer class={`
  border-t p-4 text-center pl-64
  ${$dark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-custom-header border-custom-border text-gray-500'}
`}>
  <p class="text-sm">
    &copy; {new Date().getFullYear()} Petro
  </p>
</footer>

  