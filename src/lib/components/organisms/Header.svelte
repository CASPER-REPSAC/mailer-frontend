<script>
  export let title = "Mail-Manager Dashboard";
</script>

<header class="bg-gray-800 text-white p-4 flex items-center justify-between">
  <h1 class="text-xl font-bold">{title}</h1>
  <nav>
    <slot name="nav" />
  </nav>
</header>
