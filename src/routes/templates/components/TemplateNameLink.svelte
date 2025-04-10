<script>
  export let row;
</script>

<a
  href={`/templates/${row.name}`}
  class="text-blue-600 hover:text-blue-800 font-medium"
>
  {row.name}
</a>
