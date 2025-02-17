<!-- src/lib/components/Footer.svelte -->
<script>
    // 현재 연도를 동적으로 가져오기 위한 변수
    const currentYear = new Date().getFullYear();
  </script>
  
  <footer class="bg-gray-800 text-white p-4 mt-4">
    <div class="container mx-auto text-center">
      <p>&copy; {currentYear} Mail-Manager. All rights reserved.</p>
    </div>
  </footer>
  