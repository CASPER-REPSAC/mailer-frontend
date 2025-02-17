<script>
    export let title = "Mail-Manager Dashboard";
  </script>
  
  <header class="bg-gray-800 text-white p-4 flex items-center justify-between">
    <h1 class="text-xl font-bold">{title}</h1>
    <nav>
      <!-- 네비게이션 링크 등 필요에 따른 슬롯을 활용 -->
      <slot name="nav" />
    </nav>
  </header>
  