<script>
  export let row;
</script>

<div class="flex items-center">
  <div
    class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium"
  >
    {row.name ? row.name.charAt(0).toUpperCase() : "?"}
  </div>
  <div class="ml-4">
    <div class="text-sm font-medium text-gray-900">{row.name || "N/A"}</div>
  </div>
</div>
