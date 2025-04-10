<script>
  export let items = [];
</script>

<aside class="bg-gray-100 p-4 min-h-screen">
  <ul>
    {#each items as item}
      <li class="mb-2">
        <a href={item.href} class="text-blue-500 hover:underline"
          >{item.label}</a
        >
      </li>
    {/each}
  </ul>
  <slot />
</aside>
