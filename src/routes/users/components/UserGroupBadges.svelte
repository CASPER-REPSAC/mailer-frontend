<script>
  export let row;
  $: groups = row.groups_obj || [];
</script>

{#if groups.length > 0}
  <div class="flex flex-wrap gap-1">
    {#each groups as group (group.name)}
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        {group.name}
      </span>
    {/each}
  </div>
{:else}
  <span class="text-xs text-gray-500">그룹 없음</span>
{/if}
