<script>
  export let title = "";
</script>

<div class="bg-white shadow rounded p-4 my-4">
  {#if title}
    <h2 class="text-lg font-semibold mb-2">{title}</h2>
  {/if}
  <div>
    <slot />
  </div>
</div>
